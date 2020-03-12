import React, { Component } from 'react'
import './App.css'

import Header from './components/header'
import Viewer from './components/viewer'

const HTTPS = (process.env.HTTPS === 'true')
const PROD = (process.env.ENV === 'production')
const SERVER = (HTTPS ? 'https://' : 'http://') + process.env.HOST + (PROD ? '' : ':' + process.env.PORT_SERVER)
const API = SERVER + '/api'

// app
// ----
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {

    return (
      <div className='App'>
        <Header/>
        <Viewer/>
      </div> 
    )
  }
}

export default (App)
