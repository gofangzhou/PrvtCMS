import fs from 'fs';
import { Controller } from "./controller";
import path from 'path';
import { DBService } from '../service/db.service';
import { article_model, article_type_model, article_type_model_view, paging_model, site_info_model, v_article_model } from '../model/model';
import { Common } from '../utils/common';
const Mustache = require('mustache');

Mustache.escape = function (text: any) { return text; };
export class WebController extends Controller {
    static init(app: any) {
        super.init(app);
        this.index();
        this.list();
        this.detail();
        this.view();
    }

    static initNavs(navs: article_type_model[]) {
        navs.forEach(nav => {
            const navAny = nav as any;
            navAny.link = `/content/${nav.id}/1`;
            if (nav.external_link) {
                navAny.link = nav.external_link;
            }
            if (/^0$/.test(nav.flag_type as any)) {
                navAny.link = '/';
            }
        })
    }

    static initNews(news: v_article_model[]) {
        news.forEach(item => {
            const itemAny = item as any;
            itemAny.publish_date = (item.publish_datetime || '').substring(0, 10);
            itemAny.link = `/content/${item.type_id}/1/${item.id}`;
        })
    }

    static index() {
        this.app.get('/', (req, res) => {
            res.status(200);
            res.set('Content-Type', 'text/html');

            let status = false;
            this.templateAnalysis('index', viewContent => {
                if (!status) {
                    status = true;
                    const options: any = {};
                    const site_infos: site_info_model[] = DBService.select('site_info');
                    site_infos?.forEach(p => {
                        options[`site_info_${p.key}`] = (p.value || '').replace(/[\n\r]+/g, '<br />');
                    })
                    const navAll = DBService.select<article_type_model>('article_type');
                    const navs = DBService.selectByWhereSql<article_type_model>('article_type', 'flag=? and show=?', 0, 1).sort((a, b) => a.sort < b.sort ? -1 : 1);
                    navs.some(item => {
                        item.title == '首页' && ((item as any).active = 'active');
                        return item.title == '首页';
                    })
                    this.initNavs(navs);

                    options.navs = Common.arrayToTree<article_type_model>(navs, 'id', 'parent_id', 'child', '');
                    options.news = DBService.selectByWhereSql<v_article_model>('v_article', 'show_home=? and type_flag = ? and type_flag_type>?', 1, 0, 0);
                    options.banners = DBService.selectByWhereSql('v_article', 'type_flag=? and show_home=?', 2, 1);
                    options.modules = DBService.selectByWhereSql('v_article', 'type_flag=? and show_home=?', 3, 1);

                    navAll.forEach((item) => {
                        options[`type_id=='${item.id}'`] = function () {
                            return function (text: string, render: Function) {
                                return eval('this').type_id === item.id ? render(text) : "";
                            };
                        };
                    });

                    this.initNews(options.news);



                    viewContent = Mustache.render(viewContent, options, {}, ['{%', '%}']);//.replace(/<ul>[\s\n]*<\/ul>/g, '');
                    res.send('<!-- PrvtCMS -->\n' + viewContent);
                }
            })
            setTimeout(() => {
                if (!status) {
                    status = true;
                    res.send('服务器响应超时！');
                }
            }, 10000);
        })
    }

    static list() {
        this.app.get(/\/content\/\d+\/\d+(\/\d+)*$/, (req, res) => {
            res.status(200);
            res.set('Content-Type', 'text/html');

            let status = false;
            const [type_id, page_index, article_id] = req.path.match(/(\d+)/g) || [];

            const options: any = {};
            const site_infos: site_info_model[] = DBService.select('site_info');
            site_infos?.forEach(p => {
                options[`site_info_${p.key}`] = (p.value || '').replace(/[\n\r]+/g, '<br />');
            })
            const navs = DBService.selectByWhereSql<article_type_model>('article_type', 'flag=? and show=?', 0, 1).sort((a, b) => a.sort < b.sort ? -1 : 1);
            this.initNavs(navs);
            options.navs = Common.arrayToTree<article_type_model>(navs, 'id', 'parent_id', 'child', '');

            (options.navs as article_type_model_view[]).forEach(elementNav => {

                elementNav.active = '';
                elementNav.activeState = false;
                elementNav.activeOrChildActiveState = false;

                if (elementNav.id == type_id) {
                    elementNav.active = 'active';
                    elementNav.activeState = true;
                    elementNav.activeOrChildActiveState = true;
                }

                elementNav.child?.forEach(elementNav2 => {
                    elementNav2.active = '';
                    elementNav2.activeState = false;
                    elementNav2.activeOrChildActiveState = false;
                    if (elementNav2.id == type_id) {
                        elementNav.childActive = 'active';
                        elementNav2.active = 'active';

                        elementNav.childActiveState = true;
                        elementNav2.activeState = true;

                        elementNav.activeOrChildActiveState = true;
                        elementNav2.activeOrChildActiveState = true;
                    }

                    elementNav2.child?.forEach(elementNav3 => {
                        elementNav3.active = '';
                        elementNav3.activeState = false;
                        elementNav3.activeOrChildActiveState = false;
                        if (elementNav3.id == type_id) {

                            elementNav.childActive = 'active';
                            elementNav2.childActive = 'active';
                            elementNav3.active = 'active';

                            elementNav.childActiveState = true;
                            elementNav2.childActiveState = true;
                            elementNav3.activeState = true;

                            elementNav.activeOrChildActiveState = true;
                            elementNav2.activeOrChildActiveState = true;
                            elementNav3.activeOrChildActiveState = true;
                        }
                    })
                })
            });



            const pager: paging_model = {
                page_index: (page_index || '1') as any,
                page_size: 15,
                order_by: 'publish_datetime desc'
            };

            let templatePath: string = '';
            let parent_top_id: string | number = type_id || '';
            navs.some(nav => {
                if (nav.id == type_id) {
                    pager.page_size = nav.page_size;
                    templatePath = nav.flag_type.toString();
                    parent_top_id = nav.parent_top_id || type_id || '';
                }
                return nav.id == type_id;
            })

            if (article_id) {
                templatePath = 'detail';
            }

            options.type_id = type_id;
            if (article_id) {
                options.news = DBService.selectPagingByWhereSql('v_article', pager, '(id=?)', article_id);
            } else {
                options.news = DBService.selectPagingByWhereSql('v_article', pager, '(type_id=? or parent_top_id=?) and type_flag=? ', type_id, type_id, 0);
            }

            options.banners = DBService.selectByWhereSql('v_article', 'type_flag=? and parent_top_id=?', 2, parent_top_id);
            options.modules = DBService.selectByWhereSql('v_article', 'type_flag=? and parent_top_id=?', 3, parent_top_id);

            const rowsTotal = DBService.selectTotalPagingByWhereSql('v_article', pager, '(type_id=? or parent_top_id=?)', type_id, type_id) as any[];
            const newsPageTotal = parseInt((rowsTotal[0].count / pager.page_size).toString()) + ((rowsTotal[0].count % pager.page_size) ? 1 : 0);


            options.pager = {
                page_prev: pager.page_index == 1 ? 1 : pager.page_index - 1,
                page_next: pager.page_index == newsPageTotal ? newsPageTotal : pager.page_index + 1,
                page_total: newsPageTotal,
                page_count: rowsTotal[0].count,
                pages: new Array(newsPageTotal).fill(1).map((key, index) => { return { page_index: index + 1, page_index_name: index + 1, page_active: '' } }).filter((key, index) => {

                    if (index + 1 == pager.page_index) {
                        (key as any).page_active = 'active';
                        return true;
                    } if (index == 0) return true;
                    if (index + 1 == newsPageTotal) {

                        return true;
                    }
                    if (index + 4 >= pager.page_index && index <= pager.page_index) return true;
                    if (index - 4 <= pager.page_index && index >= pager.page_index) return true;
                    if (index + 5 == pager.page_index || index - 5 == pager.page_index) {
                        (key as any).page_index_name = '···';
                        return true;
                    }
                    return false;
                }),
            };

            this.initNews(options.news);

            this.templateAnalysis(templatePath, viewContent => {
                if (!status) {
                    status = true;
                    viewContent = Mustache.render(viewContent, options, {}, ['{%', '%}']);//.replace(/<ul>[\s\n]*<\/ul>/g, '');
                    res.send(viewContent);
                }
            })
            setTimeout(() => {
                if (!status) {
                    status = true;
                    res.send('服务器响应超时！');
                }
            }, 10000);
        })
    }

    static detail() {
        this.app.get(/\/co2ntent\/\d+\/\d+\/\d+/, (req, res) => {
            res.status(200);
            res.set('Content-Type', 'text/html');

            let status = false;
            const [type_id, page_index, article_id] = req.path.match(/(\d+)/g) || [];

            const options: any = {};
            const navs = DBService.selectByWhereSql<article_type_model>('article_type', 'flag=?', 0).sort((a, b) => a.sort < b.sort ? -1 : 1);
            this.initNavs(navs);
            options.navs = Common.arrayToTree<article_type_model>(navs, 'id', 'parent_id', 'child', '');

            const pager: paging_model = {
                page_index: (page_index || '1') as any,
                page_size: 15,
                order_by: 'publish_datetime desc'
            };

            let templatePath: string = '';
            navs.some(nav => {
                if (nav.id == type_id) {
                    pager.page_size = nav.page_size;
                    templatePath = nav.flag_type.toString();
                }
                return nav.id == type_id;
            })

            options.news = DBService.selectPagingByWhereSql('v_article', pager, '(id=?)', article_id);
            options.banners = DBService.selectByWhereSql('v_article', 'type_flag=? and parent_top_id=?', 2, type_id);
            options.modules = DBService.selectByWhereSql('v_article', 'type_flag=? and parent_top_id=?', 3, type_id);

            this.initNews(options.news);


            this.templateAnalysis('detail', viewContent => {
                if (!status) {
                    status = true;
                    viewContent = Mustache.render(viewContent, options, {}, ['{%', '%}']);//.replace(/<ul>[\s\n]*<\/ul>/g, '');
                    res.send(viewContent);
                }
            })
            setTimeout(() => {
                if (!status) {
                    status = true;
                    res.send('服务器响应超时！');
                }
            }, 10000);
        })
    }

    static view() {
        this.app.get(/[a-zA-Z_\-]$/, (req, res, next) => {
            if (/^\/api/.test(req.path)) return next();

            res.status(200);
            res.set('Content-Type', 'text/html');

            let status = false;
            this.templateAnalysis('views' + req.path, viewContent => {
                if (!status) {
                    status = true;
                    const options: any = {};
                    const navs = DBService.selectByWhereSql<article_type_model>('article_type', 'flag=?', 0).sort((a, b) => a.sort < b.sort ? -1 : 1);
                    this.initNavs(navs);
                    options.navs = Common.arrayToTree<article_type_model>(navs, 'id', 'parent_id', 'child', '');
                    viewContent = Mustache.render(viewContent, options, {}, ['{%', '%}']);//.replace(/<ul>[\s\n]*<\/ul>/g, '');
                    res.send(viewContent);
                }
            })
            setTimeout(() => {
                if (!status) {
                    status = true;
                    res.send('服务器响应超时！');
                }
            }, 10000);
        })
    }
}