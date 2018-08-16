const path = require("path")
const merge = require("webpack-merge")
const webpack = require('webpack')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin")
const postcssConfig = require('./postcss.config.js')


// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
module.exports = (cogear) => {
	return merge(common(cogear), {
		entry: {
			app: [path.join(cogear.options.src, "app")]
		},
		mode: "production",
		module: {
			rules: [
				// CSS preprocessors
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{ loader: 'css-loader', options: { importLoaders: 1 } },
						{ loader : "postcss-loader", options: postcssConfig},
						"sass-loader"
					]
				},
				{
					test: /\.styl$/,
					use: [
						MiniCssExtractPlugin.loader,
						{ loader: 'css-loader', options: { importLoaders: 1 } },
						{ loader : "postcss-loader", options: postcssConfig},
						"stylus-loader"
					]
				},
				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader,
						{ loader: 'css-loader', options: { importLoaders: 1 } },
						{ loader : "postcss-loader", options: {config:postcssConfig}},
						"less-loader"
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "css/[name].[hash:5].css",
				chunkFilename: "css/[id].[hash:5].css"
			})
		],
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: false // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessor: require('cssnano'),
      		cssProcessorOptions: { discardComments: { removeAll: true } },
      		canPrint: true
				}),
				new CompressionPlugin(),
				// new FaviconsWebpackPlugin(path.join(cogear.options.src,'favicon.png'))
			]
		}
	});
}