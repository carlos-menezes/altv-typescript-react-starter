import fs from 'fs-extra';
import * as glob from 'glob';
import swc from '@swc/core';
import { getResources, normalizeFilePath } from './shared.js';

const SWC_CONFIG: swc.Config = {
    jsc: {
        parser: {
            syntax: 'typescript',
            dynamicImport: true,
            decorators: true,
        },
        transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
        },
        target: 'es2020',
    },
    sourceMaps: false,
};

const compileFile = (filePath: string) => {
    const normalizedPath = normalizeFilePath(filePath);
    const finalPath = normalizedPath.replace('src/', 'resources/').replace('.ts', '.js');
    const compiled = swc.transformFileSync(normalizedPath, SWC_CONFIG);
    fs.outputFileSync(finalPath, compiled.code, { encoding: 'utf-8' });
};

const buildTargetResource = (name: string) => {
    const startTime = Date.now();

    const resourcePath = `resources/${name}`;
    if (fs.existsSync(resourcePath)) {
        fs.rmSync(resourcePath, { force: true, recursive: true });
    }

    const filesToCompile = glob.sync(`./src/${name}/**/*.ts`);
    filesToCompile.forEach(compileFile);

    console.log(`compile\t:: built ${filesToCompile.length} files for ${name} in ${Date.now() - startTime}ms`);
};

getResources().forEach(buildTargetResource);