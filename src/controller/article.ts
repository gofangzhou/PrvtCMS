import { article_model, article_type_model, paging_model, v_article_model } from "../model/model";
import { DBService } from "../service/db.service";
import { Common } from "../utils/common";
import { Controller } from "./controller";


export class ArticleController extends Controller {
    static init(app: any) {
        super.init(app);

        this.addArticleType();
        this.getPagingArticleType();
        this.deleteArticleType();

        this.addArticle();
        this.getPagingArticle();
        this.deleteArticle();

    }

    static addArticleType() {
        this.post('/api/article/addOrUpdateArticleType', (req, res, data) => {
            const paging: paging_model = {
                page_index: 1,
                page_size: 1
            };
            const model = {
                id: req.body.id
            } as article_type_model;

            let rows: article_type_model[] | null = null;
            if (model.id) {
                rows = DBService.selectByWhereSql<article_type_model>('article_type', 'id = ?', model.id);
            }

            let isUpdate = false;
            if (rows && rows.length) {
                isUpdate = true;
            }

            const sort = req.body.sort;
            const parent_id = req.body.parent_id;
            const parent_top_id = req.body.parent_top_id;

            /** 类型表实体 */
            const article_type: article_type_model = {
                parent_id,
                parent_top_id,
                sort,
                flag: req.body.flag || 0,
                flag_type: req.body.flag_type || req.body.article_type_flag || 0,
                title: req.body.title,
                keyword: req.body.keyword,
                description: req.body.description,
                show: req.body.show,
                page_size: req.body.page_size || 15,
                external_link: req.body.external_link || '',
                icon: req.body.icon || '',
            };

            if (req.body.type_id) {
                article_type.id = req.body.type_id;
            }

            if (this.responesNullDataError(res, req.body.title, '菜单名称不能为空！')) { return; }
            if (this.responesNullDataError(res, req.body.article_type_flag, '菜单标识类型不能为空！')) { return; }
            article_type.parent_top_id = article_type.parent_top_id || article_type.id || 0;
            if (isUpdate) {
                if (!article_type.parent_top_id || /^0$/.test(article_type.parent_top_id as any)) {
                    article_type.parent_top_id = article_type.id || 0;
                }
                DBService.update('article_type', [article_type], [{ id: article_type.id }]);
                res.status(200);
                res.json({ state: 1, message: '保存成功！', data: { id: article_type.id } })
            }
            else {
                DBService.insert('article_type', [article_type]);
                if (!article_type.parent_top_id || /^0$/.test(article_type.parent_top_id as any)) {
                    let datas = DBService.selectPagingByWhereSql<article_type_model>('article_type', { page_index: 1, page_size: 1, order_by: 'id desc' }, 'title=?', article_type.title);
                    if (datas && datas.length) {
                        datas[0].parent_top_id = datas[0].id || 0;
                        DBService.update('article_type', [datas[0]], [{ id: datas[0].id }]);
                    }
                }
                res.status(200);
                res.json({ state: 1, message: '保存成功！', data: { id: article_type.id } })
            }
        })
    }

    static getPagingArticleType() {
        this.app.get('/api/article/getPagingArticleType', (req, res) => {
            this.verifyToken(req, res, (data: any) => {
                const paging: paging_model = {
                    page_index: req.query.index || 1 as any,
                    page_size: req.query.size || 10 as any,
                    order_by: 'sort asc'
                };
                const model = {} as article_type_model;
                const rows = DBService.selectByPaging<article_type_model>('article_type', paging)
                rows.forEach((row: any) => { row.type_id = row.id; });
                res.status(200);
                res.json({ state: 1, data: rows })
            })
        })
    }



    static deleteArticleType() {
        this.app.get('/api/article/deleteArticleType', (req, res) => {
            this.verifyToken(req, res, (data: any) => {
                DBService.delete('article_type', req.query.type_id || req.query.id);
                res.status(200);
                // if (err) {
                //     return res.json({ state: -1, message: err.message });
                // }
                res.json({ state: 1, message: '删除成功！' });
            })
        })
    }


    static addArticle() {
        this.post('/api/article/addOrUpdateArticle', (req, res, data) => {
            const paging: paging_model = {
                page_index: 1,
                page_size: 1
            };
            const model = {
                //id: req.body.id
            } as article_model;
            const rows = DBService.selectByWhereSql<article_model>('article', 'id=?', req.body.id);


            // if (error) {
            //     res.status(500).send({
            //         message: '数据格式有误或服务器错误！'
            //     })
            //     return;
            // }

            let isUpdate = false;
            if (rows && rows.length) {
                isUpdate = true;
            }

            const article: article_model = {
                title: req.body.title,
                keyword: req.body.keyword,
                description: req.body.description,
                show: req.body.show,
                user_id: 0,
                cover_image: req.body.cover_image || '',
                content: req.body.content || '',
                show_home: req.body.show_home == 1 ? 1 : 0,
                create_datetime: "",
                publish_datetime: req.body.publish_datetime || '',
                external_link: req.body.external_link || '',
                original_link: req.body.original_link || '',
                type_id: req.body.type_id,
                content_type: ""
            };

            if (req.body.id) {
                article.id = req.body.id;
            }

            if (this.responesNullDataError(res, req.body.type_id, '所属分类（类型）不能为空！')) { return; }
            if (this.responesNullDataError(res, req.body.title, '标题名称不能为空！')) { return; }

            if (isUpdate) {
                DBService.update('article', [article], [{ id: article.id }]);
                res.status(200);
                res.json({ state: 1, message: '保存成功！' })
            }
            else {
                DBService.insert('article', [article]);
                res.status(200);
                res.json({ state: 1, message: '保存成功！' });
            }
        })
    }

    static getPagingArticle() {
        this.app.get('/api/article/getPagingArticle', (req, res) => {
            this.verifyToken(req, res, (data: any) => {
                const paging: paging_model = {
                    page_index: req.query.index || 1 as any,
                    page_size: req.query.size || 10 as any,
                    order_by: 'publish_datetime desc'

                };
                const model = {} as v_article_model;

                let rows: v_article_model[] = [];
                let total: number = 0;

                if (req.query.type_id) {
                    model.type_id = req.query.type_id as any;
                    rows = DBService.selectPagingByWhereSql<v_article_model>('v_article', paging, ' type_id = ?', req.query.type_id);
                    total = DBService.selectTotalPagingByWhereSql<any>('v_article', paging, ' type_id = ?', req.query.type_id)[0].count as any;
                }
                if (req.query.article_id) {
                    rows = DBService.selectPagingByWhereSql<v_article_model>('v_article', paging, ' id = ?', req.query.article_id);
                    total = DBService.selectTotalPagingByWhereSql<any>('v_article', paging, ' id = ?', req.query.article_id)[0].count as any;
                }

                res.status(200);
                rows && rows.map(item => {
                    (item as any).article_id = item.id;
                    item.keyword = item.keyword || '';
                    item.description = item.description || '';
                    return item;
                })
                res.json({ state: 1, data: rows, total });

            })
        })
    }

    static deleteArticle() {
        this.app.get('/api/article/deleteArticle', (req, res) => {
            this.verifyToken(req, res, (data: any) => {
                DBService.delete('article', req.query.article_id);
                res.status(200);
                res.json({ state: 1, message: '删除成功！' });
            })
        })
    }


}