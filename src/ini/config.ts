import { Common } from "../utils/common";

let sessionSecret = '';
export class Config {
    static sqlite3DBName = './prvtcms.db'
    static get sessionSecret() {
        if (!sessionSecret) {
            sessionSecret = Common.generateRandomString(10);
        }
        return sessionSecret;
    }
    static get platformName() {
        return ['PHP', 'ASP.NET', 'NGINX'][1];
    }
    static templateName = 'default'
}