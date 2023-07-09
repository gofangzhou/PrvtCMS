export enum ARTICLE_FLAG {
    default = '',
    /** 文章类型 */
    article_type = 0,
    /** banner */
    banner = 2,
    /** 模块 */
    module = 3,
    /** 后台管理视图 */
    manage_view = 4
}

export enum ARTICLE_FLAG_TYPE {
    default = '',
    /** 首页 */
    index = 0,
    /** 普通：标题 事件 */
    list_text = 1,
    /** 多列图 封面图片、标题、描述、时间，一行多条*/
    list_image_cols = 2,
    /** 多行图 封面图片、标题、描述，时间，一行一条 */
    list_image_rows = 3,
    /** 多列图文 */
    list_image_text_cols = 4,
    /** 多行图文 */
    list_image_text_rows = 5,
    /** 多行日历 时间线*/
    list_calendar_rows = 6,
    /** 产品 */
    list_product = 7
}

export class paging_model {
    page_index: number = 1
    page_size: number = 10
    order_by?: string = 'id asc'
}

export class user_model {
    /** 用户ID */
    id?: number = 0
    /** 用户名称 */
    name: string = ''
    /** 用户账号 */
    account: string = ""
    /** 用户密码 */
    password: string = ""
}


export class article_type_model {
    id?: number = 0
    /** 父ID */
    parent_id: number = 0
    /** 顶层ID */
    parent_top_id: number = 0
    /** 排序 */
    sort: number = 0
    /** 标识类型 */
    flag: ARTICLE_FLAG = 0
    /** 标识类型 */
    flag_type: ARTICLE_FLAG_TYPE = 0
    /** 名称 */
    title: string = ''
    /** 关键词 */
    keyword: string = ''
    /** 描述 */
    description: string = ''
    /** 是否显示 */
    show: 1 | 0 = 1
    /** 图标 */
    icon: string = ''
    /** 外链 */
    external_link: string = ''
    /** 每页大小 */
    page_size: number = 15
}

export class article_type_model_view extends article_type_model {
    child?: article_type_model_view[]
    active: 'active' | '' = '';
    activeState: boolean = false;
    activeOrChildActiveState: boolean = false;

    childActive: 'active' | '' = ''
    childActiveState: boolean = false
}


/** 文章 */
export class article_model {
    /** ID */
    id?: number = 0
    /** 类型ID */
    type_id: number = 0
    /** 用户ID */
    user_id: number = 0
    /** 标题 */
    title: string = ''
    /** 关键词 */
    keyword: string = ''
    /** 描述 */
    description: string = ''
    /** 封面图片地址 */
    cover_image: string = ''
    /** 文章内容 */
    content: string = ''
    /** 内容类型（富文本） */
    content_type: string = ''
    /** 是否显示 */
    show: 1 | 0 = 1
    /** 首页显示 */
    show_home: 1 | 0 = 1
    /** 创建时间 */
    create_datetime: string = ''
    /** 发布时间 */
    publish_datetime: string = ''
    /** 外链（当外链失效时，显示发布的内容-） */
    external_link: string = ''
    /** 原文链接 */
    original_link: string = ''
}

export class v_article_model extends article_model {
    parent_top_id: number = 0
    type_title: string = ''
    type_show: number = 1
    type_flag: ARTICLE_FLAG = 0
    type_flag_type: ARTICLE_FLAG_TYPE = 0
}

/**
 * 页面访问统计
 */
export class access_record_model {
    id?: number = 0

    device_info: string = ''
    ip: string = ''
    domain: string = ''
    url: string = ''
    prev_url_info: string = ''
    open_datetime: string = ''
    /** 在线时长（秒） */
    online_duration: number = 0
}

/**
 * 站点访问统计
 */
export class access_statistics_model {
    id?: number = 0
    ip: string = ''
    open_date: string = ''
}


/** 站点信息 */
export class site_info_model {
    key: string = ''
    value: string = ""
    remark: string = ""
    form_type: 'input' | 'textarea' | 'upload' = 'input'
}


export class diary_model {
    id?: number = 0
    uid: number = 0
    /** 日记所属日期 */
    date: string = ''
    /** 标题 */
    title: string = ''
    /** 内容 */
    content: string = ''
    /** 心情 */
    mood: string | 'happy' | 'sad' | 'angry' | 'neutral' = ''
    /** 标签 */
    tag: string = ''

    /** 创建时间 */
    created_at: string = ""
    /** 更新时间 */
    updated_at: string = ""
}