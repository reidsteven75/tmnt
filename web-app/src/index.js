import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

console.info('ENV: ' + process.env.ENV)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)