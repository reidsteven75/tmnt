import React, { Component } from 'react'
import * as p5 from 'p5'

/*
	rotation: 0-359 degrees, 0 = north
*/

class Grid extends Component {

	config = {
		circleRadius: 25,
		triangleSize: 20,
		updateInterval: 500,
		nodeRadiusUnique: 5,
    nodeRadiusDuplicate: 15,
    cooridinateHoverRadius: 20
	}

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
			nextIndex: 0,
			nextPosition_X: 0,
			nextPosition_Y: 0,
      nextRotation: 0,
      cooridinateMouseOver: null,
		}

		this.sketchRef = React.createRef()
		
	}

	componentDidMount() {

    window.addEventListener('mousemove', this.handleMouseMove.bind(this))

		this.s = (sk) => {  
			this.sk = sk
			this.updateCanvasSize()
			this.initP5()
		}
		this.p5 = new p5(this.s)
		this.setState({loading:false})

	}	

	componentDidUpdate(props) {

		const { nextIndex, 
						currentPosition_X, 
						currentPosition_Y, 
						stepSizePixels_X, 
						stepSizePixels_Y,
						origin_X,
						origin_Y } = this.state,

          { stepNext, 
            stepIndexNext,
            parseIndex } = props,

					{ nodesTravelled,
						pathsTravelled,
						nodesDuplicate,
            pathsDuplicate } = this.cache
    
    // check if should reset travel visualizations
    if (parseIndex <= 1) {
      this.cache = {
        nodesTravelled: [],
        pathsTravelled: [],
        nodesDuplicate: [],
        pathsDuplicate: [],
        currentPosition_X: origin_X,
        currentPosition_Y: origin_Y,
        currentRotation: 0
      }
    }

		// check if positions should be re-calculated
		if (stepNext && nextIndex !== stepIndexNext) {

			// position & rotation
			const nextPosition_X = origin_X + stepSizePixels_X * stepNext.position.x,
			 			nextPosition_Y = origin_Y + stepSizePixels_Y * stepNext.position.y,
			 			nextRotation = stepNext.rotation

			// nodes					
			if (stepNext.dupNode === true) { 
				nodesDuplicate.push({
					x:currentPosition_X, 
					y:currentPosition_Y 
				}) 
			}
			else {
				nodesTravelled.push({
					x:currentPosition_X, 
					y:currentPosition_Y 
				})
			}

			// paths
			if (stepNext.dupPath === true) { 
				pathsDuplicate.push({
					x1:currentPosition_X, 
					y1:currentPosition_Y,
					x2:nextPosition_X, 
					y2:nextPosition_Y
				}) 
			}
			else {
				pathsTravelled.push({
					x1:currentPosition_X, 
					y1:currentPosition_Y,
					x2:nextPosition_X, 
					y2:nextPosition_Y
				}) 
			}

			this.setState({
				nextIndex: stepIndexNext,
				nextPosition_X: nextPosition_X,
				nextPosition_Y: nextPosition_Y,
				nextRotation: nextRotation,
			})
			// , () => {
			// 	this.sk.redraw(100)
			// })
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

	updateCanvasSize() {
		const height = this.sketchRef.current.offsetHeight
		const width = this.sketchRef.current.offsetWidth
		this.setState({
			canvasWidth: width,
			canvasHeight: height
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

		const { gridDimensions } = this.props

		this.sk.setup = () => {

			const { canvasWidth, canvasHeight } = this.state

			const sketchRef = this.sketchRef.current
			const origin_X = sketchRef.offsetWidth/2
			const origin_Y = sketchRef.offsetHeight/2

			let canvas = this.sk.createCanvas(canvasWidth, canvasHeight)
			// this.sk.noStroke().noLoop()
			canvas.parent(sketchRef.id)

			this.setState({
				origin_X: origin_X,
				origin_Y: origin_Y,
				currentPosition_X: origin_X,
				currentPosition_Y: origin_Y,
				nextPosition_X: origin_X,
				nextPosition_Y: origin_Y,
			})

		}

		this.sk.draw = () => {

			const { canvasWidth, 
							canvasHeight, 
							nextPosition_X, 
							nextPosition_Y, 
							currentPosition_X, 
							currentPosition_Y, 
							currentRotation,
              nextRotation,
              cooridinateMouseOver } = this.state,

						{ easing } = this.props,

						{ nodesTravelled,
							nodesDuplicate,
							pathsTravelled,
							pathsDuplicate } = this.cache,

						{ circleRadius,
							triangleSize,
							nodeRadiusUnique,
							nodeRadiusDuplicate } = this.config,
						
						cos = (degrees) => { return(Math.cos(degrees * Math.PI / 180).toFixed(2)) },
						sin = (degrees) => { return(Math.sin(degrees * Math.PI / 180).toFixed(2)) }

			var	dx, 
					dy,
					drot,
					colorIntensity = 0,
					colorIncrement = 1

      this.sk.clear().noFill()

      // position diff
      dy = nextPosition_Y - currentPosition_Y
			dx = nextPosition_X - currentPosition_X

			// grid
			for (var x = 0; x < canvasWidth; x += canvasWidth / gridDimensions) {
				for (var y = 0; y < canvasHeight; y += canvasHeight / gridDimensions) {
          this.sk.stroke(105,105,105)
                  .strokeWeight(0.1)
					        .line(x, 0, x, canvasHeight)
                  .line(0, y, canvasWidth, y)
                  .strokeWeight(0.7)
				}
			}
			
			// turtle
			for (var i = 0; i < circleRadius; i += colorIncrement ) {

				// determine if moving
				if (Math.abs(dy) > 0.5 || Math.abs(dx) > 0.5) {
					colorIntensity = Math.floor(Math.random() * 5 * Math.max(Math.abs(dx),Math.abs(dy))) 
					colorIncrement = 2
					this.sk.strokeWeight(1)
				}
				else { 
					colorIncrement = 5
					this.sk.strokeWeight(3)
				}

				const x1 = currentPosition_X - (triangleSize/2)*cos(currentRotation),
							x2 = currentPosition_X + (triangleSize/2)*cos(currentRotation),
							x3 = currentPosition_X + triangleSize*sin(currentRotation),
							y1 = currentPosition_Y - (triangleSize/2)*sin(currentRotation),
							y2 = currentPosition_Y + (triangleSize/2)*sin(currentRotation),
							y3 = currentPosition_Y - triangleSize*cos(currentRotation)

        this.sk.stroke(37 + colorIntensity, 175 + colorIntensity, 180 + colorIntensity)
                .triangle(x1,y1,x2,y2,x3,y3)
								.ellipse(
									currentPosition_X,
									currentPosition_Y,
									i,
									i
								)
			}	

			// travelled paths
			if (pathsTravelled.length > 0) {
				pathsTravelled.forEach((path) => {
					this.sk.stroke(	152, 255, 152)
								.strokeWeight(1)
								.line(
									path.x1,
									path.y1,
									path.x2,
									path.y2
								)
				})
			}
			// duplicate paths
			if (pathsDuplicate.length > 0) {
				pathsDuplicate.forEach((path) => {
					this.sk.stroke(	249, 111, 97)
								.strokeWeight(4)
								.line(
									path.x1,
									path.y1,
									path.x2,
									path.y2
								)
				})
			}
			
			// travelled nodes
			if (nodesTravelled.length > 0) {
				nodesTravelled.forEach((node) => {
					this.sk.stroke(	152, 255, 152)
								.strokeWeight(1)
								.ellipse(
									node.x,
									node.y,
									nodeRadiusUnique,
									nodeRadiusUnique
								)
				})
			}
			// duplicate nodes
			if (nodesDuplicate.length > 0) {
				nodesDuplicate.forEach((node) => {
					this.sk.stroke(	249, 111, 97)
								.strokeWeight(3)
								.ellipse(
									node.x,
									node.y,
									nodeRadiusDuplicate,
									nodeRadiusDuplicate
								)
				})
      }
      
      // hovered cooridinte

      if (cooridinateMouseOver) {
        this.sk.stroke(255, 255, 255)
								.strokeWeight(0.9)
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

			// update position
			
      // TODO: figure out rotation edge case from 270 -> 0
      let rotFactor = 0
			if (currentRotation > 180 && nextRotation === 0) {
				drot = 360 - currentRotation
			}
			else {
				drot = nextRotation - currentRotation
      }
      
      if (currentRotation > 359) {
        rotFactor = 360
      }

			this.setState({
				stepSizePixels_X: canvasWidth / gridDimensions,
				stepSizePixels_Y: canvasHeight / gridDimensions,
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
        id='sketch-area' 
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

export default Grid
