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

				test: /\.css$/,
				use: [{
						loader: 'style-loader'
					}, {
						loader: 'css-loader'
					// }, {
					// 	loader: 'less-loader'
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'js')
	}
};
