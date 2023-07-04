'use strict'
// 用于修补ts编译后的import路径后缀问题
import FileHound from 'filehound'
import fs from 'fs'
import path from 'path'
import { dirname } from 'dirname-filename-esm'

const __dirname = dirname(import.meta)

const files = FileHound.create()
  .paths(__dirname + '/lib')
  .discard('node_modules')
  .ext('js')
  .find();

files.then((filePaths) => {
  filePaths.forEach((filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (!data.match(/import .* from/g)) {
        return;
      }
      let newData = data.replace(
        /(import .* from\s+['"])(.*)(?=['"])/g,
        (match, p1, p2) => {
          // 判断导入路径是否位于当前项目的源码目录下
          const isLocalImport = !p2.startsWith('.') && !p2.startsWith('/');
          if (isLocalImport) {
            return match;
          } else {
            return `${p1}${p2}.js`;
          }
        }
      );
      if (err) throw err;

      console.log(`writing to ${filepath}`);
      fs.writeFile(filepath, newData, function (err) {
        if (err) {
          throw err;
        }
        console.log('complete');
      });
    });
  });
});

// 将package.json复制到lib目录下