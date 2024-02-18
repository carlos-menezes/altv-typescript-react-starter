import fs from 'fs-extra';
import * as glob from 'glob';
import { getResources, normalizeFilePath } from './shared.js';

const copyResourceAssets = (name: string) => {
    const startTime = Date.now();
    const files = glob.sync(`./src/${name}/**/*.!(ts)`);

    files.forEach((file) => {
        const filePath = normalizeFilePath(file);
        const finalPath = filePath.replace('src/', 'resources/');
        fs.copySync(filePath, finalPath, { overwrite: true });
    });

    console.log(`copy\t:: copied ${files.length} files in ${Date.now() - startTime}ms`);
};

getResources().forEach(copyResourceAssets);