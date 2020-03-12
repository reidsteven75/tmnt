import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const style = {

}

class Header extends Component {

	constructor(props) {
		super(props)
	}

  render() {

		return (
			<div>
				<AppBar 
					position='static'
					color='inherit'
				>
					<Toolbar>
						<Typography 
							variant='h6' 
							color='textPrimary' 
						>
							Teenage Mutant Ninja Turtle
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
		)
	} 
}

export default Header
