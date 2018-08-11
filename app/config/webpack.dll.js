/*
*  Compile to dll, only when the project is first run
*  Dll is different from CommonChunks
*
*  Related Reading: https://zhuanlan.zhihu.com/p/21748318
*
*/

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    mode: "development",
    entry: {
        vendor: ['react', 'react-dom', 'react-router','axios']
    },
    output: {
        filename: '[name].dll.[chunkhash].js',
        //library: '[name]_[chunkhash]', // dll文件内的name名称命名规则，映射关系，与下文DllPlugin.name对应
        library: '[name]_library',
        path: path.join(__dirname, '../source/build/'),
    },
    plugins:[
        // 抽离公共包
        new webpack.DllPlugin({
            context: __dirname,
            // manifest文件内的name,与上文output中配置对应
            //name: '[name]_[chunkhash]',
            name: '[name]_library',
            // 生成索引清单的文件名，竟然是path属性这里更改manifest的文件名，why not filename
            path: path.join(__dirname, '../source/build/','[name].manifest.json'),
        }),
        // 清除旧的公共包文件
        new CleanWebpackPlugin([
                '../source/build/manifest.*.json',
                '../source/build/vendor.*.*.js',
                '../source/build/vendor.*.js'
            ],
            {
                root: __dirname, // webpack文件夹的绝对路径,Default: root of your package
                verbose: true, // true先删除再构建
                exclude: ['manifest.json'],// 无法排除指定正则文件格式,so,要排除从第一个参数吧
            }
        ),
    ]
}

module.exports = config;