import { nanoid } from "nanoid";
import { Config } from "../ini/config";
import { Controller } from "./controller";
import { DBService } from "../service/db.service";
import { access_statistics_model, site_info_model } from "../model/model";

export class AccessStatisticsController extends Controller {
    static init(app: any) {
        super.init(app);
        this.access();
    }

    static access() {
        this.app.get('/access-statistics', (req, res) => {
            const model = {
                ip: this.getClientIP(req),
                open_date: this.dateTimeToString(new Date()).substring(0, 13),
            };

            const rows = DBService.selectPagingByWhereSql<access_statistics_model>('access_statistics', { page_index: 1, page_size: 1, order_by: 'open_date desc' }, ' ip = ? and open_date = ? ', model.ip, model.open_date);
            if (rows && rows.length) {
                return res.status(200).end('');
            }

            DBService.insert('access_statistics', [model]);
            const access_counts = DBService.selectByWhereSql<site_info_model>('site_info', 'key=?', 'access_count');
            if (access_counts && access_counts.length) {
                const value = (+access_counts[0].value) + 1;
                DBService.update('site_info', [{ value }], [{ key: 'access_count' }]);
            }
            res.status(200).end('');
        });
    }
}