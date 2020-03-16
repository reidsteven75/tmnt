import React, { Component } from 'react'
import * as p5 from 'p5'

import { coordinatesToGridPixels } from '../../utils'
import { 
				drawCooridinate, 
				drawTurtle,
				drawNodeOrigin,
				drawNodeDuplicate,
				drawNodeUnique,
				drawPathDuplicate,
				drawPathUnique
			} from './draw.js'
/*
	rotation: 0-359 degrees, 0 = north
*/

class Renderer extends Component {

	style = {
		wrapper: {
			padding: 15,
			height: '100%',
			margin: 'auto'
		},
		sketchArea: {
			border: '1px solid black',
			height: '80vh',
			margin: 'auto'
		},
		sketchAreaTurtle: {
			border: '1px solid black',
			height: '80vh',
			margin: 'auto'
		}
	}

	// lifecycle
	// ---------
  constructor(props) {
    super(props)
    this.state = {
			loading: true,
			stepSizePixels_X: 0,
			stepSizePixels_Y: 0,
			canvasWidth: 0,
			canvasHeight: 0,
			origin_X: 0,
			origin_Y: 0,
			currentPosition_X: 0,
			currentPosition_Y: 0,
			currentRotation: 0,
			nextPosition_X: 0,
			nextPosition_Y: 0,
      nextRotation: 0,
			cooridinateMouseOver: null,
			isReset: false
		}
		this.sketchRef = React.createRef()
	}

	componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this))
		this.s = (sk) => {  
			this.sk = sk
			this.initP5()
		}
		this.p5 = new p5(this.s)
		this.p5.disableFriendlyErrors = true
		this.setState({loading:false})
	}	

	componentDidUpdate(prevProps) {
		const { canvasWidth, 
						canvasHeight,
						origin_X,
						origin_Y,
						isReset } = this.state,

					{ gridDimensions,
						stepNext,
						parseIndex,
						isAnimate,
						steps } = this.props,

						parseIndexPrev = prevProps.parseIndex

		// check if should reset visualizations
		if (parseIndex === 0 && isReset !== true) {
			this.setState({
				isReset: true,
				currentPosition_X: origin_X,
				currentPosition_Y: origin_Y,
				nextPosition_X: origin_X,
				nextPosition_Y: origin_Y,
				currentRotation: 0,
				nextRotation: 0
			})
		}

		// if slider is moving, calculate next pixel position
		if (isAnimate !== true && steps && steps[parseIndex - 1] && parseIndexPrev !== parseIndex) {
			let pixelsNext = coordinatesToGridPixels(
				steps[parseIndex - 1].position.x,
				steps[parseIndex - 1].position.y,
				canvasWidth, 
				canvasHeight, 
				gridDimensions
			)
			this.setState({
				isReset: false,
				nextPosition_X: pixelsNext.x,
				nextPosition_Y: pixelsNext.y,
				nextRotation: steps[parseIndex - 1].rotation,
			})
		}

		// if animation, calculate next pixel position
		else if (steps && steps[parseIndex - 1] && stepNext && parseIndexPrev !== parseIndex) {
			let pixelsNext = coordinatesToGridPixels(
				stepNext.position.x,
				stepNext.position.y,
				canvasWidth, 
				canvasHeight, 
				gridDimensions
			)
			this.setState({
				isReset: false,
				nextPosition_X: pixelsNext.x,
				nextPosition_Y: pixelsNext.y,
				nextRotation: stepNext.rotation,
			})
		}
	}

	// functions
	// ---------
  
  handleMouseMove() {
    const { mouseX, mouseY, dist } = this.p5
    const { gridDimensions } = this.props
    const { canvasWidth, canvasHeight } = this.state
		let cooridinate = null
		
    for (var x = 0; x < gridDimensions; x += 1) {
      for (var y = 0; y < gridDimensions; y += 1) {
        const grid_X = x * canvasWidth / gridDimensions,
              grid_Y = y * canvasHeight / gridDimensions
        if (dist(
                mouseX, 
                mouseY, 
                grid_X, 
                grid_Y) 
                < 
                5) {
          cooridinate = {
            render: {
              x: grid_X,
              y: grid_Y
            },
            label: `${x - gridDimensions/2}, ${y - gridDimensions/2}`
          }
        }
      }
    }
    this.setState({
			cooridinateMouseOver: cooridinate
    })
  }

	initP5() {
		this.sk.setup = () => {
			 const sketchRef = this.sketchRef.current
			 const origin_X = sketchRef.offsetWidth/2
			 const origin_Y = sketchRef.offsetHeight/2
			 const canvasHeight = sketchRef.offsetHeight
			 const canvasWidth = sketchRef.offsetWidth
 
			 let canvas = this.sk.createCanvas(canvasWidth, canvasHeight)
			 canvas.parent(sketchRef.id)
			 this.sk.frameRate(30)
 
			 this.props.handleRendererUpdateDimensions(
				 canvasWidth,
				 canvasHeight
			 )
 
			 this.setState({
				 canvasWidth: canvasWidth,
				 canvasHeight: canvasHeight,
				 origin_X: origin_X,
				 origin_Y: origin_Y,
				 currentPosition_X: origin_X,
				 currentPosition_Y: origin_Y,
				 nextPosition_X: origin_X,
				 nextPosition_Y: origin_Y,
			 })
		}

		this.sk.draw = () => {
			// console.log('FPS: ' + Math.round(this.sk.frameRate()))
			const { nextPosition_X, 
							nextPosition_Y, 
							currentPosition_X, 
							currentPosition_Y, 
							currentRotation,
              nextRotation,
							cooridinateMouseOver,
							origin_X,
							origin_Y } = this.state,

						{ easing,
							steps,
							stepNext,
							stepCurrent,
							parseIndex } = this.props,

						{ parsedDupNodes,
							parsedNodes,
							parsedDupPaths,
							parsedPaths } = this.props.cache,

						{ turtleCircleRadius,
							turtleTriangleSize,
							nodeRadiusUnique,
							nodeRadiusDuplicate,
							nodeRadiusOrigin } = this.props.zoomConfig

			let	dx, 
					dy,
					drot

      this.sk.clear().noFill()
			
			// travelled paths
			if (parsedPaths && parsedPaths.length > 0) {
				parsedPaths.forEach((path) => {
					if (path.index <= parseIndex - 1) {
						drawPathUnique(this.sk,
															this.p5,
															path.x1,
															path.y1,
															path.x2,
															path.y2)
					}
				})
			}
			// duplicate paths
			if (parsedDupPaths && parsedDupPaths.length > 0) {
				parsedDupPaths.forEach((path) => {
					if (path.index <= parseIndex - 1) {
						drawPathDuplicate(this.sk,
															this.p5,
															path.x1,
															path.y1,
															path.x2,
															path.y2)
					}
				})
			}
			
			// travelled nodes
			if (parsedNodes && parsedNodes.length > 0) {
				parsedNodes.forEach((node) => {
					if (node.index <= parseIndex - 1) {
						drawNodeUnique(this.sk,
													this.p5,
													node.x,
													node.y,
													nodeRadiusUnique)
					}
				})
			}
			// duplicate nodes
			if (parsedDupNodes && parsedDupNodes.length > 0) {
				parsedDupNodes.forEach((node) => {
					if (node.index <= parseIndex - 1) {
						drawNodeDuplicate(this.sk,
														this.p5,
														node.x,
														node.y,
														nodeRadiusDuplicate)
						}
				})
			}

			// origin node
			drawNodeOrigin(this.sk,
										this.p5,
										origin_X,
										origin_Y,
										nodeRadiusOrigin)
			
			// turtle
			dy = nextPosition_Y - currentPosition_Y
  		dx = nextPosition_X - currentPosition_X
			drawTurtle(this.sk, 
								this.p5,
								dy,
								dx,
								currentPosition_X,
								currentPosition_Y,
								currentRotation,
								turtleCircleRadius,
								turtleTriangleSize) 	
      
      // hovered cooridinte
      if (cooridinateMouseOver) { 
				drawCooridinate(this.sk, 
												this.p5, 
												cooridinateMouseOver) 
			}
			
      // account for rotations from 270 -> 0, 0 -> 270
			let rotFactor = 0
			drot = nextRotation - currentRotation
			if (stepNext && steps[parseIndex-1]) {
				if (stepCurrent.rotation === 270 && stepNext.rotation === 0) {
					if (currentRotation >= 180) {
						rotFactor = 360
						drot = 0
					} else {
						drot = 0 - currentRotation
					}
				}
				else if (stepCurrent.rotation === 0  && stepNext.rotation === 270) {	
					if (currentRotation <= 1) {
						rotFactor = -360 
						drot = 0
					} else {
						drot = 270 - currentRotation
					}
				}
			} 
			
			// update position
			this.setState({
				currentRotation: currentRotation + drot * easing - rotFactor,
				currentPosition_X: currentPosition_X + dx * easing,
				currentPosition_Y: currentPosition_Y + dy * easing
			})
		}
	}
	
	// render
	// ------

  render() {
    return (
			<div style={this.style.wrapper}>
				<div 
					id='sketch-area-grid' 
					ref={this.sketchRef}
					style={this.style.sketchArea}
				>
				</div>
				<div 
					id='sketch-area-turtle' 
					ref={this.sketchRefTurtle}
					style={this.style.sketchAreaTurtle}
				>
				</div>
			</div>
		)
  }
}

export default Renderer
