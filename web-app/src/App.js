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

import { coordinatesToGridPixels } from './utils'
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
  gridPadding: 5,
  simulateSpeed: {
    fast: {
      updateRate: 1,
      easing: 1,
      slider: {
        value: 2,
        label: 'Fast'
      }
    },
    mid: {
      updateRate: 300,
      easing: 0.3,
      slider: {
        value: 1,
        label: 'Normal'
      }
    },
    slow: {
      updateRate: 1000,
      easing: 0.1,
      slider: {
        value: 0,
        label: 'Slow'
      }
    }
  }
}

// app
// ----
class App extends Component {

  cache = {
    parserFunction: null,
    parsedDupNodes: [],
    parsedNodes: [],
    parsedDupPaths: [],
    parsedPaths: []
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
      stepCount: null,
      steps: null,
      endState: null,
      gridDimensions: null,
      fileNameLoaded: null,
      parseIndex: 0,
      isAnimate: false,
      isLoadingFile: false,
      showErrorDialog: false,
      errorMessage: null,
      rendererWidth: null,
      rendererHeight: null
    }

    this._handleRendererUpdateDimensions = this._handleRendererUpdateDimensions.bind(this)
    // this._handleAnimateReset = this._handleAnimateReset.bind(this)
		this._handleAnimateClicked = this._handleAnimateClicked.bind(this)
    this._handleSpeedChange = this._handleSpeedChange.bind(this)
    this._handleLoadClicked = this._handleLoadClicked.bind(this)
    this._handleViewerSliderChange = this._handleViewerSliderChange.bind(this)
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

  parserReset() {
    clearInterval(this.cache.parserFunction)
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
          parseIndex: parseIndex + 1
        })
      }
      if (!stepNext) {
        this.setState({
          isAnimate: false
        })
      }

    }, updateRate)
  }

  parsePaths(paths, gridDimensions) {
    if (!paths || paths.length === 0) { return [] }

    const { rendererWidth,
            rendererHeight } = this.state

    let parsed = []
    paths.forEach((path) => {
      const pixelPos1 = coordinatesToGridPixels(
        path.path[0][0],
        path.path[0][1],
        rendererWidth, 
        rendererHeight, 
        gridDimensions
      )
      const pixelPos2 = coordinatesToGridPixels(
        path.path[1][0],
        path.path[1][1],
        rendererWidth, 
        rendererHeight, 
        gridDimensions
      )
      parsed.push ({
        index: path.i,
        x1: pixelPos1.x,
        y1: pixelPos1.y,
        x2: pixelPos2.x,
        y2: pixelPos2.y
      })
    })
    return parsed
  }

  parseNodes(nodes, gridDimensions) {
    if (!nodes || nodes.length === 0) { return [] }

    const { rendererWidth,
            rendererHeight } = this.state

    let parsed = []
    nodes.forEach((node) => {
      const pixelPos = coordinatesToGridPixels(
        node.position[0],
        node.position[1],
        rendererWidth, 
        rendererHeight, 
        gridDimensions
      )
      parsed.push ({
        index: node.i,
        x: pixelPos.x,
        y: pixelPos.y
      })
    })
    return parsed
  }

  _handleViewerSliderChange(value) {
    this.parserPause()
    this.setState({
      parseIndex: value + 1,
      isAnimate: false
    })
  }

  _handleRendererUpdateDimensions(width, height) {
    this.setState({
      rendererWidth: width,
      rendererHeight: height
    })
  }

  _handleLoadClicked() {
    this.setState({
      isLoadingFile: true
    }, async () => {
      try {
        let res = await getFile()
        const roundedGridDim = 2 * Math.round(res.fileData.gridDimension + config.gridPadding / 2)

        console.log(res)

        this.cache.parsedDupNodes = this.parseNodes(res.fileData.dupNodes, roundedGridDim)
        this.cache.parsedNodes = this.parseNodes(res.fileData.nodes, roundedGridDim)
        this.cache.parsedDupPaths = this.parsePaths(res.fileData.dupPaths, roundedGridDim)
        this.cache.parsedPaths = this.parsePaths(res.fileData.paths, roundedGridDim)

        this.parserReset()
        this.setState({
          isLoadingFile: false,
          fileNameLoaded: res.fileName,
          steps: res.fileData.steps,
          endState: res.fileData.endState,
          gridDimensions: roundedGridDim,
          stepCurrent: null,
          stepPrevious: null,
          stepNext: null,
          stepCount: res.fileData.steps.length - 1,
          parseIndex: res.fileData.steps.length,
          isAnimate: false
        }) 
      } 
      catch (error) {
        this.setState({isLoadingFile: false}, () => {
          this.showErrorDialoge(error)
        })
      }
    })
    
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

    const { stepCount,
            parseIndex } = this.state

    if (isAnimate !== true) {
      let newState = { isAnimate: true }
      // restart at 0 if end of animation
      if (stepCount + 1 === parseIndex) { newState.parseIndex = 0 }
      this.parserReset()
      this.setState(newState, () => {
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
            stepCount,
            parseIndex,
            simulateSpeed,
            fileNameLoaded,
            showErrorDialog,
            errorMessage,
            isAnimate,
            isLoadingFile,
            steps,
            endState,
            gridDimensions } = this.state

    const easing = config.simulateSpeed[simulateSpeed].easing

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Header/>
          <Grid container spacing={0}>
            <Grid item xs={2} style={{width:'20%'}}>
              <Sidebar  
                isLoadingFile={isLoadingFile}
                isAnimate={isAnimate}
                fileNameLoaded={fileNameLoaded}
                stepCurrent={stepCurrent}
                stepNext={stepNext}
                handleAnimateClicked={this._handleAnimateClicked}
                handleSpeedChange={this._handleSpeedChange}
                handleLoadClicked={this._handleLoadClicked}
                config={config}
                endState={endState}
              />
            </Grid>
            <Grid item xs={10} style={{width:'80%'}}>
              <Viewer
                handleSliderChange={this._handleViewerSliderChange}
                handleRendererUpdateDimensions={this._handleRendererUpdateDimensions}
                cache={this.cache}
                easing={easing}
                gridDimensions={gridDimensions}
                fileNameLoaded={fileNameLoaded}
                steps={steps}
                stepCurrent={stepCurrent}
                stepPrevious={stepPrevious}
                stepNext={stepNext}
                stepCount={stepCount}
                parseIndex={parseIndex}
                endState={endState}
                isAnimate={isAnimate}
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
