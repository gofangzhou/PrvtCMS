import * as core from 'express-serve-static-core';

const svgCaptcha = require('svg-captcha')
import session from "express-session";


export class CaptchaController {
    private static app: core.Express
    private static secret: any;
    static init(app: any) {
        this.app = app;
        this.secret = this.app.get('secret');
        this.create();
    }

    static create() {
        this.app.get("/api/captcha/create", (req:any, res) => {
            const captcha = svgCaptcha.create({
                width: 100,
                height: 34,
                noise: 1
            });

            // session方式存储
            if (req.session) {
                req.session.captcha = captcha.text.toLowerCase();   
            }

            // 客户端token方式存储
            /*
            const token = Common.createToken({ captcha: captcha.text }, this.secret);
            res.setHeader('Access-Captcha', token);
            */

            // 生成图片
            res.type('svg');
            res.status(200).send(captcha.data);
        });
    }
}