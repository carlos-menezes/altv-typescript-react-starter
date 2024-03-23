import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import swcPlugin from '@rollup/plugin-swc';
import terser from '@rollup/plugin-terser';
import { Options as SWCOptions } from '@swc/core';
import fs from 'fs-extra';
import { rollup } from 'rollup';
import { getResources } from './shared.js';

const swcOptions: SWCOptions = {
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

const buildTargetResource = async (name: string) => {
    const startTime = Date.now();

    const resourcePath = `resources/${name}`;
    if (fs.existsSync(resourcePath)) {
        fs.rmSync(resourcePath, { force: true, recursive: true });
    }

    ['client', 'server'].forEach(async (dir) => {
        const bundle = await rollup({
            input: `./src/${name}/${dir}/index.ts`,
            plugins: [
                nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
                commonjs(),
                terser(),
                swcPlugin({ swc: swcOptions }),
            ],
        });

        await bundle.write({
            file: `./resources/${name}/${dir}/index.js`,
            format: 'esm',
        });
    });

    console.log(`compile\t:: built client and server files for ${name} in ${Date.now() - startTime}ms`);
};

getResources().forEach(buildTargetResource);
