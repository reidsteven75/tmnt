const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const EventHooksPlugin = require('event-hooks-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: process.env.HOST,
    port: process.env.PORT_WEB_APP,
    historyApiFallback: true,
    stats: 'errors-only',
    open: true
  },
  plugins: [
    new EventHooksPlugin({
      done: () => {
        const HTTPS = (process.env.HTTPS === 'true')
        const HOST = (HTTPS ? 'https://' : 'http://') + process.env.HOST

        console.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.info('~= TENAGE MUTANT NINJA TURTLE: Web App =~')
        console.info('-----------------------------------------')
        console.info('ENV: ' + process.env.ENV)
        console.info('URL: ' + HOST + ':' + process.env.PORT_WEB_APP)
        console.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      }
    })
  ]
})