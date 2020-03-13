import React, { Component } from 'react'
import Slider from '@material-ui/core/Slider'

class StepSlider extends Component {

	config = {

  }

	style = {
		wrapper: {
			padding: 20,
			margin: 'auto',
			position: 'relative',
			top: 20
		},
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

	// functions
	// ---------
	valuetext(value) {
		return `${value}`
	}
	
	// render
	// ------

  render() {

		const { max, value } = this.props

		let content = 
			<div>
        <Slider
					defaultValue={0}
					getAriaValueText={this.valuetext}
					aria-labelledby='discrete-slider-always'
					min={1}
					value={value}
					max={max}
					step={1}
					valueLabelDisplay='on'
				/>
			</div>
      
    return (
        <div style={this.style.wrapper}>
					{content}
        </div>
		)
  }
}

export default StepSlider
