export function makeRandomMap(x, y, amount, wX = 5, wY = 5, weight = 0.3, maxWalls = 0, gridVar = 0) {

  let board = createBlankBoard(x, y);

  //evenly spread out first walls
  let wAmount = x / wX;
  let hAmount = y / wY;

  let wSpread = Math.floor(x / wAmount)
  let hSpread = Math.floor(y / hAmount)

  for (let i = 0; i < amount; i++) {

    let w = createWall(createBlankBoard(wX, wY), { weight: weight, maxWalls: maxWalls, gridVaf: gridVar });

    //if alreayd made even walls, spray rest randly
    if (i > (wAmount + 1) * (hAmount + 1) || amount < wAmount * hAmount) {

      board = superimposeBoard(board, w, Math.floor(rand(0, board.length)), Math.floor(rand(0, board[0].length)));

      //make first walls even so map has some structure
    } else {
      board = superimposeBoard(board, w,
        Math.round(rand(wSpread * (i % Math.floor(wAmount + 1)) - gridVar, wSpread * (i % Math.floor(wAmount + 1)) + gridVar)),
        Math.round(rand(hSpread * Math.floor(i / (wAmount + 1)) - gridVar, hSpread * Math.floor(i / (wAmount + 1)) + gridVar))
      );
    }
  }
  //create connected map to fill in unreachable blocks
  let c = createBlankBoard(board.length, board[0].length);
  let maxGroup = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {

      if (c[i][j] === 0 && board[i][j] === 0) {
        c = connectedBFS(board, i, j, c);
        if (c[i][j] > maxGroup) {
          maxGroup = c[i][j];
        }
      }
    }
  }

  let fillCount = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 1 && c[i][j] < maxGroup) {
        fillCount++;
        board[i][j] = 1;
      }
    }
  }
  if (maxGroup * 0.2 < fillCount) {
    //this is called if over 80% of non-walls are unreachable
    console.log("BAD MAP!");
  }

  return board;
}



function createBlankBoard(x, y) {
  let board = [];
  for (let i = 0; i < x; i++) {
    board.push([])
    for (let j = 0; j < y; j++) {
      board[i].push(0);
    }
  }
  return board;
}

function copyBoard(board) {
  let copy = [];
  for (let i = 0; i < board.length; i++) {
    copy.push([])
    for (let j = 0; j < board[i].length; j++) {
      copy[i].push(board[i][j]);
    }
  }
  return copy;
}

export function superimposeBoard(b, add, x, y) {
  let newBoard = copyBoard(b);
  for (let i = 0; i < add.length; i++) {
    for (let j = 0; j < add[i].length; j++) {
      if (i + x < newBoard.length && x + i >= 0 && y + j < newBoard[0].length && y + j >= 0) {
        if (add[i][j] !== 0) {
          newBoard[i + x][j + y] = add[i][j];
        }
      }
    }
  }
  return newBoard;
}

function getNeighbors(board, x, y) {
  let n = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if ((i === 0 || j === 0) && i + j !== 0) {
        if (x + i < board.length && x + i >= 0 && y + j < board[0].length && y + j >= 0) {
          if (board[i + x][j + y] === 1) {
            n++;
          }
        }
      }
    }
  }
  return n;
}

function createWall(section, params) {
  let itr = params.itr ? params.itr : 0
  let maxWalls = params.maxWalls ? params.maxWalls : 0
  let blocks = (params.blocks ? params.blocks : 0)
  let weight = (params.weight ? params.weight : 0)

  let newSec = copyBoard(section);

  if (itr === 0) {
    newSec[Math.floor(newSec.length / 2)][Math.floor(newSec[0].length / 2)] = 1;
    newSec = createWall(newSec, { weight: weight, maxWalls: maxWalls, itr: itr + 1, blocks: 1 });
  } else {
    let added = false;
    for (let x = 0; x < newSec.length; x++) {
      for (let y = 0; y < newSec[x].length; y++) {
        if (section[x][y] === 0) {
          let n = getNeighbors(section, x, y);
          if (n > 0 && rand(0, 1) < weight / (n * itr) && (maxWalls === 0 || blocks < maxWalls)) {
            newSec[x][y] = 1;
            blocks++;
            added = true;
          }
        }
      }
    }
    if (added) {
      newSec = createWall(newSec,
        { weight: weight, maxWalls: maxWalls, itr: itr + 1, blocks: blocks });
    }
  }
  //bug here???
  return newSec;
}

function createConnectionMap(board) {
  let c = createBlankBoard(board.length, board[0].length);
  let maxGroup = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {

      if (c[i][j] === 0 && board[i][j] === 0) {
        c = connectedBFS(board, i, j, c);
        if (c[i][j] > maxGroup) {
          maxGroup = c[i][j];
        }
      }
    }
  }

  return c;
}

function connectedBFS(b, x, y, connectMap) {

  let board = copyBoard(b);

  let count = 0;

  let q = []

  q.push([x, y]);



  while (q.length > 0) {
    x = q[0][0];
    y = q[0][1];

    let next = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];


    for (let i = 0; i < next.length; i++) {
      let n = next[i]
      if (n[0] >= 0 && n[0] < board.length && n[1] >= 0 && n[1] < board[n[0]].length && board[n[0]][n[1]] === 0) {
        q.push(n);

        board[n[0]][n[1]] = 2;
        count++;
      }
    }

    q.shift();
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 2 && connectMap[i][j] === 0) {
        connectMap[i][j] = count;
      }
    }
  }

  return connectMap;
}

function rand(min, max) {
  return Math.random() * (max - min) + min

}