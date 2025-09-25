<!-- src/views/login/index.vue -->
<template>
  <div class="relative w-full h-screen overflow-hidden bg-white">
    <FloatingBlobs/>

    <div class="absolute inset-0 flex items-center justify-center z-10">
      <div
          class="backdrop-blur-2xl bg-white/60 border border-gray-200 shadow-xl p-8 md:p-10 rounded-2xl w-[360px] md:w-[420px]">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-semibold">登录</h1>
        </div>

        <n-form ref="formRef" :model="formModel" :rules="rules" size="large">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="formModel.username" placeholder="请输入用户名" @keyup.enter="handleLogin"/>
          </n-form-item>

          <n-form-item path="password" label="密码">
            <n-input v-model:value="formModel.password" type="password" show-password-on="mousedown"
                     placeholder="请输入密码" @keyup.enter="handleLogin"/>
          </n-form-item>

          <n-form-item v-if="showCaptcha" path="captcha" label="验证码">
            <div class="flex w-full items-center gap-3">
              <n-input v-model:value="formModel.captcha" maxlength="6" placeholder="请输入验证码"
                       @keyup.enter="handleLogin"/>
              <img
                  v-if="captchaImg"
                  :src="captchaImg"
                  class="h-10 w-24 cursor-pointer rounded border"
                  title="点击刷新验证码"
                  @click="loadCaptcha"
                  alt=""/>
            </div>
          </n-form-item>

          <div class="flex items-center justify-between mb-2">
            <n-checkbox v-model:checked="formModel.remember">记住我</n-checkbox>
            <n-button text type="primary" @click="goForgot">忘记密码？</n-button>
          </div>

          <n-button type="primary" class="w-full mt-2" :loading="submitting" @click="handleLogin">
            {{ submitting ? '正在登录...' : '登录' }}
          </n-button>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {RouteLocationRaw} from 'vue-router'
import {useRoute, useRouter} from 'vue-router'
import type {FormInst, FormRules} from 'naive-ui'
import {message} from '@/utils/message'
import {useAuthStore} from '@/store/auth.ts'
import {authApi} from '@/api'
import {toDataUrl} from "@/utils/format";

// 本地定义一个表单类型，避免依赖你项目里的 LoginParams 路径差异
interface LoginFormModel {
  username: string
  password: string
  remember: boolean
  captcha?: string
  captchaUuid?: string
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

/** ==== 连续失败 N 次后才显示验证码 ==== */
const FAIL_LIMIT = 3
const failCount = ref<number>(Number(sessionStorage.getItem('login_fail_count') || 0))
const showCaptcha = ref(failCount.value >= FAIL_LIMIT)

/** ==== 验证码数据 ==== */
const captchaImg = ref<string>('')
const captchaUuid = ref<string>('')

const formModel = reactive<LoginFormModel>({
  username: '',
  password: '',
  remember: true,
  captcha: '',
  captchaUuid: ''
})

const rules: FormRules = {
  username: [{required: true, message: '请输入用户名'}],
  password: [{required: true, message: '请输入密码'}],
  captcha: [
    {required: computed(() => showCaptcha.value) as any, message: '请输入验证码'}
  ]
}

async function loadCaptcha() {
  try {
    const res = await authApi.getCaptcha()
    captchaUuid.value = res.data.uuid
    captchaImg.value = toDataUrl(res.data.img)
    formModel.captchaUuid = captchaUuid.value
  } catch {
    message.error('获取验证码失败')
  }
}


function goForgot() {
  message.info('请联系管理员重置密码')
}

async function handleLogin() {
  await formRef.value?.validate()
  submitting.value = true
  try {
    await auth.login({
      username: formModel.username.trim(),
      password: formModel.password,
      captcha: showCaptcha.value ? formModel.captcha?.trim() : undefined,
      captchaUuid: showCaptcha.value ? formModel.captchaUuid : undefined,
      remember: formModel.remember
    } as any)
    // 成功：清零计数、清空验证码并跳转
    failCount.value = 0
    sessionStorage.setItem('login_fail_count', '0')
    showCaptcha.value = false
    captchaImg.value = ''
    captchaUuid.value = ''
    formModel.captcha = ''
    const redirect = (route.query.redirect as string) || '/'
    await router.replace(redirect as RouteLocationRaw)
    message.success('登录成功')
  } catch (e) {
    // 失败计数 & 判断是否要展示/刷新验证码
    failCount.value += 1
    sessionStorage.setItem('login_fail_count', String(failCount.value))
    if (failCount.value >= FAIL_LIMIT && !showCaptcha.value) {
      showCaptcha.value = true
      await loadCaptcha()
    } else if (showCaptcha.value) {
      await loadCaptcha()
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (auth.isLoggedIn) {
    router.replace('/')
    return
  }
  if (showCaptcha.value) loadCaptcha()
})
</script>
