const path = require('path');

module.exports = {
	entry: './src/index.ts',
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}, {
				test: /\.html$/,
				use: 'html-loader'
			}, {

				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'js')
	},
	devtool: 'source-map'
};
