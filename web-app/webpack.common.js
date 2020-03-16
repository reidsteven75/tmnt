const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              [
                '@babel/plugin-transform-runtime', 
                { 'regenerator': true } 
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      PUBLIC_URL: '',
      inject: false,
      template: './src/index.html'
    }),
    new CopyPlugin([
      { from: 'public', to: '' }
    ]),
    new webpack.DefinePlugin({
      'process.env':{
        'ENV':       JSON.stringify(process.env.ENV),
        'HTTPS':       		JSON.stringify(process.env.HTTPS),
        'HOST': 					JSON.stringify(process.env.HOST),
        'PORT_SERVER': 		  JSON.stringify(process.env.PORT_SERVER),
        'PORT_VIEWER':    JSON.stringify(process.env.PORT_VIEWER)
      }
    }),
    
  ]
}