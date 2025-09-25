/**
 * 下载代码文件请求参数
 */
export interface CodeGenRequest {
    /** 库名 / schema（MySQL 为库名，Oracle 为 schema/用户名） */
    schemaName: string
    /** 待生成的表名列表 */
    tableNames: string[]
    /** 作者名（写入文件头注释） */
    author: string
    /** 业务注释（用于 Controller 类注释等） */
    comment: string
    /** 顶级包名：如 com.shany.server.modules */
    packageName: string
    /** 模块名：如 system、auth、risk 等 */
    moduleName: string
    /** 可选：实体父类（FQN），默认读取配置 */
    baseEntityFqn?: string
    /** 可选：父类中已有的公共字段（逗号分隔） */
    superEntityColumns?: string
    /** 可选：移除的表前缀（逗号分隔），如 t_, sys_ */
    tablePrefix?: string
    /** 可选：是否启用 Lombok */
    enableLombok?: boolean
    /** 可选：是否生成 @RestController 风格 */
    enableRestStyle?: boolean
}

/**
 * 表信息列表
 */
export interface CodegenTable {
    /** 表名 */
    tableName: string
    /** 表描述 */
    tableComment: string
    /** 类型 */
    engine: string
    /** 创建时间 */
    createTime: string
}

/** 查询表详情条件字段 */
export interface CodegenTableFilter {
    /** 库名  */
    dbName?: string | null
    /** 表名（支持模糊） */
    tableName?: string
}
