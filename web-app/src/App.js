import React, { Component } from 'react'
import './App.css'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import teal from '@material-ui/core/colors/teal'
import Grid from '@material-ui/core/Grid'

import Header from './components/header'
import Viewer from './components/viewer'
import Sidebar from './components/sidebar'

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
  gridDimensions: 10,
  simulateSpeed: {
    fast: {
      updateRate: 50,
      easing: 0.95,
      slider: {
        value: 2,
        label: 'Fast'
      }
    },
    mid: {
      updateRate: 400,
      easing: 0.2,
      slider: {
        value: 1,
        label: 'Normal'
      }
    },
    slow: {
      updateRate: 2000,
      easing: 0.05,
      slider: {
        value: 0,
        label: 'Slow'
      }
    }
  }
}

const gridDimensions = config.gridDimensions

const steps = [
  {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
  {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 0},
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

  cache = {
    parserFunction: null
  }


  // lifecycle
  // ---------
  
  constructor(props) {
    super(props)
    this.state = {
      simulateSpeed: 'mid',
      stepCurrent: null,
      stepPrevious: null,
      stepNext: null,
      stepIndexNext: null,
      stepIndexCurrent: null,
      stepCount: null,
      parseIndex: 0
    }

		this._handleAnimateClicked = this._handleAnimateClicked.bind(this)
		this._handleSpeedChange = this._handleSpeedChange.bind(this)
  }

  componentDidMount() {
    setTimeout(() => { this.parserStart() }, 1000)
  }

  // functions
  // ---------

  parserAdjustSpeed() {
    clearInterval(this.cache.parserFunction)
    this.parserStart()
  }

  parserStart() {

    const { simulateSpeed } = this.state
    const updateRate = config.simulateSpeed[simulateSpeed].updateRate

    this.cache.parserFunction = setInterval(() => {

      let { parseIndex } = this.state
      let stepCurrent, stepNext, stepPrevious

      if (typeof steps[parseIndex] !== 'undefined') { stepCurrent = steps[parseIndex] }
      if (typeof steps[parseIndex + 1] !== 'undefined') { stepNext = steps[parseIndex + 1] }
      if (typeof steps[parseIndex - 1] !== 'undefined') { stepPrevious = steps[parseIndex - 1] }

      if (stepCurrent) {
        this.setState({
          stepCurrent: stepCurrent,
          stepNext: stepNext,
          stepPrevious: stepPrevious,
          stepIndexCurrent: parseIndex,
          stepIndexNext: parseIndex + 1,
          stepCount: steps.length - 1,
          parseIndex: parseIndex + 1
        })
      }

    }, updateRate)
  }

	_handleAnimateClicked() {
    this.setState({
      parseIndex: 0
    })
	}

	_handleSpeedChange(speed) {

    let simulateSpeed
    if (speed === 0) { simulateSpeed = 'slow'}
    else if (speed === 1) { simulateSpeed = 'mid'}
    else if (speed === 2) { simulateSpeed = 'fast'}

    this.setState({
      simulateSpeed: simulateSpeed
    }, () => {
      this.parserAdjustSpeed()
    })
	}

  // render
  // ------
  
  render() {

    const { stepPrevious, 
            stepCurrent, 
            stepNext, 
            stepIndexNext,
            stepIndexCurrent,
            stepCount,
            parseIndex,
            simulateSpeed } = this.state

    const easing = config.simulateSpeed[simulateSpeed].easing

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Header/>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <Sidebar
                stepCurrent={stepCurrent}
                handleAnimateClicked={this._handleAnimateClicked}
                handleSpeedChange={this._handleSpeedChange}
                config={config}
              />
            </Grid>
            <Grid item xs={10}>
              <Viewer
                easing={easing}
                gridDimensions={gridDimensions}
                steps={steps}
                stepIndexCurrent={stepIndexCurrent}
                stepCurrent={stepCurrent}
                stepPrevious={stepPrevious}
                stepNext={stepNext}
                stepIndexNext={stepIndexNext}
                stepCount={stepCount}
                parseIndex={parseIndex}
                
              />
            </Grid>
          </Grid>
          
        </div> 
      </MuiThemeProvider>
    )
  }
}

export default (App)
