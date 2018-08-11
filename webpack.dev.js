/*
*
* NamedModulesPlugin && OccurrenceOrderPlugin
* https://blog.csdn.net/chenqiuge1984/article/details/80128021
*
*
*
*/

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const manifest = require('./app/source/build/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[1];

module.exports = {
    mode: 'development',
    devtool: "source-map",//eval-source-map
    stats: {
        colors: true,
        version: true,
    },
    entry:{
        // index: path.resolve(__dirname,'./app/source/entry/index.js'),
        index: [
            'babel-polyfill',
            path.resolve(__dirname, './app/source/entry/index.js')
        ]
    },
    output: {
        filename: '[name].[hash].js',
        chunkFilename: "[name]-chunk.js",
        path: path.resolve(__dirname,'./app/source/build/chunks'),
        publicPath: "./build/chunks"
    },
    devServer:{
        quiet: false, // true,关闭编译控制台打印，世界一下子安静了
        // clientLogLevel: "none",
        // contentBase本地服务器所加载的页面所在的目录,这个好坑哦，这个很重要，配置不对的话，是找不到资源文件的
        contentBase: path.resolve(__dirname,'./app/source/build'),
        // disableHostCheck: true,
        port: 8070,
        hot: true, // 需要开启 plugins > new webpack.HotModuleReplacementPlugin()
        inline: true, // 实时刷新 设置为true，当源文件改变时会自动刷新页面
        historyApiFallback: true, // 不跳转
    },
    //自动补全识别后缀
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            components: path.resolve(__dirname, './app/source/components'),
            // commonjsx: path.resolve(__dirname, '../src/commonjsx'),
            // common: path.resolve(__dirname, '../src/assets/common'),
            // popup: path.resolve(__dirname, '../src/assets/common/lib/popup/popup.js'),
            pages: path.resolve(__dirname, './app/source/pages'),
            // actions: path.resolve(__dirname, '../src/redux/actions')
        },
    },
    plugins: [
        // new CleanWebpackPlugin([
        //         './app/source/build/index.*.*',
        //         '!./app/source/build/vendor.*.*.js',
        //         '!./app/source/build/vendor.dll.*.js',
        //         '!./app/source/build/vendor.manifest.js'
        //     ],
        //     {
        //         root: __dirname, // webpack文件夹的绝对路径,Default: root of your package
        //         verbose: true,
        //         exclude: ['manifest.json'],// 无法排除指定正则文件格式,so,要排除从第一个参数吧
        //     }
        // ),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        // 引入dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./app/source/build/vendor.manifest.json')
        }),
        new HtmlWebpackPlugin({
            title: 'React-router 4 && webpack4.0+',
            template: './app/source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'true',// 资源文件注入位置true,body,header,false
            // 动态引入dll
            vendor: /*manifest.name*/'vendor.dll.'+dllchunkname + '.js' //manifest就是dll生成的json
        }),
        new OpenBrowserWebpackPlugin({
            browser: 'Chrome',
            url: 'http://localhost:8070',
        }),
        // // 经常使用的模块排到前面，提升浏览器运行速度，这个可能在生产环境比较好吧
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // // NamedModulesPlugin使用模块的相对路径作为模块的 id，所以只要我们不重命名一个模块文件，那么它的id就不会变，更不会影响到其它模块了：
        // new webpack.NamedModulesPlugin(),
    ],
    module:{
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                // 排除查找模块的目录
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-react']
                    // }
                    // options: {
                    //     presets: ['@babel/preset-react'],
                    //     plugins: ['syntax-dynamic-import']
                    // }
                },

                // options: {
                //     presets: ['@babel/preset-react'],
                //     //plugins: ['@babel/plugin-transform-runtime']
                // }

            },
            {
                test: /\.css$/,
                // use: [
                //     'style-loader',
                //     'css-loader'
                // ]
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader?modules' },
                ]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" // 将 Sass 编译成 CSS
                }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },

        ],
    },
};