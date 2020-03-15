export const coordinatesToGridPixels = (
    position_x,
    position_y,
    canvasWidth, 
    canvasHeight, 
    gridDimensions
  ) => {

  const stepSizePixels_X = canvasWidth / gridDimensions
  const stepSizePixels_Y = canvasHeight / gridDimensions
  const origin_X = canvasWidth / 2
  const origin_Y = canvasHeight / 2

  return({
    x: origin_X + stepSizePixels_X * position_x,
    y: origin_Y + stepSizePixels_Y * position_y
  })
}