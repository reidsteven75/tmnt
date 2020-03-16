import { coordinatesToGridPixels } from '../utils'

export const parserAdjustSpeed = () => {
  clearInterval(this.cache.parserFunction)
  this.parserStart()
}

export const parserStop = () => {
  clearInterval(this.cache.parserFunction)
}

export const parserStart = () => {
  console.log(this)
  const { simulateSpeed } = this.state
  const updateRate = this.config.simulateSpeed[simulateSpeed].updateRate

  this.cache.parserFunction = setInterval(() => {

    let { parseIndex, steps } = this.state
    let stepCurrent, stepNext, stepPrevious

    if (typeof steps[parseIndex] !== 'undefined') { stepCurrent = steps[parseIndex] }
    if (typeof steps[parseIndex + 1] !== 'undefined') { stepNext = steps[parseIndex + 1] }
    if (typeof steps[parseIndex - 1] !== 'undefined') { stepPrevious = steps[parseIndex - 1] }

    if (stepCurrent) {
      this.setState({
        stepCurrent: stepCurrent,
        stepNext: stepNext,
        stepPrevious: stepPrevious,
        parseIndex: parseIndex + 1
      })
    }
    if (!stepNext) {
      this.setState({
        isAnimate: false
      })
    }

  }, updateRate)
}

export const parsePaths = (paths, gridDimensions) => {
  if (!paths || paths.length === 0) { return [] }
  const { rendererWidth,
          rendererHeight } = this.state

  let parsed = []
  paths.forEach((path) => {
    const pixelPos1 = coordinatesToGridPixels(
      path.path[0][0],
      path.path[0][1],
      rendererWidth, 
      rendererHeight, 
      gridDimensions
    )
    const pixelPos2 = coordinatesToGridPixels(
      path.path[1][0],
      path.path[1][1],
      rendererWidth, 
      rendererHeight, 
      gridDimensions
    )
    parsed.push ({
      index: path.i,
      x1: pixelPos1.x,
      y1: pixelPos1.y,
      x2: pixelPos2.x,
      y2: pixelPos2.y
    })
  })
  return parsed
}

export const parseNodes = (nodes, gridDimensions) => {
  if (!nodes || nodes.length === 0) { return [] }
  const { rendererWidth,
          rendererHeight } = this.state

  let parsed = []
  nodes.forEach((node) => {
    const pixelPos = coordinatesToGridPixels(
      node.position[0],
      node.position[1],
      rendererWidth, 
      rendererHeight, 
      gridDimensions
    )
    parsed.push ({
      index: node.i,
      x: pixelPos.x,
      y: pixelPos.y
    })
  })
  return parsed
}