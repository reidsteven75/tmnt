import React, { Component } from 'react'
import './App.css'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import teal from '@material-ui/core/colors/teal'

import Header from './components/header'
import Viewer from './components/viewer'

const HTTPS = (process.env.HTTPS === 'true')
const PROD = (process.env.ENV === 'production')
const SERVER = (HTTPS ? 'https://' : 'http://') + process.env.HOST + (PROD ? '' : ':' + process.env.PORT_SERVER)
const API = SERVER + '/api'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      light: teal['A200'],
      main: teal['A400'],
      dark: teal['A700'],
    },
  },
  typography: {
    useNextVariants: true,
  },
})

const config = {
  gridDimensions: 20,
  simulateSpeed: {
    fast: {
      updateRate: 50,
      easing: 0.95
    },
    medium: {
      updateRate: 400,
      easing: 0.2
    },
    slow: {
      updateRate: 2000,
      easing: 0.05
    }
  }
}

const simulateSpeed = config.simulateSpeed['medium']
const gridDimensions = config.gridDimensions

const steps = [
  {char: 'start', trans: { x:0, y:0 }, rot: 0},
  {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
  {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 0},
  {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 90},
  {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:0 }, rotation: 90},
  {char: 'F', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 90},
  {char: 'L', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 0},
  {char: 'F', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 0},
  {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 90},
  {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 180},
  {char: 'F', dupNode: true, dupPath: true, position: { x:2, y:0 }, rotation: 180},
  {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 270},
  {char: 'F', dupNode: true, dupPath: true, position: { x:1, y:0 }, rotation: 270},
  {char: 'R', dupNode: false, dupPath: false, position: { x:1, y:0 }, rotation: 0},
  {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-1 }, rotation: 0},
  {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-2 }, rotation: 0},
  {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-3 }, rotation: 0}
]


// app
// ----
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stepCurrent: null,
      stepPrevious: null,
      stepNext: null,
      stepIndexNext: 0
    }
  }

  componentDidMount() {

    let index = 0
    setTimeout(() => {
      setInterval(() => {

        let stepCurrent, stepNext, stepPrevious
  
        if (typeof steps[index] !== 'undefined') { stepCurrent = steps[index] }
        if (typeof steps[index + 1] !== 'undefined') { stepNext = steps[index + 1] }
        if (typeof steps[index - 1] !== 'undefined') { stepPrevious = steps[index - 1] }
  
        if (stepNext) {
          this.setState({
            stepCurrent: stepCurrent,
            stepNext: stepNext,
            stepPrevious: stepPrevious,
            stepIndexNext: index + 1
          })
        }

        index += 1
      }, simulateSpeed.updateRate)
    }, 1000)
    
  }

  render() {

    const { stepPrevious, 
            stepCurrent, 
            stepNext, 
            stepIndexNext } = this.state

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Header/>
          <Viewer
            easing={simulateSpeed.easing}
            gridDimensions={gridDimensions}
            stepCurrent={stepCurrent}
            stepPrevious={stepPrevious}
            stepNext={stepNext}
            stepIndexNext={stepIndexNext}
          />
        </div> 
      </MuiThemeProvider>
    )
  }
}

export default (App)
