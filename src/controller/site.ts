import * as core from 'express-serve-static-core';
import { STATECODE } from "../enum/enum";
import { Config } from "../ini/config";
import { site_info_model, user_model } from "../model/model";
import { DBService } from "../service/db.service";
import { Common } from "../utils/common";
import { Controller } from "./controller";

export class SiteController extends Controller {
    static init(app: any) {
        super.init(app);
        this.site_info();
        this.site_info_update();
    }

    /**
     * 登录
     */
    static site_info() {

        const siteInfos: site_info_model[] = DBService.select('site_info') || [];
        this.setTheme(siteInfos);

        this.post("/api/site/info", (req, res) => {
            const siteInfos = DBService.select('site_info') || [];
            res.status(200).json({ state: 1, data: siteInfos })
        });
    }

    static setTheme(configs: site_info_model[]) {
        configs?.some(p => {
            if (p.key == 'theme') {
                Config.templateName = p.value || 'default';
            }
            return p.key == 'theme';
        })
    }

    static site_info_update() {
        this.post('/api/site/info/update', (req, res, data) => {


            const siteInfos: site_info_model[] = DBService.select('site_info') || [];
            const inserts: site_info_model[] = [];

            res.status(200);
            const list = req.body.list as site_info_model[];
            list.forEach(item => {
                const status = siteInfos.some(p => {
                    if (p.key == item.key) {
                        p.value = item.value;
                    }
                    return p.key == item.key;
                })

                if (!status) {
                    inserts.push({
                        key: item.key,
                        value: item.value,
                        remark: item.remark || '',
                        form_type: item.form_type || 'input'
                    })
                }
            })




            DBService.update('site_info', siteInfos, siteInfos.map(item => { return { key: item.key } }));
            if (inserts && inserts.length) {
                DBService.insert('site_info', inserts);
            }

            this.setTheme(list);
            res.json({ state: 1, message: '保存成功！' })
        });
    }
};