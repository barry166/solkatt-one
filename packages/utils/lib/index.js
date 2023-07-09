import path from 'node:path';
import fs from 'node:fs';
import { pathExists } from 'path-exists';
import { packageDirectory } from 'pkg-dir';
import log from './log';
export * from './npmInfo';
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
            if (pkg.exports['.'] &&
                pkg.exports['.'] &&
                typeof pkg.exports['.']['import'] === 'string')
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
export { log };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFBO0FBQzVCLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBQ3hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUMxQyxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUE7QUFFdkIsY0FBYyxXQUFXLENBQUE7QUFFekIsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO0lBQy9DLElBQUksQ0FBQyxRQUFRO1FBQUUsT0FBTTtJQUNyQixJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDL0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ25CO0FBQ0gsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUFFLFVBQWtCLEVBQUUsRUFBRTtJQUM5RCxJQUFJLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFBO0lBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQ3hELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNqQyxNQUFNLGtCQUFrQixHQUFHLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUNyRCxDQUFDLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2pELFVBQVU7SUFDVixJQUFJLEdBQUcsRUFBRSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzFCLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRTtZQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxRQUFRO2dCQUFFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQTtZQUN2RCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVE7Z0JBQzFELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6QixJQUNFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDaEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVE7Z0JBRTlDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNwQztLQUNGO0lBQ0QsT0FBTyxHQUFHLEVBQUUsSUFBSSxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUE7QUFDN0MsQ0FBQyxDQUFBO0FBRUQsbUJBQW1CO0FBQ25CLE1BQU0sVUFBVSxVQUFVLENBQUMsQ0FBQztJQUMxQixJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtRQUNwQixJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7WUFDZixPQUFPLENBQUMsQ0FBQTtTQUNUO2FBQU07WUFDTCxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQzdCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQTtBQUNWLENBQUM7QUFFRCxlQUFlO0FBQ2YsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUMzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLGdCQUFnQixDQUFDO1FBQ3hDLEdBQUcsRUFBRSxRQUFRO0tBQ2QsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUE7SUFDeEQsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2pDLE9BQU8sR0FBRyxFQUFFLElBQUksS0FBSyxRQUFRLENBQUE7QUFDL0IsQ0FBQyxDQUFBO0FBRUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFBIn0=