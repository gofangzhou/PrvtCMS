import './utils/string/string'
import './utils/object/object'

import path from 'path';
import express from 'express';
import session from "express-session";
import cookieParser from 'cookie-parser';
import { Config } from './ini/config';
import { DBService } from './service/db.service';
import { ArticleController } from './controller/article';
import { UserController } from './controller/user';
import { CaptchaController } from './controller/captcha';
import { FileController } from './controller/file';
import { WebController } from './controller/web';
import { AppController } from './controller/app';
import { AccessStatisticsController } from './controller/access-statistics';
import { SiteController } from './controller/site';



var compression = require('compression');
const app = express();
//解决跨域问题
const cors = require("cors");
// 中间件 获取参数的
const bodyParser = require("body-parser");

//app.use(compression());
app.use(session({
    secret: Config.sessionSecret,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 4 } as session.CookieOptions,
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser());
app.set(`secret`, Config.sessionSecret);
app.use('/files', express.static(path.resolve('dist', "files")));
app.use('/statics', express.static(path.resolve('dist', "statics")));
app.use('/admin', express.static(path.resolve('dist', "admin")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: (origin: any, callback: any) => {
        return callback(null, true)
    },
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Access-Authorization',
    credentials: true
}));


DBService.init();
AppController.init(app);
AccessStatisticsController.init(app);
CaptchaController.init(app);
ArticleController.init(app);
UserController.init(app);
FileController.init(app);
WebController.init(app);
SiteController.init(app);



const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })

const startServerByPort = (port: string | number) => {
    var server = app.listen(port, () => {
        var host = (server.address() as any).address;
        var port = (server.address() as any).port;
        console.log("服务器启动成功了端口是", port);
    });
}

const startServer = () => {
    readline.question(`请输入启动端口：`, (name: string) => {
        readline.close();
        startServerByPort(name);
    });
}

const inputPwd = () => {
    readline.question(`请输入：`, (name: string) => {
        if (name == `_+[]:"./`) {
            console.clear();
            startServer();
        }
        else {
            console.log(`输入错误！`);
            inputPwd();
        }
    })
}

if (/node.exe$/.test(process.execPath)) {
    startServerByPort(8081)
}
else {
    inputPwd();
}