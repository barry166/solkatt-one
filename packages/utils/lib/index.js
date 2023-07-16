import path from 'node:path';
import fs from 'node:fs';
import { pathExists } from 'path-exists';
import { packageDirectory } from 'pkg-dir';
import ora from 'ora';
import log from './log';
export * from './npmInfo';
export * from './request';
export const readJsonFile = (filePath) => {
    if (!filePath)
        return;
    try {
        const code = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(code);
    }
    catch (e) {
        throw new Error(e);
    }
};
/**
 * 获取package包入口文件
 * @param packageDir
 */
export const getPackageInputFile = async (packageDir) => {
    if (!(await pathExists(packageDir)))
        return null;
    const pkgPath = path.resolve(packageDir, 'package.json');
    const pkg = readJsonFile(pkgPath);
    const inputReleativePath = getPackageInputRelativePath(pkg);
    return path.resolve(packageDir, inputReleativePath);
};
export const getPackageInputRelativePath = (pkg) => {
    // 判断是否Esm
    if (pkg?.type === 'module') {
        if (pkg?.exports) {
            if (typeof pkg.exports === 'string')
                return pkg.exports;
            if (pkg.exports['.'] && typeof pkg.exports['.'] === 'string')
                return pkg.exports['.'];
            if (pkg.exports['.'] && pkg.exports['.'] && typeof pkg.exports['.']['import'] === 'string')
                return pkg.exports['.']['import'];
        }
    }
    return pkg?.main || 'index.js' || 'main.js';
};
// 兼容window和mac路径格式
export function formatPath(p) {
    if (p && typeof p === 'string') {
        const sep = path.sep;
        if (sep === '/') {
            return p;
        }
        else {
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}
// 判断是否esmodule
export const isEsModule = async (filePath) => {
    const packageDir = await packageDirectory({
        cwd: filePath,
    });
    const pkgPath = path.resolve(packageDir, 'package.json');
    const pkg = readJsonFile(pkgPath);
    return pkg?.type === 'module';
};
export function spinnerStart(msg) {
    const spinner = ora(msg).start();
    return spinner;
}
export function sleep(timeout = 1000) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
export { log };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFBO0FBQzVCLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBQ3hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUMxQyxPQUFPLEdBQVksTUFBTSxLQUFLLENBQUE7QUFDOUIsT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFBO0FBRXZCLGNBQWMsV0FBVyxDQUFBO0FBQ3pCLGNBQWMsV0FBVyxDQUFBO0FBRXpCLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUMvQyxJQUFJLENBQUMsUUFBUTtRQUFFLE9BQU07SUFDckIsSUFBSTtRQUNGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQy9DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN4QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNuQjtBQUNILENBQUMsQ0FBQTtBQUVEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLEtBQUssRUFBRSxVQUFrQixFQUFFLEVBQUU7SUFDOUQsSUFBSSxDQUFDLENBQUMsTUFBTSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQTtJQUNoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQTtJQUN4RCxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDakMs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