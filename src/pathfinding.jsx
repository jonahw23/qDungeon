
//issues: much faster in best-case than dfs but gives unhelpful answer in less favorable cases
//solution: run quick DFS that only works in best case and if not run BFS
//other idea: only have enemies pathfind if the quick DFS works (line-of-sight-like checkzz)
export function dfs(x0, y0, x1, y1, visited, stack) {
  if (stack === undefined) {
    stack = [[x0, y0]]
  }

  if (x0 === x1 && y0 === y1) {
    return [true, stack]
  }
  //all next moves
  const nearest = (a, b) => {
    let aDist = (a[0] - x1) ** 2 + (a[1] - y1) ** 2
    let bDist = (b[0] - x1) ** 2 + (b[1] - y1) ** 2
    if (aDist === bDist) {
      return 0
    }
    return aDist < bDist ? -1 : 1
  }
  let nextPos = [[x0 + 1, y0], [x0 - 1, y0], [x0, y0 + 1], [x0, y0 - 1]]
  nextPos = nextPos.sort(nearest)

  visited[x0][y0] = true
  //only checks two best moves
  for (let i = 0; i < 2; i++) {
    let n = nextPos[i]
    if (n[0] >= 0 && n[0] < visited.length && n[1] >= 0 && n[1] < visited[n[0]].length && !visited[n[0]][n[1]]) {
      let s = [...stack]
      s.push(n)
      if (n[0] === x1 && n[1] === y1) {
        return [true, s]
      }
      let out = dfs(n[0], n[1], x1, y1, visited, s)
      if (out[0]) {
        return out
      }


    }
  }
  return [false]

}

export function bfs(x0, y0, x1, y1, visited) {

  let queue = []
  let paths = []
  let path = []

  visited[x0][y0] = true
  queue.push([x0, y0])
  paths.push([])

  const nearest = (a, b) => {
    let aDist = (a[0] - x1) ** 2 + (a[1] - y1) ** 2
    let bDist = (b[0] - x1) ** 2 + (b[1] - y1) ** 2
    if (aDist === bDist) {
      return 0
    }
    return aDist < bDist ? -1 : 1
  }

  while (queue.length > 0) {
    path.push([x0, y0])

    if (x0 === x1 && y0 === y1) {
      return [true, path]
    }

    let nextPos = [[x0 + 1, y0], [x0 - 1, y0], [x0, y0 + 1], [x0, y0 - 1]]
    nextPos = nextPos.sort(nearest)

    for (let i = 0; i < nextPos.length; i++) {
      let n = nextPos[i]
      if (n[0] >= 0 && n[0] < visited.length && n[1] >= 0 && n[1] < visited[n[0]].length && !visited[n[0]][n[1]]) {
        queue.push(n)
        paths.push([...path])
        visited[n[0]][n[1]] = true
      }

    }

    x0 = queue[0][0]
    y0 = queue[0][1]
    queue.shift()
    path = paths[0]
    paths.shift()
  }
  return [false]
}

//might add line of sight checker?
//Either for pathfinding, player sight, or both


//Fixed LOS check, should work now
export function sightCheck(x0, y0, x1, y1, map) {
  if (x0 === x1 && y0 === y1) {
    return true
  }

  let axis = Math.abs(x1 - x0) > Math.abs(y1 - y0) ? true : false

  let slope = axis ? (y1 - y0) / (x1 - x0) : (x1 - x0) / (y1 - y0)
  let length = axis ? Math.abs(x1 - x0) : Math.abs(y1 - y0)
  let step = axis ? Math.sign(x1 - x0) : Math.sign(y1 - y0)

  for (let i = 0; i < length; i++) {
    let x = axis ? x0 + i * step : x0 + slope * i * step
    let y = axis ? y0 + slope * i * step : y0 + i * step

    if (helperCheck(x, y, map)) {
      return false
    }
  }
  return true
}

function helperCheck(x, y, map) {
  let xR = x % 1 !== 0.5
  let yR = y % 1 !== 0.5
  if (xR && yR) {
    return map[Math.round(x)][Math.round(y)]
  } else if (xR && !yR) {
    return (map[Math.round(x)][Math.floor(y)] || map[Math.round(x)][Math.ceil(y)])
  } else if (!xR && yR) {
    return (map[Math.floor(x)][Math.round(y)] || map[Math.ceil(x)][Math.round(y)])
  }
  return (map[Math.floor(x)][Math.floor(y)] || map[Math.ceil(x)][Math.ceil(y)])
}

export function boardToBoolean(board) {
  let map = []
  for (let x = 0; x < board.length; x++) {
    map.push([])
    for (let y = 0; y < board[x].length; y++) {
      map[x].push(board[x][y] === 1)
    }
  }
  return map
}

export function transparency(base, overlay, alpha) {
  let color1 = [parseInt(base.substring(1, 3), 16),
  parseInt(base.substring(3, 5), 16),
  parseInt(base.substring(5, 7), 16)]
  let color2 = [parseInt(overlay.substring(1, 3), 16),
  parseInt(overlay.substring(3, 5), 16),
  parseInt(overlay.substring(5, 7), 16)]
  let color3 = [Math.floor(alpha * color1[0] + (1 - alpha) * color2[0]),
  Math.floor(alpha * color1[1] + (1 - alpha) * color2[1]),
  Math.floor(alpha * color1[2] + (1 - alpha) * color2[2])]
  let out = "#" +
    color3[0].toString(16) +
    color3[1].toString(16) +
    color3[2].toString(16)
  return out
}

function pathToDirections(path){
  let dir = []
  let diffMap={
    "01": "down",
    "0-1": "up",
    "10": "right",
    "-10": "left",
  }
  for(let i = 0; i < path.length-1; i++){
    dir[i] = diffMap["" + (path[i][0]-path[i-1][0])+ (path[i][1]-path[i-1][1])]
  }
  return dir
}