/*
*  Compile to dll, only when the project is first run
*  Dll is different from CommonChunks and optimization(4.16.0 delete CommonChunks module)
*
*  Related Reading: https://zhuanlan.zhihu.com/p/21748318
*
*/

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const manifest = require('./app/source/build/vendor.manifest.json');
// const dllchunkname = manifest.name.split('_')[1];

module.exports = {
    mode: "development",
    entry: {
        vendor: ['react', 'react-dom', 'react-router','react-router-dom','axios','react-loadable']
    },
    output: {
        filename: '[name].dll.[chunkhash].js',
        library: '[name]_[chunkhash]', // dll文件内的name名称命名规则，映射关系，与下文DllPlugin.name对应
        path: path.join(__dirname, './app/source/vendors/'),
        // path: path.join(__dirname, 'dist'),
        // publicPath: "./chunks/"
    },
    plugins:[
        new CleanWebpackPlugin([
                './app/source/build/manifest.*.json',
                './app/source/build/vendor.dll.*.js',
                './app/source/build/vendor.*.js'
            ],
            {
                root: __dirname, // webpack文件夹的绝对路径,Default: root of your package
                verbose: true,
                exclude: ['manifest.json'],// 无法排除指定正则文件格式,so,要排除从第一个参数吧
            }
        ),
        // 抽离公共包
        new webpack.DllPlugin({
            context: __dirname,
            // manifest文件内的name,与上文output中配置对应
            name: '[name]_[chunkhash]',
            // 生成索引清单的文件名，竟然是path属性这里更改manifest的文件名，why not filename
            path: path.join(__dirname, './app/source/vendors/','[name].manifest.json'),
        }),
        // new HtmlWebpackPlugin({
        //     title: 'React-router && webpack4.0+',
        //     template: './app/source/html/index.ejs', // html模板文档地址，webpack默认模板为ejs
        //     filename: 'index.html', // 由模板生成的文件名和存放位置，可带路径的？需要去官网文档看下
        //     author: 'tomy',
        //     inject: 'true',// 资源文件注入位置true,body,header,false
        //     vendor: /*manifest.name*/'vendor.dll.'+dllchunkname + '.js' //manifest就是dll生成的json
        // }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./app/source/build/vendor.manifest.json')
        // }),
        // new HtmlWebpackPlugin(),
        // new AddAssetHtmlPlugin({
        //     filepath: require.resolve('./app/source/build/vendor.dll.7b4918eae9e5a132f4b6.js')
        //     // require.resolve('./app/source/build/vendor.dll.7b4918eae9e5a132f4b6.js')
        // }),
    ]
};