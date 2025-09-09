/* 存放数据库实体表类型， 具体内容在 ./entities */
declare namespace Entity {
}

/* 各类接口返回的数据类型， 具体内容在 ./api */
declare namespace Api {

}

interface Window {
    $loadingBar: import('naive-ui').LoadingBarApi
    $dialog: import('naive-ui').DialogApi
    $message: import('naive-ui').MessageApi
    $notification: import('naive-ui').NotificationApi
}