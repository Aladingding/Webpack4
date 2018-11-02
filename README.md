# Webpack4.0Learn





#SplitChunksPlugin Reason The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。

最初，块（chunks）（以及在块chunks内部通过import导入的模块）通过内部webpack图中的父子关系进行连接。
CommonsChunkPlugin用于避免跨越它们的重复依赖，但是不能再进一步优化了

从版本4开始，CommonsChunkPlugin被删除，转而使用optimization.splitChunks和optimization.runtimeChunk选项。
以下是新流程的工作原理。



默认配置
开箱即用的SplitChunksPlugin应该适合大多数用户;
默认情况下，它仅影响按需块，因为更改初始块会影响HTML文件应包含的脚本标记以运行项目。

webpack.optimization.SplitChunksPlugin 将根据以下条件自动拆分块：

1、可以共享新块或来自node_modules文件夹的模块
2、新块将大于30kb（在min + gz之前）
3、根据需要加载块时的最大并行请求数（将）小于或等于5的时候
4、初始页面加载时的最大并行请求数（将）小于或等于3的时候
当试图满足最后两个条件时，首选更大的块。

我们来看看一些例子。


Defaults: Example 1

// index.js

// dynamically import a.js
import("./a");


// a.js
import "react";

// ...

结果：将创建一个包含react的单独块。 在导入调用时，此块与包含./a的原始块并行加载。

拆分依据：

条件1：块包含来自node_modules的模块
条件2：反应大于30kb
条件3：导入调用时的并行请求数为2
条件4：不影响初始页面加载时的请求

这背后的原因是什么？ react可能不会像您的应用程序代码那样频繁地改变。
通过将其移动到单独的块中，可以将此块与应用程序代码分开缓存（假设您正在使用chunkhash，记录，Cache-Control或其他长期缓存方法）。



Defaults: Example 2

// entry.js

// dynamically import a.js and b.js
import("./a");
import("./b");



// a.js
import "./helpers"; // helpers is 40kb in size

// ...



// b.js
import "./helpers";
import "./more-helpers"; // more-helpers is also 40kb in size

// ...


结果：将创建一个单独的块，其中包含./helpers及其所有依赖项。 在导入调用时，此块与原始块并行加载。


为什么：

条件1：两个导入调用之间共享块
条件2：助手大于30kb
条件3：导入调用的并行请求数为2
条件4：不影响初始页面加载时的请求

将助手的内容放入每个块中将导致其代码被下载两次。 通过使用单独的块，这将只发生一次。
我们以新增一个额外的请求为代价，来避免该共享模块被重复下载，这是一种权衡后的结果。 这就是为什么最小尺寸为30kb。

Configuration：配置项
对于希望更好地控制此功能的开发人员，webpack提供了一组选项以更好地满足您的需求。
如果您手动更改拆分配置，请测量更改的影响，以查看并确保实现真正的好处。

通常默认配置是适应Web性能的最佳实践，但项目的最佳策略可能会有所折扣，这具体取决于项目性质。

{ cacheGroups }
The defaults assign all modules from node_modules to a cache group called vendors and all modules duplicated in at least 2 chunks to a cache group default.
默认情况下将分配所有来自node_modules的模块打包为一个名为vendors的cacheGroups文件，
并且这些模块，至少在两个文件chunks中声明或引用，才会打包到名为vendors文件中

A module can be assigned to multiple cache groups.
The optimization then prefers the cache group with the higher priority (priority option) or that one that forms bigger chunks.
可以将一个共享模块分配给多个cacheGroups。
然后，webpack.optimization倾向于选择具有较高优先级配置的cacheGroups（优先级选项）或来自比较大的chunks文去优化，并打包到该文件名下的cacheGroups中。



Conditions
当满足所有条件时，来自相同块和缓存组的模块将形成新块。

配置条件有4个选项：
minSize（默认值：30000）块的最小大小。
minChunks（默认值：1）在拆分之前共享模块的最小块数
maxInitialRequests（默认值3）入口点处的最大并行请求数
maxAsyncRequests（默认值为5）按需加载时的最大并行请求数


{ name }
To control the chunk name of the split chunk the name option can be used.
要控制拆分块的块名称，可以使用name选项。


为不同的拆分块分配相同的名称时，所有vendor modules都放在一个共享块中，但不建议这样做，因为它可以导致更多的代码下载。
（可以把多个重复引用的拆分快，都打包到一个公共的共享文件中，虽然可行，但不建议，因为它可以导致更多的代码下载）

true是一个神奇的值，会根据块和缓存组键自动选择名称，否则可以传递字符串或函数。

当名称与入口点名称匹配时，将删除入口点。

{ automaticNameDelimiter }
optimization.splitChunks.automaticNameDelimiter
默认情况下，webpack将使用源块和名称生成名称，例如vendors~main.js。

如果您的项目与〜字符有冲突，可以通过将此选项设置为适用于您的项目的任何其他值来更改它：automaticNameDelimiter：“ - ”。

然后生成的名称将看起来像vendors-main.js。

automaticNameDelimiter更改生成共享文件名称的链接符，默认为~


{ test } 共享模块选择方式
test参数控制选择哪一个模块打包到cacheGroups共享文件中。
忽略该参数不写将选择所有模块。
test的值它可以是正则，字符串或函数。
它可以匹配绝对模块资源路径或块名称。
匹配块名称时，将选择此块中的所有模块。

{ chunks }
使用chunks参数，可以配置选定的块。
可选值"initial", "async" and "all"
 配置时，优化仅选择初始块，按需块或所有块。

当模块完全匹配时，选项reuseExistingChunk允许重用现有块而不是创建新块。

改参数可以控制cacheGroups的打包策略


optimization.splitChunks.chunks = all

正如之前提到的，这个插件会影响动态导入的模块。 将optimization.splitChunks.chunks选项设置为“all”
初始块将受其影响（即使是未动态导入的那些）。 这样，甚至可以在入口点和按需加载之间共享块。
这是推荐的配置。

您可以将此配置与HtmlWebpackPlugin结合使用，它将为您注入所有生成的vendor模块


optimization.splitChunks的默认配置如下

splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
默认情况下，cacheGroups从splitChunks.*继承选项，但test，priority和reuseExistingChunk只能在cacheGroups对象里面配置。
cacheGroups是一个对象，其中键是cacheGroups（共享公共文件的）的名称。比如vendors将生成包含名为vendors的.js
可以使用上面列出的所有选项：chunks，minSize，minChunks，maxAsyncRequests，maxInitialRequests，name。

您可以将optimization.splitChunks.cacheGroups.default设置为false以禁用默认cacheGroups，
对于vendors cacheGroups也是如此。

default对象的优先级为负，以允许任何自定义cacheGroups采用更高的优先级（默认值为0）。

splitChunks:案例1
创建一个公共块，其中包括入口点之间共享的所有代码。
splitChunks: {
    cacheGroups: {
        commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
        }
    }
}
此配置会增大您的初始bundles打包文件，建议在不立即需要模块时使用import()动态导入。

splitChunks:案例2
创建一个名为vendors共享资源模块，其中包括所有引用来自node_modules的代码，
这可能会导致包含所有外部包的大块。 建议仅包含核心框架和实用程序，并动态加载其余的依赖项。
splitChunks: {
    cacheGroups: {
        commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
        }
    }
}

将optimization.runtimeChunk设置为true会为每个仅包含运行时的入口点添加一个附加块。
单值代替创建一个运行时文件，以便为所有生成的块共享。

// cnpm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env


#Error: Plugin/Preset files are not allowed to export objects, only functions. In D:\OtherX\Webpack4+\node_modules\babel-preset-react\lib\index.js

https://github.com/babel/babel-loader/issues/540
#Error: Module build failed: TypeError: this.setDynamic is not a function #560
https://github.com/babel/babel-loader/issues/560\


webpack中output配置项中chunkFilename属性的用法
https://www.cnblogs.com/toward-the-sun/p/6147324.html?utm_source=itdadao&utm_medium=referral


https://segmentfault.com/a/1190000008315937


路由刷新之后404需要配置服务器代理环境，devServer or nginx






//-------------------------------copy from pig can under line--------------------------------------//
最近调研了所有 atool-build 使用方的代码，大概近千个项目，总结了一些常用的 webpack 方式，记录如下：

entry
entry 是描述一个 bundle 的入口文件是什么。在具体在业务中使用的方式有如下三种：

直接在 package.json 中描述 entry 内容；
动态创建 entry 内容，使用 glob 等工具使用若干通配符，运行时获得 entry 的条目，这种方式比较适合入口文件不集中且较多的场景；
根据 entry 内容挂钩一些 html 模板 loader，例如 html-webpack-plugin，ejs-html-loader 等，这种方式主要用以解决 html 随模板生成，但同时根据 entry 的一些内容自动替换模板中一些关键字。
output
output 的作用在于告知 webpack 该如何把构建编译后的文件放入到磁盘。

在具体业务中使用的方式有如下种：

output.filename: 修改构建后文件的命名，业务中会存在 4 种情况。

直接设置一个 bundle 的 name，例如 index.bundle.js 这类场景发生在只有一个 entry 的情况；
[name]，使用 Chunk 的名称
[hash]，使用 Compilation 的 hash 值，在这种方式下生成的资源文件会都有相同的 hash 值
[chunkhash]，使用 Chunk 的 hash 值，在这种方式下会根据每个 Chunk 的来生成 hash 值，使用这种方式的情况发生在想要 cache，cache 会衍生出很多的内容这个在之后再做展开。
output.path: 修建构建后文件输出到磁盘的目录，业务中会存在 1 种情况。

传入一个相对于当前 cwd 的路径，这种自定义情况非常普遍

output.publicPath: 申明构建后的资源文件的引入地址，业务中会存在 1 种情况

设置为 https://xxxx.xx.com/assets/ 这种方式，这种方式的出现在于 webpack 默认在引用资源时都是从根目录开始，然后现实中 assets 资源 和 html 会随不同的发布平台发布。
output.chunkFilename：声明非 entry chunks 的资源文件的命名，一般它发生的场景在 code split 即按需加载的业务场景，例如 require.ensure，在这种场景下，会对 require.ensure 的模块进行独立的打包，文件命名也会有四种情况。

[id]，id 值 从 0 开始
[name]，该 chunk 的 name，require.ensure(dependencies: String[], callback: function(require), errorCallback: function(error), chunkName: String)
[hash]，使用 Compilation 的 hash 值，在这种方式下生成的资源文件会都有相同的 hash 值
[chunkhash]，使用 Chunk 的 hash 值，在这种方式下会根据每个 Chunk 的来生成 hash 值，使用这种方式的情况发生在想要 cache，cache 会衍生出很多的内容这个在之后再做展开。
output.library：一旦设置后该 bundle 将被处理为 library。

output.libraryTarget：export 的 library 的规范，有支持 var, this, commonjs,commonjs2,amd,umd。

resolve
resolve.alias：为模块设置别名。这种方案通常使用在两种情况下：

一种是单纯为模块设置别名，一来方便自己不再需要根据目录书写 ../ 等这种路径操作，另外也可以提升 webpack 在 resolve 模块时的速度；
另外一种则和优化上扯上一些关系，比如 resolve.alias.a = isTest ? 'moduleTestA' : 'moduleA'，如上这种方式使用最大的好处在于能根据当前所属代码所需情况构建产物中只会有 moduleTestA 或者 moduleA。以上这种方式可以在所有资源文件应用。当然也可以使用 babel-plugin-module-resolver 和 less-plugin-rewrite-import 予以解决。
resolve.root：添加个人目录到 webpack 查找模块的路径里，这种需求比如发生在当前某个项目所依赖某个文件并不在该项目中。

resolve.modulesDirectories：模块解析方式，在项目中我看到一般会有两种使用的场景，

一种主要针对开发者，需要新增一种模块的解析方式。比如设置为 ["node_modules", "bower_components"] 那么在项目中 foo/bar 的文件下依赖一个模块 a, 那么 webpack 会通过如下的顺序去寻找依赖

foo/bar/node_modules/a
foo/bar/bower_components/a
foo/node_modules/a
foo/bower_components/a
node_modules/a
bower_components/a
另外一种则是想要申明模块 resolve 的优先级，比如在一个项目中有依赖 A，B，依赖的 A,B 同时依赖了 C，如果在构建过程中，你想明确表示我只想要某个 C 的话，则就可以通过这种方式。

resolve.extensions：设置解析模块的拓展名。默认为 ["", ".webpack.js", ".web.js", ".js"]。比如新增一种文件扩展名，["", ".webpack.js", ".web.js", ".web.ts", ".web.tsx", ".js"]

resolve.packageMains：设置 main 的入口文件。这种方式目前会在 webpack@2 中使用 resolve.mainFields 来解决 tree-shaking，目前支持的有 redux 等。

resolveLoader
resolveLoader.modulesDirectories：同 resolve.modulesDirectories 只不过针对 loader，这边需要注意的是在 resolve.modulesDirectories 中关于优先级的，在工具被二次封装时会用到比较多。
resolveLoader.moduleTemplates： ["*-webpack-loader", "*-web-loader", "*-loader", "*"] webpack@1 中内置的模板，但是在 webpack@2 是并不会补齐。
resolve.root, resolve.fallback, resolve.modulesDirectories 这三个属性在 webpack@2 中被合并到了 resolve.modules

module
module.loaders：对应模块的加载器。在 webpack@2 中使用 module.rules 予以取代。以下会罗列目前常用文件类型的模块加载处理方式。
babel-loader 处理 .js 和 .jsx 文件，由于历史原因 atool-build 在处理 .jsx 文件时会处理 node_modules 下内容。
目前 atool-build 已经内置的 preset 有 babel-preset-es2015-ie，babel-preset-react，babel-preset-stage-0，plugins 有 babel-plugin-add-module-exports 和 babel-plugin-transform-decorators-legacy。
目前业务中自行使用的有: plugins: babel-plugin-import 构建资源大小提供优化，babel-plugin-transform-runtime 实现按需加载 pollyfill 需要与 babel-runtime 结合使用，babel-plugin-module-resolver 实现诸如 webpack 中 resolve.alias 功能，babel-plugin-dva-hmr 和 babel-plugin-dev-expression 实现 dva hot module replacement 功能，babel-plugin-react-intl 实现 react 多语言方案， babel-plugin-es6-promise 覆盖原有 promise; preset: babel-preset-env 实现根据浏览器支持情况自动打包 pollyfill 等功能，babel-preset-es2016 等。**在实际过程中，都可能需要对 preset 传入参数的需求。**一般设置如下
presets: [[require.resolve('xxx-preset'), { options: hi }]]
cacheDirectory：缓存支持，一般默认就开启
babelrc：一般需要禁用掉，防止用户端的 babel 配置影响内置配置
tsx-loader: 处理 ts 文件，内置参数 target: 'es6', jsx: 'preserve',moduleResolution: 'node', declaration: false, sourceMap: true，需要注意的是在使用 ts 项目时必须要人为引入一个 ts config.json 的文件，如果没有内容，内部设置为一个空对象即可。
style-loader: 通过 js 方式 inject style 节点来注入样式，一般用于开发环境
css-loader: 处理 css 文件，一般现有项目中都会使用 ExtractTextPlugin 把样式文件抽取出来，但是在本地开发环境下一般不会 extract 出来，因为一旦 extract 出来会导致 hmr 对样式失效。所以一般在开环环境下会 style-loader!css-loader!postcss-loader 而在 production 下采用 ExtractTextPlugin，另外在每个 loader 都有对应的参数，postcss 还有专门的插件集。除此之外，常用的 css-loader 参数有 modules autoprefix indentName 等
postcss-loader: 目前在 postcss 中内置的 plugin 有 rucksack-css - 可废弃 和 autoprefixer 用以实现 autoprefix。一般针对适配的不同的浏览器，需要对 autoprefixer 配置 browsers 参数。一般在无线业务中为了适配高清方案也会引入 postcss-plugin-pxtorem, 同时也需要设置一些参数。
less-loader: 处理 less 文件，一般情况下需要配置 modifyVars 参数，用以覆盖 less 变量值
sass-loader: 处理 sass 文件，也有使用 fast-sass-loader 和 @ali/sass-loader
file-loader: 处理 html 文件，当前 atool-build 内置的方式，在实际业务中，很多并不希望 html 是拍平的结构，所以他们会自定义 fileloader 的参数，比如 file?name=[path][name].[ext]&context=./src/pages，但是也有不少业务中对 html 处理引入了新的 loader, 有 ejs-html-loader，html-minify-loader，还有直接使用插件 HtmlWebpackPlugin 来处理的情况，经过研究，根本上其实是想要解决 html 的自动化生成，以及内部资源文件的引用可以自动化生成。
url-loader: 处理 woff woff2 ttf eot svg png jpg jpeg gif 文件，目前业务中会有变更的点有，需要设置 limit 的大小，以及 svg 的处理可能需要存在多个 loader 处理，因为在使用 antd-mobile 业务中需要新增一个 svg-sprite-loader 来把 svg 文件当成一个 component
svg-sprite-loader, 已在 url-loader 中予以说明
HtmlWebpackPlugin, 已在 file-loader 中予以说明
ejs-html-loader, 已在 file-loader 中予以说明
html-minify-loader, 已在 file-loader 中予以说明
handlebars-loader, 处理 .handlebars 文件，并未内置，业务中自行引入
aptl-loader, 处理 .atpl 文件
raw-loader, 处理 tpl 文件，也有使用 html-loader 来处理的
scss-loader, 处理 scss 文件
vue-loader, 处理 vue 文件
json-loader, 处理 json 文件
注：一个正常 loader 的配置可能需要配置 test,exclude,include,loader,loaders属性
module.preLoaders：istanbul-instrumenter，此方式在 webpack@2 中被弃用，可以直接在对应的应用规则的文件中启用 enforce: 'pre'
module.postLoaders：es3ify-loader，提升 ie 兼容性，此方式在 webpack@2 中被弃用，可以直接在对应的应用规则的文件中启用 enforce: 'post'
module.noParse: 指明 webpack 不去解析某些内容，该方式有助于提升 webpack 的构建性能，配置内容可以是
externals
目前业务中使用都为声明外部依赖，这种方式有益于加速 webpack 构建，但是需要开发者额外引入被 external 库的 cdn 地址，常见的有 React 和 ReactDom。

devtool
文档

node
目前内置如下内容为 empty

  [
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'fs',
    'module',
    'net',
    'readline',
    'repl',
    'tls',
  ];
plugin - webpack 内置
大部分插件都有需要参数传入

webpack.optimize.CommonsChunkPlugin，在业务中通常有两种使用方式，一种是直接从所有的代码中抽取 common 的逻辑，此处可以配置 common 抽取最小单元，还有一种 common 的使用方式是 vendor 即用户配置具体的 entry 条目，并把该条目抽取为 vendor。
webpack.optimize.OccurenceOrderPlugin：优化插件，优化 module id
webpack.optimize.UglifyJsPlugin：代码丑化
webpack.optimize.DedupePlugin：打包时删除重复模块代码
webpack.DefinePlugin：给代码注入全局标识符
webpack.BannerPlugin：给代码添加 banner 信息
webpack.ProvidePlugin：调用模块的别名
webpack.NoErrorsPlugin：报错但不退出webpack进程
webpack.ProgressPlugin：显示构建进度
DllPlugin：主要业务中应用于提升本地调试速度，配置需要有单独的 Dll 配置文件
DllReferencePlugin：主要业务中应用于提升本地调试速度，需要配合 DllPlugin 使用
plugin - webpack 扩展
大部分插件都有需要参数传入

webpack-visualizer-plugin：查看构建 bundle 的构成
html-webpack-plugin：生成 html 文件
copy-webpack-plugin：拷贝文件或者文件夹
clean-webpack-plugin：清理文件或者文件夹
i18n-webpack-plugin：国际化支持
webpack-shell-plugin：给 shell 提供运行时机
case-sensitive-paths-webpack-plugin： 路径大小写敏感问题
friendly-errors-webpack-plugin：友好报错信息
extract-text-webpack-plugin：将文本内容生成抽取成独立文件
happypack：加速构建，需要对配置做比较大改动
parallel-webpack： 提供资源文件的并发构建
map-json-webpack-plugin：使用 hash 时，生成资源映射文件
需要沉淀的方案
html 自动化生成，自动更新引用资源
更加优质的 common 生成逻辑
目前有持久化缓存需求，需要给出一个更加完善的方案，即更加合理化的 hash 方案
https://github.com/goldhand/sw-precache-webpack-plugin 通过 sw 来完成资源文件离线化
单一文件多种 loader 处理，单一文件多种 loader 如何进行区间调整
