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
      width: ' 100%',
      margin: 'auto'
    },
    sketchAreaGrid: {
      border: '1px solid black',
      height: '80vh',
      width: `calc(95% - ${285}px)`,
      margin: 'auto',
      position: 'fixed',
      top: 170,
      left: 320
    },
    sketchAreaTurtle: {
      border: '1px solid gray',
      height: '80vh',
      width: `calc(95% - ${285}px)`,
      margin: 'auto',
      position: 'fixed',
      top: 170,
      left: 320
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
    this.sketchRefGrid = React.createRef()
    this.sketchRefTurtle = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this))
    
    this.s_grid = (sk) => {  
      this.sk_grid = sk
      this.initP5_grid()
    }
    this.p5_grid = new p5(this.s_grid)
    this.p5_grid.disableFriendlyErrors = true

    this.s_turtle = (sk) => {  
      this.sk_turtle = sk
      this.initP5_turtle()
    }
    this.p5_turtle = new p5(this.s_turtle)
    this.p5_turtle.disableFriendlyErrors = true

    this.setState({loading:false})

    // FPS Logging
    // -----------
    // setInterval(() => {
    // 	console.log('FPS (T, G): ', Math.round(this.sk_turtle.frameRate()), Math.round(this.sk_grid.frameRate()))
    // }, 100)
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
      }, () => {
        this.redrawGrid()
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
      }, () => {
        this.redrawGrid()
      })
    }
  }

  // functions
  // ---------

  redrawGrid() {
    this.sk_grid.redraw(1)
  }
  
  handleMouseMove() {
    const { mouseX, mouseY, dist } = this.p5_turtle
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

  // -------------------------
  // GRID
  // -------------------------

  initP5_grid() {
    this.sk_grid.setup = () => {
       const sketchRef = this.sketchRefGrid.current
       const origin_X = sketchRef.offsetWidth/2
       const origin_Y = sketchRef.offsetHeight/2
       const canvasHeight = sketchRef.offsetHeight
       const canvasWidth = sketchRef.offsetWidth
 
       let canvas = this.sk_grid.createCanvas(canvasWidth, canvasHeight)
       canvas.parent(sketchRef.id)
       this.sk_grid.frameRate(this.props.fps)
       this.sk_grid.noLoop()
 
       this.props.handleRendererUpdateDimensions(
         canvasWidth,
         canvasHeight
       )
 
       this.setState({
         canvasWidth: canvasWidth,
         canvasHeight: canvasHeight,
         origin_X: origin_X,
         origin_Y: origin_Y
       })
    }

    this.sk_grid.draw = () => {
      const { origin_X,
              origin_Y } = this.state,

            { parseIndex } = this.props,

            { parsedDupNodes,
              parsedNodes,
              parsedDupPaths,
              parsedPaths } = this.props.cache,

            { nodeRadiusUnique,
              nodeRadiusDuplicate,
              nodeRadiusOrigin } = this.props.zoomConfig

      this.sk_grid.clear().noFill()
      
      // travelled paths
      if (parsedPaths && parsedPaths.length > 0) {
        parsedPaths.forEach((path) => {
          if (path.index <= parseIndex) {
            drawPathUnique(this.sk_grid,
                              this.p5_grid,
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
          if (path.index <= parseIndex) {
            drawPathDuplicate(this.sk_grid,
                              this.p5_grid,
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
          if (node.index + 1 <= parseIndex) {
            drawNodeUnique(this.sk_grid,
                          this.p5_grid,
                          node.x,
                          node.y,
                          nodeRadiusUnique)
          }
        })
      }
      // duplicate nodes
      if (parsedDupNodes && parsedDupNodes.length > 0) {
        parsedDupNodes.forEach((node) => {
          if (node.index + 1 <= parseIndex) {
            drawNodeDuplicate(this.sk_grid,
                            this.p5_grid,
                            node.x,
                            node.y,
                            nodeRadiusDuplicate)
            }
        })
      }

      // origin node
      drawNodeOrigin(this.sk_grid,
                    this.p5_grid,
                    origin_X,
                    origin_Y,
                    nodeRadiusOrigin)
    }
  }

  // -------------------------
  // TURTLE
  // -------------------------

  initP5_turtle() {

    this.sk_turtle.setup = () => {
       const sketchRef = this.sketchRefTurtle.current
       const origin_X = sketchRef.offsetWidth/2
       const origin_Y = sketchRef.offsetHeight/2
       const canvasHeight = sketchRef.offsetHeight
       const canvasWidth = sketchRef.offsetWidth
 
       let canvas = this.sk_turtle.createCanvas(canvasWidth, canvasHeight)
       canvas.parent(sketchRef.id)
       this.sk_turtle.frameRate(this.props.fps)
 
       this.setState({
         currentPosition_X: origin_X,
         currentPosition_Y: origin_Y,
         nextPosition_X: origin_X,
         nextPosition_Y: origin_Y,
       })
    }

    this.sk_turtle.draw = () => {
      const { nextPosition_X, 
              nextPosition_Y, 
              currentPosition_X, 
              currentPosition_Y, 
              currentRotation,
              nextRotation,
              cooridinateMouseOver } = this.state,

            { easing,
              steps,
              stepNext,
              stepCurrent,
              parseIndex } = this.props,

            { turtleCircleRadius,
              turtleTriangleSize } = this.props.zoomConfig

      let	dx, 
          dy,
          drot

      this.sk_turtle.clear().noFill()
      
      // turtle
      dy = nextPosition_Y - currentPosition_Y
      dx = nextPosition_X - currentPosition_X
      drawTurtle(this.sk_turtle, 
                this.p5_turtle,
                dy,
                dx,
                currentPosition_X,
                currentPosition_Y,
                currentRotation,
                turtleCircleRadius,
                turtleTriangleSize) 	
      
      // hovered cooridinte
      if (cooridinateMouseOver) { 
        drawCooridinate(this.sk_turtle, 
                        this.p5_turtle, 
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
          ref={this.sketchRefGrid}
          style={this.style.sketchAreaGrid}
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
