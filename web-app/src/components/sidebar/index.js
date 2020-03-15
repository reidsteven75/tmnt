import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import PublishIcon from '@material-ui/icons/Publish'
import Slider from '@material-ui/core/Slider'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'

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
			width: '75%',
			maxWidth: '100px'
		}
	}

	config = {

	}
	
	// lifecycle
	// ---------

	constructor(props) {
		super(props)

		this.handleLoadClicked = this.handleLoadClicked.bind(this)
		this.handleAnimateClicked = this.handleAnimateClicked.bind(this)
		this.handleSpeedChange = this.handleSpeedChange.bind(this)
		this.handleAnimateReset = this.handleAnimateReset.bind(this)
		
	}

	// functions
	// ---------

	valuetext(value) {
		return `${value}`
	}

	handleAnimateReset() {
		this.props.handleAnimateReset()
	}

	handleLoadClicked() {
		this.props.handleLoadClicked()
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
						stepNext,
						config,
						fileNameLoaded,
						isAnimate,
						isLoadingFile,
						endState,
						isAnimationResetRequired } = this.props

		const marks = [
			config.simulateSpeed.slow.slider,
			config.simulateSpeed.mid.slider,
			config.simulateSpeed.fast.slider,
		]

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

				<Button
					variant='outlined'
					color='primary'
					style={this.style.button}
					startIcon={isLoadingFile ? null : <PublishIcon />}
					onClick={this.handleLoadClicked}
					disabled={isLoadingFile}
				>
					{isLoadingFile ? <CircularProgress size={24}/> : 'Load'}
				</Button>

				<br/><br/>
				<Typography color='textSecondary' noWrap={true}>
					{ fileNameLoaded ? fileNameLoaded : 'no file loaded' }
				</Typography>

				<br/>
				<Divider variant='fullWidth' />
				<br/>

				<Button
					variant='outlined'
					color={isAnimate ? 'secondary' : 'primary'}
					style={this.style.button}
					onClick={this.handleAnimateClicked}
					disabled={fileNameLoaded && !isAnimationResetRequired ? false : true}
					startIcon={<PlayCircleOutlineIcon/>}
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
					disabled={fileNameLoaded ? false : true}
					marks={marks}
					valueLabelDisplay='off'
					onChangeCommitted={this.handleSpeedChange}
				/>

				<br/><br/>

				<Button
					variant='outlined'
					color={'primary'}
					style={this.style.button}
					onClick={this.handleAnimateReset}
					disabled={fileNameLoaded ? false : true}
					startIcon={<RotateLeftIcon/>}
				>
					Reset
				</Button>

				<br/><br/>

				<Divider variant='fullWidth' />
				<br/>

				<Card>
     			<CardContent>
					 	<Typography color='textPrimary' align='left'>Leonardo</Typography>
						<br/>
						<Grid container spacing={0}>
							<Grid item xs={6}>
								<img 
									src={require('../../images/leonardo.png')}
									style={this.style.avatar}
								/>
							</Grid>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Action</Typography>
								<Typography color='textPrimary'>{char}</Typography>
							</Grid>
						</Grid>
						{/* <Grid container spacing={0}>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Pos.</Typography>
								<Typography color='textPrimary'>{positionCurrent}</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Rot.</Typography>
								<Typography color='textPrimary'>{rotationCurrent}</Typography>
							</Grid>
						</Grid> */}
					</CardContent>
				</Card>

				<br/>

				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>State</TableCell>
								<TableCell align='center'>Position</TableCell>
								<TableCell align='center'>Rotation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow key={row.state}>
									<TableCell component='th' scope='row'>
										{row.state}
									</TableCell>
									<TableCell align='center'>{row.position}</TableCell>
									<TableCell align='center'>{row.rotation}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
{/* 
				<br/>

				<Card>
     			<CardContent>
						<Typography color='textPrimary' align='left'>Next State</Typography>
						<br/>
						<Grid container spacing={0}>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Pos.</Typography>
								<Typography color='textPrimary'>{positionNext}</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Rot.</Typography>
								<Typography color='textPrimary'>{rotationNext}</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>

				<br/>

				<Card>
     			<CardContent>
						<Typography color='textPrimary' align='left'>End State</Typography>
						<br/>
						<Grid container spacing={0}>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Pos.</Typography>
								<Typography color='textPrimary'>{positionEnd}</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography color='textSecondary'>Rot.</Typography>
								<Typography color='textPrimary'>{rotationEnd}</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card> */}

				<br/>
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
