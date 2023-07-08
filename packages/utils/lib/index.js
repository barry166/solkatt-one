import path from 'node:path';
import fs from 'node:fs';
import { pathExists } from 'path-exists';
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
    console.log('inputReleativePath', inputReleativePath);
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
export { log };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFBO0FBQzVCLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUN4QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBQ3hDLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQTtBQUV2QixjQUFjLFdBQVcsQ0FBQTtBQUV6QixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDL0MsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFNO0lBQ3JCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUMvQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDeEI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDbkI7QUFDSCxDQUFDLENBQUE7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQUUsVUFBa0IsRUFBRSxFQUFFO0lBQzlELElBQUksQ0FBQyxDQUFDLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUE7SUFDaEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUE7SUFDeEQsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2pDLE1BQU0sa0JBQWtCLEdBQUcsMkJBQTJCLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0lBQ3RELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUNwRCxDQUFDLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2pELFVBQVU7SUFDVixJQUFJLEdBQUcsRUFBRSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzFCLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRTtZQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxRQUFRO2dCQUFFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQTtZQUN2RCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVE7Z0JBQzFELE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6QixJQUNFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDaEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVE7Z0JBRTlDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNwQztLQUNGO0lBQ0QsT0FBTyxHQUFHLEVBQUUsSUFBSSxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUE7QUFDN0MsQ0FBQyxDQUFBO0FBRUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFBIn0=