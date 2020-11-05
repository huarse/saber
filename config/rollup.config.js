// rollup config file
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2018/11/05
// -----------
// builtins & resolve: https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency

import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import { name, description, version, license, distName } from '../package.json';

const banner = `/**
 * ${name} | ${description}
 * @version ${version}
 * @license ${license}
 *
 * Copyright (C) 2020-present, CAIHUAZHI Holding Limit.
 */`;

module.exports = [{
  input: 'esm/index.js',
  output: {
    dir: 'dist',
    format: 'umd',
    name: distName || 'Saber',
    banner,
  },
  external: [],
  plugins: [
    builtins(),
    resolve(),
    json(),
    terser({ // 压缩文件
      output: {
        comments: /@preserve|@license|@cc_on/i
      }
    }),
  ],
}];
