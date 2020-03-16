import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Slider from '@material-ui/core/Slider'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'

class Animator extends Component {

  style = {
    button: {
      width: '100%'
    },
    slider: {
      width: '85%'
    }
  }

  // lifecycle
  // ---------
  constructor(props) {
    super(props)		
  }
  
  // function
  // --------
  valuetext(value) {
    return `${value}`
  }

  // render
  // ------
  render() {
    const { config,
            fileNameLoaded,
            isAnimate,
            handleSpeedChange,
            handleAnimateClicked } = this.props

    const marks = [
      config.simulateSpeed.slow.slider,
      config.simulateSpeed.mid.slider,
      config.simulateSpeed.fast.slider,
    ]

    return (
      <div>
        <Button
          variant='outlined'
          color={isAnimate ? 'secondary' : 'primary'}
          style={this.style.button}
          onClick={handleAnimateClicked}
          disabled={fileNameLoaded ? false : true}
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
          onChangeCommitted={handleSpeedChange}
        />
      </div>
    )
  } 
}

export default Animator
