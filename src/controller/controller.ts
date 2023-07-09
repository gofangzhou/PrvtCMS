import fs from 'fs';
import * as core from 'express-serve-static-core';

import jwToken from 'jsonwebtoken';
import { CONTENT_TYPE } from '../enum/enum';
import { Config } from '../ini/config';
import { Common } from '../utils/common';
import Shtmx from 'shtmx';

export class Controller {
    protected static app: core.Express
    protected static secret: any;
    static init(app: any) {
        this.app || (this.app = app);
        this.secret = this.app.get('secret');
    }

    static getTemplateFile(filePath: string) {
        filePath = filePath.replace(/[\.]+[\\\/]/g, '');
        return 'dist/view-template/'.concat(Config.templateName).concat('/').concat(filePath);
    }

    static templateAnalysis(templatePath: string, callBack: (viewContent: string) => void) {
        Shtmx.templateAnalysis({
            templatePath: templatePath,
            template: (templatePath: string, templateType: 'html') => {
                if (!/\.md$/i.test(templatePath)) {
                    templatePath = this.getTemplateFile(templatePath.concat('.html'));
                }
                try {
                    const content = fs.readFileSync(templatePath).toString();
                    if (/>>/.test(content)) {
                        return `⌈ ${templatePath} ⌋ 模板错误，请修改&gt;&gt;为&amp;gt;。`;
                    }
                    return content;
                } catch (error) {
                    return `请检查${templatePath}模板！`;
                }
            },
            result: function (viewContent: string, templateNames: string[]): void {
                callBack(viewContent);
            }
        });
    }

    static getContentType(path: string) {
        path = path.replace(/[\?]+.*$/, '');
        const type = (path.match(/[a-z0-9]+$/i) || []).join('');
        return (CONTENT_TYPE as any)[type] || 'text/html';
    }
    static getAndPost(url: string, callBack?: (req: core.Request, res: core.Response, data: any) => void) {
        this.app.get(url, (req, res, next) => {
            this.verifyToken(req, res, (data: any) => {
                callBack && callBack(req, res, data);
            })
        })

        this.app.post(url, (req, res, next) => {
            this.verifyToken(req, res, (data: any) => {
                callBack && callBack(req, res, data);
            })
        })
    }

    static get(url: string, callBack?: (req: core.Request, res: core.Response, data: any) => void) {
        this.app.get(url, (req, res, next) => {
            this.verifyToken(req, res, (data: any) => {
                callBack && callBack(req, res, data);
            })
        })
    }

    static post(url: string, callBack?: (req: core.Request, res: core.Response, data: any) => void) {

        this.app.post(url, (req, res, next) => {
            this.verifyToken(req, res, (data: any) => {
                callBack && callBack(req, res, data);
            })
        })
    }

    /**
     * 
     * @param res respones
     * @param value 被检测的值
     * @param errorMesage 
     * @returns 
     */
    static responesNullDataError(res: core.Response, value: string | number | boolean | Function, errorMesage: string): boolean {
        let valueNullState = (Common.checkType(value, 'Function') && (value as Function)()) || Common.isNullOrWhiteSpace(value);
        if (valueNullState) {
            res.status(200);
            res.json({ state: -1, message: errorMesage })
            return true;
        }
        return false;
    }

    static loginInfo(req: core.Request, isByHost?: boolean) {
        const bearerHeader = req.get(`access-authorization`);
        if (bearerHeader) {
            const jwtoken = jwToken.decode(bearerHeader as string) as any;
            return jwtoken;
        }
        else {
            return null;
        }
    }

    static verifyToken(req: any, res: any, next: any) {
        const bearerHeader = req.get(`access-authorization`);
        if (typeof bearerHeader !== 'undefined') {
            jwToken.verify(bearerHeader, Config.sessionSecret, (err: any, data: any) => {
                if (!err) {
                    next(data)
                } else {
                    //token不正确，返回401
                    res.status(401).send()
                }
            })
        } else {
            res.status(401).send({
                message: '请先登录'
            })
        }
    }

    static dateTimeToString(date: Date) {
        return date.toLocaleString().replace(/\d+/g, str => (str.length < 2 ? '0' : '') + str).replace(/\//g, '-');
    }

    static getClientIP(req: core.Request) {
        let ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req as any).connection?.socket?.remoteAddress || '';
        ip = ip.replace(/^.*:/, '');
        return ip;
    }

    static getContent404() {
        return [
            `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">`,
            `<html xmlns="http://www.w3.org/1999/xhtml">`,
            `<head>`,
            `<meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>`,
            `<title>404 - 找不到文件或目录。</title>`,
            `<style type="text/css">`,
            `<!--`,
            `body{margin:0;font-size:.7em;font-family:Verdana, Arial, Helvetica, sans-serif;background:#EEEEEE;}`,
            `fieldset{padding:0 15px 10px 15px;} `,
            `h1{font-size:2.4em;margin:0;color:#FFF;}`,
            `h2{font-size:1.7em;margin:0;color:#CC0000;} `,
            `h3{font-size:1.2em;margin:10px 0 0 0;color:#000000;} `,
            `#header{width:96%;margin:0 0 0 0;padding:6px 2% 6px 2%;font-family:"trebuchet MS", Verdana, sans-serif;color:#FFF;`,
            `background-color:#555555;}`,
            `#content{margin:0 0 0 2%;position:relative;}`,
            `.content-container{background:#FFF;width:96%;margin-top:8px;padding:10px;position:relative;}`,
            `-->`,
            `</style>`,
            `</head>`,
            `<body>`,
            `<div id="header"><h1>服务器错误</h1></div>`,
            `<div id="content">`,
            ` <div class="content-container"><fieldset>`,
            `  <h2>404 - 找不到文件或目录。</h2>`,
            `  <h3>您要查找的资源可能已被删除，已更改名称或者暂时不可用。</h3>`,
            ` </fieldset></div>`,
            `</div>`,
            `</body>`,
            `</html>`,
            ``
        ].join('\n')

    }

    static getContent403() {
        return [
            `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">`,
            `<html xmlns="http://www.w3.org/1999/xhtml">`,
            `<head>`,
            `<meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>`,
            `<title>403 - 禁止访问: 访问被拒绝。</title>`,
            `<style type="text/css">`,
            `<!--`,
            `body{margin:0;font-size:.7em;font-family:Verdana, Arial, Helvetica, sans-serif;background:#EEEEEE;}`,
            `fieldset{padding:0 15px 10px 15px;} `,
            `h1{font-size:2.4em;margin:0;color:#FFF;}`,
            `h2{font-size:1.7em;margin:0;color:#CC0000;} `,
            `h3{font-size:1.2em;margin:10px 0 0 0;color:#000000;} `,
            `#header{width:96%;margin:0 0 0 0;padding:6px 2% 6px 2%;font-family:"trebuchet MS", Verdana, sans-serif;color:#FFF;`,
            `background-color:#555555;}`,
            `#content{margin:0 0 0 2%;position:relative;}`,
            `.content-container{background:#FFF;width:96%;margin-top:8px;padding:10px;position:relative;}`,
            `-->`,
            `</style>`,
            `</head>`,
            `<body>`,
            `<div id="header"><h1>服务器错误</h1></div>`,
            `<div id="content">`,
            ` <div class="content-container"><fieldset>`,
            `  <h2>403 - 禁止访问: 访问被拒绝。</h2>`,
            `  <h3>您无权使用所提供的凭据查看此目录或页面。</h3>`,
            ` </fieldset></div>`,
            `</div>`,
            `</body>`,
            `</html>`,
            ``,
        ].join('\n')
    }

    static sendStatusInfo(res: any, status: number, content: string) {
        res.writeHead(status, { 'Content-Type': 'text/html;charset=utf-8', 'x-powered-by': Config.platformName });
        res.end(content);
    }
}