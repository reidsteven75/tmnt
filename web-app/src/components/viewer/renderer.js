import React, { Component } from 'react'
import * as p5 from 'p5'

import { coordinatesToGridPixels } from '../../utils'

/*
	rotation: 0-359 degrees, 0 = north
*/

class Renderer extends Component {

	config = {
		numGridLines: 10,
		circleRadius: 25,
		triangleSize: 20,
		updateInterval: 500,
		nodeRadiusUnique: 5,
		nodeRadiusDuplicate: 10,
		nodeRadiusOrigin: 25,
    cooridinateHoverRadius: 20
	}

	// config = {
	// 	numGridLines: 10,
	// 	circleRadius: 6,
	// 	triangleSize: 4,
	// 	updateInterval: 500,
	// 	nodeRadiusUnique: 1,
	// 	nodeRadiusDuplicate: 2,
	// 	nodeRadiusOrigin: 10,
  //   cooridinateHoverRadius: 1
	// }

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
		}
	}

	cache = {
		nodesTravelled: [],
		pathsTravelled: [],
		nodesDuplicate: [],
    pathsDuplicate: [],
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
			prevIndex: 0,
			prevPosition_X: 0,
			prevPosition_Y: 0,
			prevRotation: 0,
			currentIndex: 0,
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
			// this.updateCanvasSize()
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
						stepCurrent,
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
		if (steps && steps[parseIndex - 1] && parseIndexPrev !== parseIndex && isAnimate !== true) {
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
                grid_X + 10, 
                grid_Y + 10) 
                < 
                this.config.cooridinateHoverRadius) {

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

	redrawCanvas() {

		const { canvasWidth, 
						canvasHeight, 
						currentPosition_X, 
						currentPosition_Y, 
						nextPosition_X, 
						nextPosition_Y } = this.state

		this.setState({
			currentPosition_X: currentPosition_X + diffX,
			currentPosition_Y: currentPosition_Y + diffY,
			nextPosition_X: nextPosition_X + diffX,
			nextPosition_Y: nextPosition_Y + diffY
		}, () => {
			this.p5.resizeCanvas(canvasWidth, canvasHeight).redraw()
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
			// this.sk.frameRate(26)

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

						{ circleRadius,
							triangleSize,
							nodeRadiusUnique,
							nodeRadiusDuplicate,
							nodeRadiusOrigin } = this.config,
						
						cos = (degrees) => { return(Math.cos(degrees * Math.PI / 180).toFixed(2)) },
						sin = (degrees) => { return(Math.sin(degrees * Math.PI / 180).toFixed(2)) }

			var	dx, 
					dy,
					drot,
					colorIntensity = 0,
					colorIncrement = 1,
					strokeWeight = 1

      this.sk.clear().noFill()
			
			// turtle - draw
			const drawTurtle = (pos_X, pos_Y, rot, r , g, b, radius, weight) => {
				const x1 = pos_X - (triangleSize/2)*cos(rot),
							x2 = pos_X + (triangleSize/2)*cos(rot),
							x3 = pos_X + triangleSize*sin(rot),
							y1 = pos_Y - (triangleSize/2)*sin(rot),
							y2 = pos_Y + (triangleSize/2)*sin(rot),
							y3 = pos_Y - triangleSize*cos(rot)

				this.sk.stroke(r,g,b)
								.noFill()
								.strokeWeight(3)
								.triangle(x1,y1,x2,y2,x3,y3)
								.ellipse(
									pos_X,
									pos_Y,
									radius,
									radius
								)
			}
			
			// turtle - current state
			dy = nextPosition_Y - currentPosition_Y
			dx = nextPosition_X - currentPosition_X
			for (var i = 0; i < circleRadius; i += colorIncrement ) {

				// determine if moving
				if (Math.abs(dy) > 0.5 || Math.abs(dx) > 0.5) {
					colorIntensity = Math.floor(Math.random() * 5 * Math.max(Math.abs(dx),Math.abs(dy))) 
					colorIncrement = 2
					strokeWeight = 1
				}
				else { 
					colorIncrement = 5
					strokeWeight = 3
				}
				drawTurtle(
					currentPosition_X, 
					currentPosition_Y, 
					currentRotation, 
					37 + colorIntensity, 
					175 + colorIntensity, 
					180 + colorIntensity,
					i,
					strokeWeight
				)
			}	

			// travelled paths
			if (parsedPaths && parsedPaths.length > 0) {
				parsedPaths.forEach((path) => {
					if (path.index <= parseIndex - 1) {
						this.sk.stroke(	152, 255, 152)
								.strokeWeight(1)
								.line(
									path.x1,
									path.y1,
									path.x2,
									path.y2
								)
					}
				})
			}
			// duplicate paths
			if (parsedDupPaths && parsedDupPaths.length > 0) {
				parsedDupPaths.forEach((path) => {
					if (path.index <= parseIndex - 1) {
						this.sk.stroke(	249, 111, 97)
									.strokeWeight(4)
									.line(
										path.x1,
										path.y1,
										path.x2,
										path.y2
									)
					}
				})
			}

			// origin node
			this.sk.stroke(	34, 150, 243)
						.noFill()
						.strokeWeight(1)
						.ellipse(
							origin_X,
							origin_Y,
							nodeRadiusOrigin,
							nodeRadiusOrigin
						)
			
			// travelled nodes
			if (parsedNodes && parsedNodes.length > 0) {
				parsedNodes.forEach((node) => {
					if (node.index <= parseIndex - 1) {
						this.sk.stroke(	152, 255, 152)
									.strokeWeight(1)
									.fill(255, 255, 255)
									.ellipse(
										node.x,
										node.y,
										nodeRadiusUnique,
										nodeRadiusUnique
									)
					}
				})
			}
			// duplicate nodes
			if (parsedDupNodes && parsedDupNodes.length > 0) {
				parsedDupNodes.forEach((node) => {
					if (node.index <= parseIndex - 1) {
						this.sk.stroke(	249, 111, 97)
									.strokeWeight(3)
									.fill(255, 255, 255)
									.ellipse(
										node.x,
										node.y,
										nodeRadiusDuplicate,
										nodeRadiusDuplicate
									)
					}
				})
      }
      
      // hovered cooridinte
      if (cooridinateMouseOver) {
        this.sk.stroke(255, 255, 255)
								.strokeWeight(0.9)
								.noFill()
								.ellipse(
									cooridinateMouseOver.render.x,
									cooridinateMouseOver.render.y,
									10,
									10
                )
                .fill(128, 128, 128, 200)
                .rect(
                  cooridinateMouseOver.render.x-30, 
                  cooridinateMouseOver.render.y-32, 
                  60, 
                  22,
                  15
                )
                .fill(255, 255, 255)
                .textAlign(this.p5.CENTER)
                .textFont('Helvetica')
                .text(
                  cooridinateMouseOver.label, 
                  cooridinateMouseOver.render.x, 
                  cooridinateMouseOver.render.y-17
                  )
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
		
			// console.log(rotFactor, currentRotation, nextRotation)
			
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

		let content = 
      <div 
        id='sketch-area-grid' 
        ref={this.sketchRef}
        style={this.style.sketchArea}
      >
      </div>
    
    return (
        <div style={this.style.wrapper}>
					{content}
        </div>
		)
  }
}

export default Renderer
