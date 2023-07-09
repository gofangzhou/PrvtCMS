import fs from "fs";
import path from "path";

import formidable from 'formidable';
import { Controller } from "./controller";
import { Common } from "../utils/common";
const FILE_FOLDER = 'dist/files/upload/image'
// const TMP_FOLDER = 'template/temp'

//const ueditor = require('ueditor');

let count = 0;

/**
 * 获取随机数
 */
function getRandom() {
    return Math.random().toString(36).slice(-3)
}

/**
 * 给文件名加后缀，如 a.png 转换为 a-123123.png
 * @param {string} fileName 文件名
 */
function genRandomFileName(fileName = '') {
    // 如 fileName === 'a.123.png'

    const r = getRandom()
    if (!fileName) return r

    const length = fileName.length // 9
    const pointLastIndexOf = fileName.lastIndexOf('.') // 5
    if (pointLastIndexOf < 0) return `${fileName}-${r}`

    const fileNameWithOutExt = fileName.slice(0, pointLastIndexOf) // "a.123"
    const ext = fileName.slice(pointLastIndexOf + 1, length) // "png"
    return `${fileNameWithOutExt}-${r}.${ext}`
}

export class FileController extends Controller {
    static init(app: any) {
        super.init(app);

        this.upload();
        this.ueditor();
    }

    static uploadSave(req: any, res: any, next?: Function, callback?: (files: { url: string, alt: string }[]) => void) {
        const imgLinks: any[] = [];
        const form = formidable({ multiples: true });
        form.parse(req as any, (err, fields, files) => {
            //console.log(files)
            // if (err) {
            //     reject('formidable, form.parse err', err.stack)
            // }
            // 存储图片的文件夹
            let fileFolder = FILE_FOLDER;

            //console.log('fileFolder......', fileFolder)
            const storePath = fileFolder
            if (!fs.existsSync(storePath)) {
                fs.mkdirSync(storePath, { recursive: true });
            }

            //console.log('fields......', fields)

            // 遍历所有上传来的图片
            Common.objForEach(files as any, (name, file) => {

                // 图片临时位置
                const tempFilePath = file.filepath

                // 图片名称和路径
                const fileName = genRandomFileName(file.originalFilename || name) // 为文件名增加一个随机数，防止同名文件覆盖
                //console.log('fileName...', fileName)

                const fullFileName = path.join(storePath, fileName)

                if (!/(jpg|png|gif|webp|mp3|mp4)$/.test(fullFileName)) {
                    res.status(200);
                    res.json({
                        "errno": 0, // 注意：值是数字，不能是字符串
                        "data": []
                    });
                    return;
                }


                // 将临时文件保存为正式文件
                try {
                    fs.renameSync(tempFilePath, fullFileName)
                }
                catch (er) {
                    var readStream = fs.createReadStream(tempFilePath);
                    var writeStream = fs.createWriteStream(fullFileName);
                    readStream.pipe(writeStream);
                    readStream.on('end', function () {
                        fs.unlinkSync(tempFilePath);
                        readStream.destroy();
                    });
                }
                // 存储链接
                const url = `//${req.headers.host}/${FILE_FOLDER.replace(/dist\//, '')}/${fileName}`
                imgLinks.push({ url, alt: fileName, href: url })
            })

            // 返回结果
            let data
            if (imgLinks.length === 1) {
                data = imgLinks[0]
            } else {
                data = imgLinks
            }


            if (callback) {
                callback(imgLinks);
            }
            else {
                setTimeout(() => {
                    res.status(200);
                    res.json({
                        "errno": 0, // 注意：值是数字，不能是字符串
                        "data": imgLinks
                    });
                }, 0)
            }


        })
    }

    static upload() {
        this.app.post('/api/upload', (req, res) => {
            this.uploadSave(req, res);
        })
    }

    static ueditor() {
        this.app.get("/api/ueditor/ue", (req: any, res: any, next: any) => {
            // 客户端发起其它请求
            res.setHeader('Content-Type', 'application/json');

            const path = 'dist/statics/admin-xxglxtjm/libs/ueditor/config.json';
            fs.readFile(path, 'utf-8', (err, data) => {
                res.status(200).send(data);
            })
        });
        this.post("/api/ueditor/ue", (req: any, res: any, next: any) => {

            if (req.query.action === 'uploadimage' || req.query.action === 'uploadfile' || req.query.action === 'uploadvideo') {

                this.uploadSave(req, res, undefined, files => {
                    res.json({
                        'url': files[0].url,
                        'title': files[0].alt,
                        'original': files[0].alt,
                        'state': 'SUCCESS'
                    })
                });

            }
            else if (req.query.action === 'listimage') {
                var dir_url = '/files/upload/images/ueditor/';
                // 客户端发起图片列表请求
                // 客户端会列出 dir_url 目录下的所有图片
                //res.ue_list(dir_url);
                res.json({
                    "state": "SUCCESS",
                    "list": [],
                    "start": 1,
                    "total": 0
                });
            }
            else {
                // 客户端发起其它请求
                res.setHeader('Content-Type', 'application/json');
                res.redirect('dist/statics/admin-xxglxtjm/libs/ueditor/config.json');
            }
        });
    }
}