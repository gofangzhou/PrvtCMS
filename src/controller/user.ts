import * as core from 'express-serve-static-core';
import { STATECODE } from "../enum/enum";
import { Config } from "../ini/config";
import { user_model } from "../model/model";
import { DBService } from "../service/db.service";
import { Common } from "../utils/common";
import { Controller } from "./controller";

export class UserController extends Controller {
    static init(app: any) {
        super.init(app);
        this.login();
        this.modifyPass();
    }

    /**
     * 验证码检查
     * @param req 
     * @param res 
     * @returns 
     */
    static captchaError(req: core.Request, res: core.Response) {
        let captcha: string;
        captcha = req.body.captcha?.toLowerCase() || '';

        const session = req.session as any;
        const sessionCaptcha: any = session?.captcha;

        if (!sessionCaptcha) {
            res.status(200);
            res.json({ state: -1, stateCode: STATECODE.登录验证码已经失效, message: '验证码已失效，请重新获取！' });
            return true;
        }

        if (captcha != sessionCaptcha) {
            session.captcha = new Date().getTime();
            res.status(200);
            res.json({ state: -1, stateCode: STATECODE.登录验证码输入错误, message: '验证码输入错误！' });
            return true;
        }

        return false;
    }

    /**
     * 登录
     */
    static login() {
        this.app.post("/api/user/login", (req: core.Request, res) => {

            if (this.captchaError(req, res)) {
                return;
            }

            res.status(200);
            const session = req.session as any;

            //清空验证码
            session.captcha = '';

            const model = new user_model();
            model.account = (req.body.account || '').toLowerCase();
            const users = DBService.select<user_model>('user');
            // 先查询账号，再比对密码。
            model.password = req.body.password || '';

            const currentUsers = users.filter(user => user.account == model.account);

            if (currentUsers.length) {

                const passCheck = users.some(user => user.account == model.account && user.password == model.password);
                if (!passCheck) {
                    return res.json({ state: -1, stateCode: STATECODE.登录账号或密码错误, message: '登录账号或密码错误。' });
                }
                const token = Common.createToken({ id: currentUsers[0].id, is_tourist: 1 || 0 }, Config.sessionSecret);
                res.setHeader('Access-Authorization', token);
                res.json({ state: 1, is_tourist: 1 || 0, token });
            }
            else {

                /**
                 * 如果当前站点没有这个账号，则开始注册。
                 */
                if (Common.isNullOrWhiteSpace(model.password)) {
                    return res.json({ state: -1, stateCode: STATECODE.注册密码__不能为空, message: '登录密码不能为空，请重新输入！' });
                }

                // if (!/^\d{11}$/.test(model.account)) {
                if (Common.isNullOrWhiteSpace(model.account)) {
                    return res.json({ state: -1, stateCode: STATECODE.注册手机__不能为空, message: '手机号格式不正确，请重新输入！' });
                }

                if (users.length > 0) {
                    return res.json({ state: -1, stateCode: STATECODE.注册失败未开启注册, message: '注册失败，当前站点未开启注册功能，请联系管理员。' });
                }

                const accountOneStatus = users.some(p => p.account == model.account);
                if (accountOneStatus) {
                    return res.json({ state: -1, stateCode: STATECODE.注册失败未开启注册, message: '注册失败，账号已存在！' });
                }

                /** 添加注册账号 */
                const userModel = new user_model();
                userModel.name = model.account;
                userModel.account = model.account;
                userModel.password = model.password;
                DBService.insert('user', [userModel]);

                // res.json({ state: -1, stateCode: STATECODE.注册成功且自动登录, message: '注册成功，正在自动登录！' });
                const token = Common.createToken({ id: model.account, org_domain: req.headers.host, is_tourist: 1 }, Config.sessionSecret);
                res.setHeader('Access-Authorization', token);
                res.json({ state: 1, is_tourist: 1, token });
            }

        });
    }

    static modifyPass() {
        this.post('/api/user/modifyPass', (req, res, data) => {
            res.status(200);
            if (Common.isNullOrWhiteSpace(req.body.originalPassword)) {
                res.json({ state: -1, stateCode: STATECODE.登录密码__不能为空, message: '原始密码不能为空！' });
                return;
            }

            if (Common.isNullOrWhiteSpace(req.body.newPassword)) {
                res.json({ state: -1, stateCode: STATECODE.登录密码__不能为空, message: '新密码不能为空！' });
                return;
            }

            const users = DBService.select<user_model>('user');
            /**
             * 1、查询系统中是否有指定账号
             * 2、默认加载账号对应的第一个组织的信息。
             */
            const model = new user_model();
            model.id = data.id;
            // 先查询账号，再比对密码。
            model.password = req.body.originalPassword;
            let status = false;

            users.some(user => {
                if (user.id = model.id) {
                    status = true;
                    if (user.password != req.body.originalPassword) {
                        res.json({ state: -1, stateCode: STATECODE.登录账号或密码错误, message: '原始密码不正确！' });
                    }
                    else {
                        const password = req.body.newPassword;
                        DBService.update('user', [{ password }], [{ id: model.id }])
                        res.json({ state: 1, message: '修改成功！' });
                    }
                }
                return user.id = model.id;
            })
            status || res.json({ state: -1, stateCode: STATECODE.登录账号或密码错误, message: '登录账号有误！' });
        });
    }
};