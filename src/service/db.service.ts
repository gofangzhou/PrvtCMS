import { DBBetterSqlite3 } from "../db/sqlite3.better";
import { access_statistics_model, diary_model, paging_model, site_info_model } from "../model/model";
import { access_record_model } from "../model/model";
import { article_model, article_type_model, user_model } from "../model/model";

type TTableName = 'user' | 'article_type' | 'article' | 'access_record' | 'access_statistics' | 'site_info' | 'diary';
type TSelectTableName = TTableName | 'v_article';


export class DBService {
    static init() {


        DBBetterSqlite3.createTable('user', new user_model(), 'id');
        DBBetterSqlite3.createTable('article_type', new article_type_model(), 'id');
        DBBetterSqlite3.createTable('article', new article_model(), 'id');
        DBBetterSqlite3.createTable('site_info', new site_info_model());
        DBBetterSqlite3.createTable('access_record', new access_record_model(), 'id');
        DBBetterSqlite3.createTable('access_statistics', new access_statistics_model(), 'id');

        DBBetterSqlite3.createTable('diary', new diary_model(), 'id');

        DBBetterSqlite3.prepare(`
            create view if not exists v_article as
            select    a.*,
                    b.parent_top_id,
                    b.show as type_show,
                    b.title as type_title,
                    b.flag as type_flag,
                    b.flag_type as type_flag_type
            from      article a
            left join article_type b on a.type_id = b.id `).run();


        const site_infos = this.select('site_info');
        if (!site_infos || !site_infos.length) {
            this.insert<site_info_model>('site_info', [
                { key: 'site_name', value: '', remark: '站点名称', form_type: 'input' },
                { key: 'logo', value: '', remark: '站点logo', form_type: 'upload' },
                { key: 'access_count', value: '', remark: '访问统计', form_type: 'input' },
            ]);
        }
    }
    prepare(source: string) {
        return DBBetterSqlite3.prepare(source);
    }

    static select<T>(tbName: TSelectTableName): T[] {
        return DBBetterSqlite3.select(`select * from ${tbName}`) as T[];
    }

    static selectByWhereSql<T>(tbName: TSelectTableName, whereSql: string, ...params: unknown[]): T[] {
        const stmt = DBBetterSqlite3.prepare(`SELECT * FROM ${tbName} WHERE ${whereSql}`);
        return stmt.all(params) as T[];
    }

    static selectByPaging<T>(tbName: TSelectTableName, pager: paging_model): T[] {

        const orderbyMethod = /desc[\r\t\s\n]*$/i.test(pager.order_by || '') ? 'desc' : '';
        pager.order_by = (pager.order_by || '').replace(/[\r\t\s\n]+(asc|desc)[\r\t\s\n]*/i, '');
        let stmt: any = null;
        if (orderbyMethod) {
            stmt = DBBetterSqlite3.prepare(`SELECT * FROM ${tbName} order by ${pager.order_by} desc LIMIT ? OFFSET ?`);
        }
        else {
            stmt = DBBetterSqlite3.prepare(`SELECT * FROM ${tbName} order by ${pager.order_by}  LIMIT ? OFFSET ?`);
        }

        return stmt.all(pager.page_size, (pager.page_size * (pager.page_index - 1))) as T[];
    }

    static selectTotalByPaging<T>(tbName: TSelectTableName, pager: paging_model): T[] {
        const stmt = DBBetterSqlite3.prepare(`SELECT count(1) count FROM ${tbName}`);
        return stmt.all() as T[];
    }

    static selectPagingByWhereSql<T>(tbName: TSelectTableName, pager: paging_model, whereSql: string, ...params: unknown[]): T[] {
        const orderbyMethod = /desc[\r\t\s\n]*$/i.test(pager.order_by || '') ? 'desc' : '';
        pager.order_by = (pager.order_by || '').replace(/[\r\t\s\n]+(asc|desc)[\r\t\s\n]*/i, '');
        let stmt: any = null;
        if (orderbyMethod) {
            stmt = DBBetterSqlite3.prepare(`SELECT * FROM ${tbName} WHERE ${whereSql} order by ${pager.order_by} desc  LIMIT ? OFFSET ?`);
        }
        else {
            stmt = DBBetterSqlite3.prepare(`SELECT * FROM ${tbName} WHERE ${whereSql} order by ${pager.order_by}  LIMIT ? OFFSET ?`);
        }

        return stmt.all(params, pager.page_size, (pager.page_size * (pager.page_index - 1))) as T[];
    }

    static selectTotalPagingByWhereSql<T>(tbName: TSelectTableName, pager: paging_model, whereSql: string, ...params: unknown[]): T[] {
        const stmt = DBBetterSqlite3.prepare(`SELECT count(1) count FROM ${tbName} WHERE ${whereSql}`);
        return stmt.all(params) as T[];
    }

    static insert<T>(tbName: TTableName, models: T[]) {
        if (!models || !models.length) return;
        const cols: string[] = [];
        const vals: string[] = [];
        Object.keys((models as any)[0]).forEach(key => {
            cols.push(key);
            vals.push('$'.concat(key));
        })
        const sql = `INSERT INTO ${tbName} (${cols.join(',')}) VALUES (${vals.join(',')})`;
        const insert = DBBetterSqlite3.prepare(sql);
        models.forEach((model: any) => {
            const model2 = {} as any;
            Object.keys(model).forEach(key => model2[key] = model[key]);
            insert.run(model2);
        });
    }

    static update<T, T2>(tbName: TTableName, models: T[], whereModels: any[]) {
        if (!models || !models.length) return;
        if (!whereModels || !whereModels.length) return;
        if (models.length != whereModels.length) return;

        const sets: string[] = [];
        const wheres: string[] = [];
        Object.keys((models as any)[0]).forEach(key => {
            sets.push(`${key} = ?`);
        })
        Object.keys((whereModels as any)[0]).forEach(key => {
            wheres.push(`${key} = ?`);
        })

        const sql = `UPDATE ${tbName} set ${sets.join(',')} WHERE ${wheres.join(' and ')}`;
        const update = DBBetterSqlite3.prepare(sql);
        models.forEach((model: any, index) => {
            const datas: any[] = [];
            Object.keys((models as any)[0]).forEach(key => {
                datas.push(model[key]);
            })
            Object.keys(whereModels[index]).forEach(key => {
                datas.push(whereModels[index][key]);
            })
            update.run(...datas);
        });
    }

    static delete(tbName: TTableName, id: any) {
        const del = DBBetterSqlite3.prepare(`DELETE FROM ${tbName} WHERE id = ?`);
        del.run(id);
    }
}
