import React, { Component } from 'react'

import StepSlider from './step-slider.js'
import Renderer from './renderer.js'

class Viewer extends Component {

	config = {

	}

	style = {
		wrapper: {
			padding: 15,
			height: '100%',
			margin: 'auto'
		}
	}

	// lifecycle
	// ---------

  constructor(props) {
    super(props)
    this.state = {
			loading: true,
			rendererOrigin_X: null,
      rendererOrigin_Y: null,
      rendererCanvasWidth: null,
      rendererCanvasHeight: null
		}
	}

	componentDidMount() {
		this.setState({loading:false})
	}	

	// render
	// ------

  render() {

		const {
			easing,
			gridDimensions,
			stepCurrent,
			stepPrevious,
			stepNext,
			stepIndexNext,
			stepCount,
			parseIndex,
			steps,
			config,
			endState,
			fileNameLoaded,
			handleRendererUpdateDimensions,
			cache,
			handleSliderChange,
			isAnimate
		} = this.props

		let content = 
		  <React.Fragment>
				<StepSlider
					disabled={fileNameLoaded}
					max={stepCount}
					value={parseIndex}
					config={config}
					parseIndex={parseIndex}
					handleChange={handleSliderChange}
				/>
				<Renderer
					cache={cache}
					handleRendererUpdateDimensions={handleRendererUpdateDimensions}
					easing={easing}
					gridDimensions={gridDimensions}
					steps={steps}
					stepCurrent={stepCurrent}
					stepPrevious={stepPrevious}
					stepNext={stepNext}
					parseIndex={parseIndex}
					endState={endState}
					isAnimate={isAnimate}
				/>
				
			</React.Fragment>
      
    return (
        <div style={this.style.wrapper}>
					{content}
        </div>
		)
  }
}

export default Viewer
