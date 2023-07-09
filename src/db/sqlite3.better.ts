

import database, { Database } from 'better-sqlite3';
import { Config } from '../ini/config';
import { Common } from '../utils/common';

let db: Database = null as any;
const databaseOptions = {
    //verbose: console.log
};
export class DBBetterSqlite3 {

    static get db() {
        if (db) return db;
        db = new database(Config.sqlite3DBName, databaseOptions);
        return db;
    }

    static prepare(source: string) {
        return this.db.prepare(source);
    }

    static fieldToTableCol(model: any, key: string) {
        const dataType = Common.checkType(model[key], 'Number') ? 'INTEGER' : 'TEXT';
        return `${key} ${dataType}`;
    }

    static createTable(tbName: string, model: any, pkey?: string) {
        const cols: string[] = [];
        if (pkey) {
            const numType = Common.checkType(model[pkey] || 0, 'Number');
            cols.push(this.fieldToTableCol(model, pkey || '').concat(' PRIMARY KEY ').concat(numType ? 'AUTOINCREMENT' : ''));
        }
        Object.keys(model).forEach(key => {
            if (pkey && key == pkey) return;
            cols.push(this.fieldToTableCol(model, key));
        })
        const sql = `CREATE TABLE IF NOT EXISTS ${tbName} (${cols.join(',')})`;
        this.prepare(sql).run();
    }

    /** 查询 */
    static select(selectSql: string) {
        const select_stmt = this.prepare(selectSql);
        return select_stmt.all();
    }

    /**
     * 执行SQL
     * @param sql sql语句 create table | insert into
     * @param data 参数
     * @param callback 回调函数
     */
    static excuteSql(sql: string, datas: any[] | null, callback: (error: Error | null) => void) {
        this.db.transaction(() => {
            const stmt = this.prepare(sql);
            if (datas && datas.length) {
                stmt.run(...datas);
            }
            else {
                stmt.run();
            }
        })();
        callback && callback(null);
    }

    /**
     * 批量插入
     * @param sql sql语句 insert into
     * @param data 参数
     * @param callback 回调函数
     */
    static excuteSqlListDatas(sql: string, datas: any[][] | null, callback: (error: Error | null) => void) {
        this.db.transaction(() => {
            const stmt = this.prepare(sql);
            if (datas && datas.length) {
                datas.map(data => stmt.run(...data));
            }
            else {
                stmt.run();
            }
        })();
        callback && callback(null);
    }

    /**
     * 错误处理
     * @param err 数据库错误消息
     * @param message 返回消息
     * @returns 
     */
    private static error(err: Error | null, message: string) {
        const error: any = err ? { message } : null;
        if (err) {
            // ... 记录日志
        }
        return error;
    }

    /**关闭链接 */
    static close(callBack: (error: Error | null) => void) {
        this.db || callBack(null);
        this.db && this.db.close() && callBack(null);
    }
}
