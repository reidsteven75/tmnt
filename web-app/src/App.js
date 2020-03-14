import React, { Component } from 'react'
import './App.css'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import teal from '@material-ui/core/colors/teal'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Header from './components/header'
import Viewer from './components/viewer'
import Sidebar from './components/sidebar'

import { getFile } from './api-adapter'

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
  gridDimensions: 30,
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

// const steps = [
//   {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 0},
//   {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 0},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 90},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:0 }, rotation: 90},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 90},
//   {char: 'L', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 0},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 0},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 90},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:-1 }, rotation: 180},
//   {char: 'F', dupNode: true, dupPath: true, position: { x:2, y:0 }, rotation: 180},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:2, y:0 }, rotation: 270},
//   {char: 'F', dupNode: true, dupPath: true, position: { x:1, y:0 }, rotation: 270},
//   {char: 'R', dupNode: false, dupPath: false, position: { x:1, y:0 }, rotation: 0},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-1 }, rotation: 0},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-2 }, rotation: 0},
//   {char: 'F', dupNode: false, dupPath: false, position: { x:1, y:-3 }, rotation: 0}
// ]


// app
// ----
class App extends Component {

  cache = {
    parserFunction: null,
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
      parseIndex: 0,
      isAnimate: false,
      fileNameLoaded: null,
      showErrorDialog: false,
      errorMessage: null,
      steps: null
    }

		this._handleAnimateClicked = this._handleAnimateClicked.bind(this)
    this._handleSpeedChange = this._handleSpeedChange.bind(this)
    this._handleLoadClicked = this._handleLoadClicked.bind(this)
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this)

  }

  componentDidMount() {

  }

  // functions
  // ---------

  parserAdjustSpeed() {
    clearInterval(this.cache.parserFunction)
    this.parserStart()
  }

  parserPause() {
    clearInterval(this.cache.parserFunction)
  }

  parserStart() {

    const { simulateSpeed } = this.state
    const updateRate = config.simulateSpeed[simulateSpeed].updateRate

    this.cache.parserFunction = setInterval(() => {

      let { parseIndex, steps } = this.state
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

  async _handleLoadClicked() {
    try {
      let res = await getFile()
      this.setState({
        fileNameLoaded: res.fileName,
        steps: res.fileData.steps
      }) 
    } 
    catch (error) {
      this.showErrorDialoge(error)
    }
    
  }

  showErrorDialoge(error) {
    this.setState({
      showErrorDialog: true,
      errorMessage: error
    })
  }

  handleErrorDialogClose() {
    this.setState({
      showErrorDialog: false,
    })
  }

	_handleAnimateClicked() {
    const { isAnimate } = this.state

    if (isAnimate !== true) {
      this.setState({ isAnimate: true }, () => {
        this.parserStart()
      })
    }
    else {
      this.setState({ isAnimate: false }, () => {
        this.parserPause()
      })
    }
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
            simulateSpeed,
            fileNameLoaded,
            showErrorDialog,
            errorMessage,
            isAnimate,
            steps } = this.state

    const easing = config.simulateSpeed[simulateSpeed].easing

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Header/>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <Sidebar
                isAnimate={isAnimate}
                fileNameLoaded={fileNameLoaded}
                stepCurrent={stepCurrent}
                handleAnimateClicked={this._handleAnimateClicked}
                handleSpeedChange={this._handleSpeedChange}
                handleLoadClicked={this._handleLoadClicked}
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
          
          <Dialog 
            aria-labelledby='dialog-title' 
            open={showErrorDialog}
            onClose={this.handleErrorDialogClose} 
          >
            <DialogTitle 
              id='dialog-title'
            >
              Error
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {errorMessage}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div> 
      </MuiThemeProvider>
    )
  }
}

export default (App)
