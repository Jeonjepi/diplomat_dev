import { BadRequestException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
const fs = require('fs')
const path = require('path');

export const multerDiskOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const { category, name } = req.body;
            const rootPath = '/home/caitory/diplomat_upload/';
            const folderPath = path.join(rootPath, category);

            // 먼저 "/home/caitory/diplomat_upload/" 디렉토리가 존재하지 않으면 생성합니다.
            // recursive 옵션을 사용하여 상위 디렉토리도 생성합니다.
            fs.mkdirSync(rootPath, { recursive: true });

            // 그 다음 해당 카테고리의 디렉토리를 생성합니다.
            if (!existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // req.body 데이터를 cb 함수 내에서 사용할 수 있도록 넘깁니다.
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            let newFileName = new Date().valueOf() + path.extname(file.originalname);
            cb(null, newFileName);
        },
    }),
};
