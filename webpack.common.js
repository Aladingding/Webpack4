
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry:{
        index: path.resolve(__dirname,'./App/source/entry/index.jsx'),
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname,'./App/source/build/'),
        publicPath: path.resolve(__dirname,'./App/source/build/'),
    }
};