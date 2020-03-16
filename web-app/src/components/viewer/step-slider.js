import React, { Component } from 'react'
import Slider from '@material-ui/core/Slider'

class StepSlider extends Component {

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
			loading: true
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		this.setState({loading:false})
	}	

	// functions
	// ---------
	valuetext(value) {
		return `${value}`
	}

	handleChange(e, value) {
		this.props.handleChange(value)
	}
	
	// render
	// ------
  render() {
		const	{ max, 
						disabled,
						parseIndex } = this.props
    
    return (
        <div style={this.style.wrapper}>
					<Slider
						defaultValue={0}
						getAriaValueText={this.valuetext}
						aria-labelledby='discrete-slider-always'
						min={0}
						value={parseIndex - 1}
						max={max ? max : 0}
						step={1}
						onChange={this.handleChange}
						disabled={disabled ? false : true}
						valueLabelDisplay={disabled ? 'on' : 'off'}
					/>
        </div>
		)
  }
}

export default StepSlider