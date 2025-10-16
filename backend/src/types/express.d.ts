// backend/src/types/express.d.ts

import {IUser} from '../models/User';

// 这段代码通过"声明合并"的方式，扩展了 Express 和 Passport 使用的全局 User 类型。
// 它告诉 TypeScript：在这个项目中，所有 req.user 对象的类型都应该是我们的 IUser 接口类型。
// 这样，在所有路由文件中，TypeScript 都能正确识别出 req.user 上存在 _id, username 等属性。
declare global {
    namespace Express {
        // 继承 IUser 接口
        export interface User extends IUser {
        }

        // Multer 文件类型
        export interface Multer {
            File: {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            };
        }

        // 同时确保 Request 接口上的 user 属性类型也正确
        export interface Request {
            user?: User;
            file?: Multer.File;
        }
    }
}

// 需要一个空的 export {} 语句来将此文件标记为一个模块。
export {};