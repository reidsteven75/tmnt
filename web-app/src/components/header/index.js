import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

class Header extends Component {

  // lifecycle
  // ---------
  constructor(props) {
    super(props)
  }

  // render
  // ------
  render() {

    const { style } = this.props

    return (
      <div>
        <AppBar 
          position='static'
          color='inherit'
          style={style}
        >
          <Toolbar>
            <Typography 
              variant='h6' 
              color='textPrimary' 
            >
              Teenage Mutant Ninja Turtle Simulator
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    )
  } 
}

export default Header
