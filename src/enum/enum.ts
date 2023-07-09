
export enum ORG_TYPE {
    '组织' = 1,
    '部门' = 2,
    '小组' = 3,
    '个人' = 9
}

/** 语言 */
export enum LANGUAGE {
    /** 阿尔巴尼亚语 */
    sq = "sq",
    /** 阿拉伯语 */
    ar = "ar",
    /** 阿姆哈拉语 */
    am = "am",
    /** 阿萨姆语 */
    as = "as",
    /** 阿塞拜疆语 */
    az = "az",
    /** 爱尔兰语 */
    ga = "ga",
    /** 爱沙尼亚语 */
    et = "et",
    /** 奥里亚语 */
    or = "or",
    /** 保加利亚语 */
    bg = "bg",
    /** 冰岛语 */
    is = "is",
    /** 波兰语 */
    pl = "pl",
    /** 波斯尼亚语 */
    bs = "bs",
    /** 波斯语 */
    fa = "fa",
    /** 藏语 */
    bo = "bo",
    /** 达里语 */
    prs = "prs",
    /** 鞑靼语 */
    tt = "tt",
    /** 丹麦语 */
    da = "da",
    /** 德语 */
    de = "de",
    /** 迪维希语 */
    dv = "dv",
    /** 俄语 */
    ru = "ru",
    /** 法语 */
    fr = "fr",
    /** 法语 (加拿大) */
    fr_CA = "fr-CA",
    /** 菲律宾语 */
    fil = "fil",
    /** 斐济语 */
    fj = "fj",
    /** 芬兰语 */
    fi = "fi",
    /** 高棉语 */
    km = "km",
    /** 格鲁吉亚语 */
    ka = "ka",
    /** 古吉拉特语 */
    gu = "gu",
    /** 哈萨克语 */
    kk = "kk",
    /** 海地克里奥尔语 */
    ht = "ht",
    /** 韩语 */
    ko = "ko",
    /** 荷兰语 */
    nl = "nl",
    /** 加泰罗尼亚语 */
    ca = "ca",
    /** 捷克语 */
    cs = "cs",
    /** 卡纳达语 */
    kn = "kn",
    /** 克雷塔罗奥托米语 */
    otq = "otq",
    /** 克林贡语 (拉丁文) */
    tlh_Latn = "tlh-Latn",
    /** 克罗地亚语 */
    hr = "hr",
    /** 库尔德语 (北) */
    kmr = "kmr",
    /** 库尔德语 (中) */
    ku = "ku",
    /** 拉脱维亚语 */
    lv = "lv",
    /** 老挝语 */
    lo = "lo",
    /** 立陶宛语 */
    lt = "lt",
    /** 罗马尼亚语 */
    ro = "ro",
    /** 马耳他语 */
    mt = "mt",
    /** 马拉地语 */
    mr = "mr",
    /** 马拉加斯语 */
    mg = "mg",
    /** 马拉雅拉姆语 */
    ml = "ml",
    /** 马来语 */
    ms = "ms",
    /** 马其顿语 */
    mk = "mk",
    /** 毛利语 */
    mi = "mi",
    /** 孟加拉语 */
    bn = "bn",
    /** 缅甸语 */
    my = "my",
    /** 苗语 */
    mww = "mww",
    /** 南非荷兰语 */
    af = "af",
    /** 尼泊尔语 */
    ne = "ne",
    /** 旁遮普语 */
    pa = "pa",
    /** 葡萄牙语 (巴西) */
    pt = "pt",
    /** 葡萄牙语 (葡萄牙) */
    pt_PT = "pt-PT",
    /** 普什图语 */
    ps = "ps",
    /** 日语 */
    ja = "ja",
    /** 瑞典语 */
    sv = "sv",
    /** 萨摩亚语 */
    sm = "sm",
    /** 塞尔维亚语 (拉丁文) */
    sr_Latn = "sr-Latn",
    /** 塞尔维亚语 (西里尔文) */
    sr_Cyrl = "sr-Cyrl",
    /** 书面挪威语 */
    nb = "nb",
    /** 斯洛伐克语 */
    sk = "sk",
    /** 斯洛文尼亚语 */
    sl = "sl",
    /** 斯瓦希里语 */
    sw = "sw",
    /** 塔希提语 */
    ty = "ty",
    /** 泰卢固语 */
    te = "te",
    /** 泰米尔语 */
    ta = "ta",
    /** 泰语 */
    th = "th",
    /** 汤加语 */
    to = "to",
    /** 提格利尼亚语 */
    ti = "ti",
    /** 土耳其语 */
    tr = "tr",
    /** 土库曼语 */
    tk = "tk",
    /** 威尔士语 */
    cy = "cy",
    /** 维吾尔语 */
    ug = "ug",
    /** 乌尔都语 */
    ur = "ur",
    /** 乌克兰语 */
    uk = "uk",
    /** 乌兹别克语 */
    uz = "uz",
    /** 西班牙语 */
    es = "es",
    /** 希伯来语 */
    he = "he",
    /** 希腊语 */
    el = "el",
    /** 匈牙利语 */
    hu = "hu",
    /** 亚美尼亚语 */
    hy = "hy",
    /** 意大利语 */
    it = "it",
    /** 因纽特语 */
    iu = "iu",
    /** 印地语 */
    hi = "hi",
    /** 印度尼西亚语 */
    id = "id",
    /** 英语 */
    en = "en",
    /** 尤卡特克玛雅语 */
    yua = "yua",
    /** 粤语 (繁体) */
    yue = "yue",
    /** 越南语 */
    vi = "vi",
    /** 中文 (繁体) */
    zh_Hant = "zh-Hant",
    /** 中文 (简体) */
    zh_Hans = "zh-Hans",
    /** 祖鲁语 */
    zu = "zu",
    /** Bashkir */
    ba = "ba",
    /** Chinese (Literary) */
    lzh = "lzh",
    /** Inuinnaqtun */
    ikt = "ikt",
    /** Inuktitut (Latin) */
    iu_Latn = "iu-Latn",
    /** Kyrgyz */
    ky = "ky",
    /** Mongolian (Cyrillic) */
    mn_Cyrl = "mn-Cyrl",
    /** Mongolian (Traditional) */
    mn_Mong = "mn-Mong",
    /** Somali */
    so = "so",
    /** Upper Sorbian */
    hsb = "hsb"
}

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
    list = 1,
    /** 多列图 封面图片、标题、描述、时间，一行多条*/
    image_cols = 2,
    /** 多行图 封面图片、标题、描述，时间，一行一条 */
    image_rows = 3,
    /** 多列图文 */
    image_text_cols = 4,
    /** 多行图文 */
    image_text_rows = 5,
    /** 多行日历 时间线*/
    calendar_rows = 6,
    /** 产品 */
    product = 7
}

export enum STATECODE {
    注册账号__不能为空 = '100001',
    注册手机__不能为空 = '100002',
    注册密码__不能为空 = '100003',
    注册验证码不能为空 = '100004',
    注册人名称不能为空 = '100005',
    注册证件号不能为空 = '100006',
    证件号不能重复注册 = '100007',
    手机号不能重复注册 = '100008',
    注册成功且自动登录 = '100009',
    注册成功不自动登录 = '100010',

    注册失败未开启注册 = '100091',

    // 登录
    登录账号__不能为空 = '100101', // 0
    登录手机__不能为空 = '100111', // 1
    登录密码__不能为空 = '100121', // 2
    登录账号或密码错误 = '100122', // 2
    登录验证码不能为空 = '100131', // 3
    登录验证码已经失效 = '100132', // 3
    登录验证码输入错误 = '100133', // 3

}

export enum CONTENT_TYPE {
    html = 'text/html',
    text = 'text/plain',
    js = 'text/javascript',
    css = 'text/css',
    ico = 'image/x-icon',
    gif = 'image/gif',
    png = 'image/png',
    jpg = 'image/jpeg',
    jpeg = 'image/jpeg',
    jre = 'image/jpeg',
    ttf = 'application/octet-stream',
    woff2 = 'application/octet-stream',
    woff = 'application/font-woff',
    map = 'text/javascript',
    mp4 = 'video/mp4'
}