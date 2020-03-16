import React, { Component } from 'react'
import './App.css'

import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { coordinatesToGridPixels } from './utils'
import { theme } from './theme.js'
import { config } from './config.js'

import { getFile } from './api-adapter'
import Header from './components/header'
import Viewer from './components/viewer'
import Sidebar from './components/sidebar'

class App extends Component {

  style = {
    sidebar: {
      width: config.sidebarWidth,
      flexShrink: 0
    },
    main: {
      width: `calc(100% - ${config.sidebarWidth}px)`,
      marginLeft: config.sidebarWidth,
      flexGrow: 1
    },
    header: {
      position: 'relative',
      zIndex: 10000
    }
  }

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
      parseIndex: 0,
      stepCurrent: null,
      stepPrevious: null,
      stepNext: null,
      stepCount: null,
      steps: null,
      endState: null,
      gridDimensions: null,
      fileNameLoaded: null,
      errorMessage: null,
      rendererWidth: null,
      rendererHeight: null,
      isAnimate: false,
      isLoadingFile: false,
      isShowErrorDialog: false,
      viewerZoomConfig: config.zoom['min'],
      simulateSpeed: 'mid'
    }

    this.config = config

    this._handleRendererUpdateDimensions = this._handleRendererUpdateDimensions.bind(this)
		this._handleAnimateClicked = this._handleAnimateClicked.bind(this)
    this._handleSpeedChange = this._handleSpeedChange.bind(this)
    this._handleLoadClicked = this._handleLoadClicked.bind(this)
    this._handleViewerSliderChange = this._handleViewerSliderChange.bind(this)
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this)

  }

  // functions
  // ---------


  parserAdjustSpeed() {
    clearInterval(this.cache.parserFunction)
    this.parserStart()
  }

  parserStop() {
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

  showErrorDialog(error) {
    this.setState({
      isShowErrorDialog: true,
      errorMessage: error
    })
  }

  // event handlers
  // --------------
  handleErrorDialogClose() {
    this.setState({
      isShowErrorDialog: false,
    })
  }

  _handleViewerSliderChange(value) {
    this.parserStop()
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

        this.cache.parsedDupNodes = this.parseNodes(res.fileData.dupNodes, roundedGridDim)
        this.cache.parsedNodes = this.parseNodes(res.fileData.nodes, roundedGridDim)
        this.cache.parsedDupPaths = this.parsePaths(res.fileData.dupPaths, roundedGridDim)
        this.cache.parsedPaths = this.parsePaths(res.fileData.paths, roundedGridDim)

        let viewerZoomConfig
        if (roundedGridDim <= 50) { viewerZoomConfig = config.zoom['min'] }
        else if (roundedGridDim > 50 <= 80) { viewerZoomConfig = config.zoom['mid'] }
        else if (roundedGridDim > 80) { viewerZoomConfig = config.zoom['max'] }

        this.parserStop()
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
          isAnimate: false,
          viewerZoomConfig: viewerZoomConfig
        }) 
      } 
      catch (error) {
        this.setState({isLoadingFile: false}, () => {
          this.showErrorDialog(error)
        })
      }
    })
    
  }

	_handleAnimateClicked() {
    const { isAnimate,
            stepCount,
            parseIndex } = this.state

    if (isAnimate !== true) {
      let newState = { isAnimate: true }
      // restart at 0 if end of animation
      if (stepCount + 1 === parseIndex) { newState.parseIndex = 0 }
      this.parserStop()
      this.setState(newState, () => {
        this.parserStart()
      })
    }
    else {
      this.setState({ isAnimate: false }, () => {
        this.parserStop()
      })
    }
	}

	_handleSpeedChange(speed) {
    let simulateSpeed
    switch(speed) {
      case 0: 
        simulateSpeed = 'slow'
        break
      case 1:
        simulateSpeed = 'mid'
        break
      case 2:
        simulateSpeed = 'fast'
        break
    }
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
            isShowErrorDialog,
            errorMessage,
            isAnimate,
            isLoadingFile,
            steps,
            endState,
            gridDimensions,
            viewerZoomConfig } = this.state

    const easing = config.simulateSpeed[simulateSpeed].easing

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          <Header
            style={this.style.header}
          />
          <Drawer
            style={this.style.sidebar}
            variant='permanent'
            anchor='left'
          >
            <Sidebar  
              config={config}
              isLoadingFile={isLoadingFile}
              isAnimate={isAnimate}
              fileNameLoaded={fileNameLoaded}
              stepCurrent={stepCurrent}
              stepNext={stepNext}
              endState={endState}
              handleAnimateClicked={this._handleAnimateClicked}
              handleSpeedChange={this._handleSpeedChange}
              handleLoadClicked={this._handleLoadClicked}
            />
          </Drawer>
          <main style={this.style.main}>
            <Viewer
              cache={this.cache}
              fps={config.rendererFPS}
              viewerZoomConfig={viewerZoomConfig}
              isAnimate={isAnimate}
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
              handleSliderChange={this._handleViewerSliderChange}
              handleRendererUpdateDimensions={this._handleRendererUpdateDimensions}
            />
          </main>
          
          <Dialog 
            aria-labelledby='dialog-title' 
            open={isShowErrorDialog}
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
