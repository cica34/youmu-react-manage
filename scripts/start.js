'use strict';

// 设置开发环境环境变量
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// 处理unhandle的错误，直接抛异常
process.on('unhandledRejection', err => {
  throw err;
});

// 读取开发者配置的环境变量
require('../config/env');

// 加载一系列的依赖
const fs = require('fs'); // 文件IO
const chalk = require('chalk'); // 命令行颜色
const webpack = require('webpack'); // webpack
const WebpackDevServer = require('webpack-dev-server'); // webpack提供的dev-server
const clearConsole = require('react-dev-utils/clearConsole'); // 清空命令行工具
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles'); // 文件检查工具
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils'); // dev-server工具
const openBrowser = require('react-dev-utils/openBrowser'); // 启动浏览器的工具
const paths = require('../config/paths'); // 重新加载各个路径
const config = require('../config/webpack.config.dev'); // 加载dev环境的webpack配置
const createDevServerConfig = require('../config/webpackDevServer.config'); // 加载webpack-dev-server的配置

const useYarn = fs.existsSync(paths.yarnLockFile); // 通过是否存在yarn-lock文件判断是否使用yarn
const isInteractive = process.stdout.isTTY;

// 判断两个重要的入口文件是否存在（index.html和index.js）
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// 设置默认端口和host，可以从环境变量中读取，默认为3000端口
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('http://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// 启动webdevserver，然后在浏览器中打开前端页面
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // 检测端口是否可用，选择一个可用端口
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });
    // 检测程序终止（Ctrl+C）和程序结束信号,检测到该信号则直接推出
    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
