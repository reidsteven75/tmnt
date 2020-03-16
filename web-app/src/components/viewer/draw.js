import { cos, sin } from '../../utils'

export const drawCooridinate = 
  (
    sk, 
    p5, 
    cooridinate
  ) => {
    sk.stroke(255, 255, 255)
      .strokeWeight(0.9)
      .noFill()
      .ellipse(
        cooridinate.render.x,
        cooridinate.render.y,
        8,
        8
      )
      .fill(128, 128, 128, 200)
      .rect(
        cooridinate.render.x-30, 
        cooridinate.render.y-32, 
        60, 
        22,
        15
      )
      .fill(255, 255, 255)
      .textAlign(p5.CENTER)
      .textFont('Helvetica')
      .text(
        cooridinate.label, 
        cooridinate.render.x, 
        cooridinate.render.y-17
        )
}

export const drawNodeOrigin = 
  (
    sk,
    p5,
    x,
    y,
    radius
  ) => {
  sk.stroke(34, 150, 243)
    .noFill()
    .strokeWeight(1)
    .ellipse(
      x,
      y,
      radius,
      radius
    )
}

export const drawNodeDuplicate = 
  (
    sk,
    p5,
    x,
    y,
    radius
  ) => {
    sk.stroke(249, 111, 97)
      .strokeWeight(2)
      .fill(255, 255, 255)
      .ellipse(
        x,
        y,
        radius,
        radius
      )
}

export const drawNodeUnique = 
  (
    sk,
    p5,
    x,
    y,
    radius
  ) => {
    sk.stroke(152, 255, 152)
      .strokeWeight(1)
      .fill(255, 255, 255)
      .ellipse(
        x,
        y,
        radius,
        radius
      )
}

export const drawPathDuplicate = 
  (
    sk,
    p5,
    x1,
    y1,
    x2,
    y2
  ) => {
    sk.stroke(249, 111, 97)
      .strokeWeight(2)
      .line(
        x1,
        y1,
        x2,
        y2
      )
}

export const drawPathUnique = 
  (
    sk,
    p5,
    x1,
    y1,
    x2,
    y2
  ) => {
    sk.stroke(152, 255, 152)
      .strokeWeight(1)
      .line(
        x1,
        y1,
        x2,
        y2
      )
}

export const drawTurtle =
  (
    sk, 
    p5,
    dy,
    dx,
    currentPosition_X,
    currentPosition_Y,
    currentRotation,
    turtleCircleRadius,
    turtleTriangleSize
  ) => {

  const draw = (pos_X, pos_Y, rot, r , g, b, radius) => {
    const x1 = pos_X - (turtleTriangleSize/2)*cos(rot),
          x2 = pos_X + (turtleTriangleSize/2)*cos(rot),
          x3 = pos_X + turtleTriangleSize*sin(rot),
          y1 = pos_Y - (turtleTriangleSize/2)*sin(rot),
          y2 = pos_Y + (turtleTriangleSize/2)*sin(rot),
          y3 = pos_Y - turtleTriangleSize*cos(rot)

    sk.stroke(r,g,b)
      .strokeWeight(3)
      .triangle(x1,y1,x2,y2,x3,y3)
      .ellipse(
        pos_X,
        pos_Y,
        radius,
        radius
      )
  }

  let colorIntensity,
      colorIncrement,
      strokeWeight

  for (var i = 0; i < turtleCircleRadius; i += colorIncrement ) {
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
    draw(
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
}