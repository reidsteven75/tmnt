export const config = {
  gridPadding: 5,
  simulateSpeed: {
    fast: {
      updateRate: 1,
      easing: 1,
      slider: {
        value: 2,
        label: 'Fast'
      }
    },
    mid: {
      updateRate: 300,
      easing: 0.3,
      slider: {
        value: 1,
        label: 'Normal'
      }
    },
    slow: {
      updateRate: 1000,
      easing: 0.1,
      slider: {
        value: 0,
        label: 'Slow'
      }
    }
  },
  zoom: {
    min: {
      turtleCircleRadius: 25,
      turtleTriangleSize: 20,
      nodeRadiusUnique: 5,
      nodeRadiusDuplicate: 10,
      nodeRadiusOrigin: 25
    },
    mid: {
      turtleCircleRadius: 15,
      turtleTriangleSize: 11,
      nodeRadiusUnique: 2,
      nodeRadiusDuplicate: 4,
      nodeRadiusOrigin: 15
    },
    max: {
      turtleCircleRadius: 6,
      turtleTriangleSize: 4,
      nodeRadiusUnique: 1,
      nodeRadiusDuplicate: 2,
      nodeRadiusOrigin: 10
    }
  }
}