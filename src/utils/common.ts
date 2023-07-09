import jwToken from 'jsonwebtoken';
export class Common {
    /**
     * 判断数据类型
     * @param element 被检查的值
     * @param TypeName 匹配类型名称 RegExp,Number,Boolean,String,Array,Function,Object,Undefined,Null
     * @returns 
    */
    static checkType(element: any, TypeName: 'RegExp' | 'Number' | 'Boolean' | 'String' | 'Array' | 'Function' | 'Object' | 'Undefined' | 'Null') {
        return Object.prototype.toString.call(element) == `[object ${TypeName}]`;
    }


    /**
     * 判断一个值是否为空（null、undefined、NaN、Invalid Date）
     * @param val 值
     * @returns 
     */
    static isNull(val: any) {
        return /^(null|undefined|nan|Infinity|\s*Invalid\s*date\s*)$/gi.test(val);
    }

    /**
     * 判断一个值是否为空 或者 空字符串
     * @param val 值
     * @returns 
     */
    static isNullOrEmpty(val: any) {
        if (this.isNull(val)) return true;
        return val.toString().length == 0;
    }

    /**
     * 判断一个值是否为空 或者 去除空字符后是否为空字符串
     * @param val 值
     * @param trueVal 
     * @param falseVal 
     * @returns true / false
     */
    static isNullOrWhiteSpace(val: any, trueVal: any = true, falseVal: any = false) {
        if (this.isNull(val)) return true;
        if (arguments.length == 2) {
            return val.toString().replace(/\s*/g, '').length == 0 ? trueVal : val;
        }
        if (arguments.length == 3) {
            return val.toString().replace(/\s*/g, '').length == 0 ? trueVal : falseVal;
        }
        return val.toString().replace(/\s*/g, '').length == 0;
    }

    /**
     * 判断一个数组是否为空或者没有子项
     * @param val 值
     * @returns true / false
     */
    static isNullOrEmptyArray(val: any) {
        if (this.isNullOrWhiteSpace(val)) return true;
        return val.length === 0;
    }

    static createToken(info: any, secret: string, options?: jwToken.SignOptions) {
        /** 过期参数 */
        !options && (options = {
            expiresIn: 60 * 60 * 1000
        } as jwToken.SignOptions);

        let token = jwToken.sign(info, secret, options);

        return token
    }

    static objForEach(obj: any[], fn: (name: string, file: any) => boolean | void) {
        let key, result
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result = fn.call(obj, key, obj[key])
                if (result === false) {
                    break
                }
            }
        }
    }

    static arrayToTree<T>(data: T[], idCode: string, pidCode: string, childCode: string, pidData: any) {
        let result: T[] = [];
        let map: any = {};
        let objState: any = (() => {
            function d() { }
            return new (d as any)();
        })();
        data.forEach((item: any) => {
            // 初始化
            const sid = item[idCode];
            const pid = item[pidCode];
            objState.__proto__[sid] = 1;
            map[sid] = Object.assign(item, map[sid] || {});
            if (pid !== pidData) {
                let parent = map[pid] || {};
                parent[childCode] || (parent[childCode] = []);
                parent[childCode].push(item);
                objState[pid] !== 1 && (objState[pid] = 0);
                objState[sid] === 0 && (objState[sid] = 1);
                map[pid] = parent;
            } else {
                objState[sid] = 1;
                result.push(map[sid]);
            }
        });
        Object.keys(objState).map(
            (key) => {
                objState[key] === 0 && result.push.apply(result, map[key][childCode]);
            }
        );
        return result;
    }

    static generateRandomString(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}