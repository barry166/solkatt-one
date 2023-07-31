## 项目集成Cli

### 环境要求
Nodejs V18以上

### 使用方式
```
npm i -g @solkatt-one
solkatt-one -h
```

## 项目运行
pnpm run dev

## 项目打包

### 子项目打包
pnpm run build


## 项目发布
### 使用 changeset 发布版本

pnpm changeset

pnpm changeset publish

pnpm publish -r -no-git-checks


## 项目本地调试
使用vscode调试本地代码，直接点击Launch via NPM，入口文件从core开始，运行前需要执行以下命令监听全局改动
```shell
pnpm run watch

```



