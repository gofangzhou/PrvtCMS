import { Config } from "../ini/config";
import { access_record_model } from "../model/model";
import { DBService } from "../service/db.service";
import { Controller } from "./controller";


function dateTimeToString(date: Date) {
    return date.toLocaleString().replace(/\d+/g, str => (str.length < 2 ? '0' : '') + str).replace(/\//g, '-');
}

function getClientIP(req: any) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req as any).connection?.socket?.remoteAddress || '';
    ip = ip.replace(/^.*:/, '');
    return ip;
}
export class AppController extends Controller {
    static init(app: any) {
        super.init(app);
        this.reqCheck();
    }

    static reqCheck() {

        this.app.all("*", (req: any, res: any, next: any) => {

            const checkEventPath = /chat-write-event/.test(req.path)

            if (checkEventPath == false) {
                let content = (req.body.content ? ('#' + req.body.content) : '');
                content = content.replace(/(-[\d\.]+)+$/, '');
                content = content.replace(/^[\r\t\s\n]+/, '').replace(/[\r\t\s\n]+$/, '')
                const model: access_record_model = {
                    device_info: req.headers['user-agent'],
                    ip: this.getClientIP(req),
                    domain: req.headers.host,
                    url: req.path + content,
                    prev_url_info: req.headers.referer,
                    open_datetime: new Date().toLocaleString().replace(/[\\\/]/g, '-').replace(/\d+/g, str => str.length > 1 ? str : ('0' + str)),
                    online_duration: 0
                };



                DBService.insert('access_record', [model]);
            }

            if (req.path == '/access-statistics') {
                return next();
            }

            if (/\.+[\\\/]/.test(req.path)) {
                return this.sendStatusInfo(req, 404, this.getContent404());
            }

            try {

                // const model = {
                //     id: nanoid(),
                //     ip: getClientIP(req),
                //     device_info: req.headers['user-agent'],
                //     url: req.path,
                //     open_datetime: dateTimeToString(new Date()),
                //     prev_url_info: req.headers.referer,
                //     domain: req.headers.host,
                // };

                if (/\/[\.\_]+\//.test(req.path)) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

                if (/\/([^\\\/]+).(php|asp|aspx|jsp|java|class|json|action|db|DS_Store|suspected|dbo).*$/.test(req.path)) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

                if (/\/wp-/.test(req.path)) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

                if (/^\/(institution|fest|haenda|tidigt|lagra|[a-z]{2}|medicinsk|reformera|foerst|aaaaaaaaaa|manage|simpla|debug)\//.test(req.path)) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

                if (/^\/(institution|fest|haenda|tidigt|lagra|[a-z]{2}|medicinsk|reformera|foerst|aaaaaaaaaa|manage|simpla|debug)$/.test(req.path)) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

                if (!req.headers['user-agent']) {
                    res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
                    res.end(Controller.getContent403());
                    return;
                }

            } catch (error) {
                return;
            }


            res.header("x-powered-by", Config.platformName);
            if (/^\/api\//.test(req.path)) {
                // res.header('Access-Control-Allow-Origin', req.headers.origin);
                // res.header("Access-Control-Allow-Credentials", "true");
                // res.header("Access-Control-Allow-Headers", "Access-Authorization, Origin, X-Requested-With, Content-Type, Accept");
                // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                // res.header("Content-Type", "application/json;charset=utf-8");
                // res.header('Access-Control-Expose-Headers', 'Access-Authorization, Access-Captcha, Content-Length, Content-Type')

                // if (req.method == "OPTIONS") return res.send(200);/*让options请求快速返回*/
                // else return 
                next();
            }
            else return next();

        });
    }
}