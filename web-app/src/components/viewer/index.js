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
			stepIndexCurrent,
			stepCount,
			parseIndex,
			config,
			endState,
			fileNameLoaded
		} = this.props

		let content = 
		  <React.Fragment>
				<StepSlider
					disabled={fileNameLoaded}
					max={stepCount}
					value={parseIndex}
					config={config}
				/>
				<Renderer
					easing={easing}
					gridDimensions={gridDimensions}
					stepCurrent={stepCurrent}
					stepPrevious={stepPrevious}
					stepNext={stepNext}
					stepIndexNext={stepIndexNext}
					parseIndex={parseIndex}
					endState={endState}
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
