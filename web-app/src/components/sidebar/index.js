import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import GetAppIcon from '@material-ui/icons/GetApp'
import PublishIcon from '@material-ui/icons/Publish'
import Slider from '@material-ui/core/Slider'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

class Sidebar extends Component {

	style = {
		wrapper: {
			padding: 15,
			height: '100%',
			borderRight: '1px solid rgba(255, 255, 255, 0.12)'
		},
		button: {
			width: '100%'
		},
		slider: {
			width: '85%'
		},
		avatar: {
			width: '50%'
		}
	}

	config = {

	}
	
	// lifecycle
	// ---------

	constructor(props) {
		super(props)

		this.handleAnimateClicked = this.handleAnimateClicked.bind(this)
		this.handleSpeedChange = this.handleSpeedChange.bind(this)
	}

	// functions
	// ---------

	valuetext(value) {
		return `${value}`
	}

	handleAnimateClicked() {
		this.props.handleAnimateClicked()
	}

	handleSpeedChange(speed, value) {
		this.props.handleSpeedChange(value)
	}

	// render
	// ------

  render() {

		const { stepCurrent,
						config } = this.props

		const marks = [
			config.simulateSpeed.slow.slider,
			config.simulateSpeed.mid.slider,
			config.simulateSpeed.fast.slider,
		]

		let position = '?',
				rotation = '?'

		if (stepCurrent && stepCurrent.position) {
			position = `[ ${stepCurrent.position.x}, ${stepCurrent.position.y} ]`
			rotation = `${stepCurrent.rotation}°`
		}

		return (
			<div style={this.style.wrapper}>

				<Button
					variant='outlined'
					color='primary'
					style={this.style.button}
					startIcon={<PublishIcon />}
				>
					Load 
				</Button>

				<br/><br/>
				<Divider variant='fullWidth' />
				<br/>

				<img 
					src={require('../../images/leonardo.png')}
					style={this.style.avatar}
				/>

				<br/>

				<Grid container spacing={0}>
					<Grid item xs={6}>
						<Typography color='textSecondary'>Position</Typography>
						<Typography color='textPrimary'>{position}</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography color='textSecondary'>Rotation</Typography>
						<Typography color='textPrimary'>{rotation}</Typography>
					</Grid>
					<Grid item xs={6}></Grid><Grid item xs={6}></Grid>
				</Grid>

				<br/>
				<Divider variant='fullWidth' />
				<br/>

				<Button
					variant='outlined'
					color='secondary'
					style={this.style.button}
					onClick={this.handleAnimateClicked}
					startIcon={<PlayCircleOutlineIcon />}
				>
					Animate 
				</Button>

				<br/><br/>

				<Slider
					defaultValue={1}
					style={this.style.slider}
					getAriaValueText={this.valuetext}
					aria-labelledby='discrete-slider-always'
					min={0}
					max={2}
					step={1}
					marks={marks}
					valueLabelDisplay='off'
					onChangeCommitted={this.handleSpeedChange}
				/>

				<br/><br/>
				<Divider variant='fullWidth' />
				<br/>
{/* 
				<Button
					variant='outlined'
					color='primary'
					style={this.style.button}
					startIcon={<GetAppIcon />}
				>
					Export 
				</Button> */}


			</div>
		)
	} 
}

export default Sidebar
