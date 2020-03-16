import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider'

import FileLoader from './file-loader.js'
import Animator from './animator.js'
import TurtleState from './turtle-state.js'

class Sidebar extends Component {

  style = {
    wrapper: {
      marginTop: 80,
      height: '100%',
    },
    section: {
      padding: 15
    }
  }

  // lifecycle
  // ---------
  constructor(props) {
    super(props)
  }

  // render
  // ------
  render() {
    const { stepCurrent,
            stepNext,
            config,
            fileNameLoaded,
            isAnimate,
            isLoadingFile,
            endState,
            handleLoadClicked,
            handleSpeedChange,
            handleAnimateClicked } = this.props

    let positionCurrent = '0, 0',
        rotationCurrent = '0°',
        positionNext = '?, ?',
        rotationNext = '?°',
        positionEnd = '?, ?',
        rotationEnd = '?°',
        char = '?'

    if (stepCurrent && stepCurrent.position) {
      positionCurrent = `${stepCurrent.position.x}, ${stepCurrent.position.y}`
      rotationCurrent = `${stepCurrent.rotation}°`
    }

    if (stepNext && stepNext.position) {
      char = stepNext.char
      positionNext = `${stepNext.position.x}, ${stepNext.position.y}`
      rotationNext = `${stepNext.rotation}°`
    }

    if (endState) {
      positionEnd = `${endState.x}, ${endState.y}`
      rotationEnd = `${endState.rotation}°`
    }

    let rows = [
      {state: 'Current', position: positionCurrent, rotation: rotationCurrent},
      {state: 'Next', position: positionNext, rotation: rotationNext},
      {state: 'End', position: positionEnd, rotation: rotationEnd}
    ]

    return (
      <div style={this.style.wrapper}>

        <section style={this.style.section}>
          <FileLoader
            fileNameLoaded={fileNameLoaded}
            isLoadingFile={isLoadingFile}
            handleLoadClicked={handleLoadClicked}
          />
        </section>

        <Divider variant='fullWidth' />

        <section style={this.style.section}>
          <br/>
            <Animator
              config={config}
              isAnimate={isAnimate}
              fileNameLoaded={fileNameLoaded}
              handleSpeedChange={handleSpeedChange}
              handleAnimateClicked={handleAnimateClicked}
            />
          <br/>
        </section>

        <Divider variant='fullWidth' />
        <br/>

        <section style={this.style.section}>
          <TurtleState
            char={char}
            rows={rows}
          />
        </section>

        <br/>
        <Divider variant='fullWidth' />
        <br/>

      </div>
    )
  } 
}

export default Sidebar
