
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const manifest = require('./app/source/build/vendor.manifest.json');
const dllchunkname = manifest.name.split('_')[1];

module.exports = {
    mode: 'production',
    entry:{
        index: path.resolve(__dirname,'./app/source/entry/index.js'),
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname,'./app/source/build/'),
    },
    stats: {
        colors: true,
        version: true,
    },
    plugins:[
        new CleanWebpackPlugin([
                './app/source/build/index.*.js',
                '!./app/source/build/manifest.*.json',
                '!./app/source/build/vendor.*.*.js',
                '!./app/source/build/vendor.*.js'
            ],
            {
                root: __dirname, // webpack文件夹的绝对路径,Default: root of your package
                verbose: true,
                exclude: ['manifest.json'],// 无法排除指定正则文件格式,so,要排除从第一个参数吧
            }
        ),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./app/source/build/vendor.manifest.json')
        }),
        new HtmlWebpackPlugin({
            title: 'React-router && webpack4.0+',
            template: '../source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
            filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
            author: 'tomy',
            inject: 'true',// 资源文件注入位置true,body,header,false
            vendor: /*manifest.name*/'vendor.dll.'+dllchunkname + '.js' //manifest就是dll生成的json
        }),
        // new HtmlWebpackIncludeAssetsPlugin({
        //     file:['./app/source/build/vendor.dll.*.js'],
        //     assets: [
        //         'vendor.dll.*.js'
        //     ], append: false
        // }),
        // new AddAssetHtmlPlugin({
        //     filepath:
        //         path.resolve(__dirname, './app/source/build/vendor.dll.*.js'),
        //
        //        // require.resolve('./app/source/build/vendor.dll.7b4918eae9e5a132f4b6.js')
        // }),
    ],
    module:{
        rules:[
            {
                // 需要检查打包的各种js资源文件
                test: /(\.jsx|\.js|\.es6)$/,
                // 排除查找模块的目录
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
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