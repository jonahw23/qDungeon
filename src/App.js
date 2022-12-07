let emptyEmoji = "󠀠‎"

import { dfs, bfs, sightCheck, boardToBoolean, transparency } from './pathfinding.jsx'
import { makeRandomMap, superimposeBoard } from './mapgen.jsx'
import { spells, classes, createItem, createBuilding, createEnemy, createEquipment, createRandBuilding, createRegularRandMonster, createRandItem, createScaledRandMonster, sortObjects, dropUniqueObj } from './objects.jsx'

export function createGame(floor) {
  let game = {
    board: [],
    class: { name: "none", select: 0 },
    colorMap: [],
    floor: floor,
    colors: {
      background: ["#80776f", "#6e6960", "#70695f", "#6e6662", "#788078", "#84838a"],
      wall: "#000000",
    },
    objects: [],
    objectDict: {}, //updated every turn as a hashMap with keys of "x y" 
    player: {
      x: 7, y: 7, maxHealth: 100, health: 100, maxMana: 100, mana: 100,
      XP: { total: 0, level: 1, nextLevel: 1000, next: 1000 },
      attack: { name: "melee", damage: 5, type: "melee", status: {}, accuracy: 1 },
      status: {},
      immune: {},
      name: "player", char: "🧙‍♂", damage: emptyEmoji, movement: "controlled", wasHit: false, color: "", transparency: 1,
      overlay: { char: emptyEmoji, time: 0 },
      input: "",
      rangedInProgress: { check: false, x: -1, y: -1, obj: {} },
      inShop: { check: false, active: [0, 1], money: 0, },
      inStats: { check: false, active: [0, 1], selected: "" },
      use_item: false, spells: [], extraTurns: 0,
      inventory: [],
      equipment: {
        weapon: {},
        body: {},
      },
      stats: {
        melee: 5,
        ranged: 5,
        defense: 5,
      },
    },
    camera: {
      x: 4, y: 4,
      w: 7, h: 7,
      board: [],
    },
    displayInfo: false,
    displayMap: { check: false, colors: { empty: "d4d4d4", 0: "#FFFFFF", 1: "#000000", 2: "#FF0000", 3: "#880000" }, board: [] },
    displaySpells: { check: false, active: 0 },
    log: {
      length: 30,
      text: [],
    },
    statusMap: {
      poison: "☣️", shock: "⚡", luck: "🍀", strength: "⚔️", shield: "🛡️", boon: "💫", speed: "💨",
    },
  }
  //game.player.rangedInProgress.obj = game.player
  logAction(game, "blank", null, null, null)
  logAction(game, "blank", null, null, null)
  logAction(game, "blank", null, null, null)
  logAction(game, "blank", null, null, null)
  //Fill beginning log with blank strings to fix formatting issue and get text color = black
  game.objects.push(game.player);
  populateStartingBoard(game);
  findStart(game);
  return game;
}

function findStart(game) {
  //Determine the starting position of the player
  let height = game.board.length
  let width = game.board[0].length
  let startX = -1
  let startY = -1
  let i = 0
  while (startY < 0) {
    startY = game.board[i].indexOf(0)
    if (startY > 10 && i < 10) {
      startY = -1;
    }
    i++
  }
  startX = i - 1
  game.player.x = startX
  game.player.y = startY
  game.camera.x = startX - 3
  game.camera.y = startY - 3
}

function populateStartingBoard(game) {
  //Function to fill the board with inital wall config, populate starting items, etc
  for (let i = 0; i < 100; i++) {
    game.board.push([])
    game.displayMap.board.push([])
    for (let j = 0; j < 70; j++) {
      game.board[i].push(0);
      game.displayMap.board[i].push("empty")
      if (j < 3 || j >= 67) {
        game.board[i][j] = 1
      }
      if (i < 3 || i >= 67) {
        game.board[i][j] = 1
      }
      //Create the board and fill with basic walls
    }
  }

  game.board = superimposeBoard(game.board, makeRandomMap(64, 64, 300, 5, 5, 0.5), 3, 3)


  for (let x = 0; x < game.camera.w; x++) {
    game.camera.board.push([])
    for (let y = 0; y < game.camera.h; y++) {
      game.camera.board[x].push({ color: "", object: "" })
    }
  }
  createBackgroundColors(game, game.board.length, game.board[0].length)
  //game.colorMap = [["#660000", "#660066"],["#660066", "#660000"]]

  //spells stuff here
  //game.player.spells = [spells.fireball, spells.heal, spells.sludge, spells.teleport, spells.cure]

  generateObjects(game);

  //function createObject(x, y, health, max, attack, name, char, damage, movement)
}

function generateObjects(game) {
  for (let y = 0; y < game.board.length; y++) {
    for (let x = 0; x < game.board[0].length; x++) {
      if (game.board[y][x] === 0 && Math.random() + (x + y) * 0.001 < 0.2) {
        game.objects.push(createScaledRandMonster(x, y, game))
      }
    }
  }

  let stairs = 0
  let x = 0
  let y = 0
  let i = 0
  //i is used to make sure it doesn't get stuck, rework later to eliminate bad maps
  while (stairs < 3 && i < 1000) {
    y = Math.floor(Math.random() * game.board[0].length * 0.25 + game.board[0].length * 0.5)
    x = Math.floor(Math.random() * game.board.length * 0.25 + game.board.length * 0.5)
    if (game.board[x][y] === 0) {
      game.objects.push(createBuilding("stairs", x, y, null))
      stairs += 1
    }
    i++;
  }

  for (let y = 0; y < game.board.length; y++) {
    for (let x = 0; x < game.board[0].length; x++) {
      if (game.board[y][x] === 0 && Math.random() < 0.025) {//0.025
        game.objects.push(createRandBuilding(x, y))
      }
    }
  }
  for (let y = 0; y < game.board.length; y++) {
    for (let x = 0; x < game.board[0].length; x++) {
      if (game.board[y][x] === 0 && Math.random() < 0.10) {
        game.objects.push(createRandItem(x, y))
      }
    }
  }
}

function createBackgroundColors(game, x, y) {
  for (let i = 0; i < x; i++) {
    game.colorMap.push([])
    for (let j = 0; j < y; j++) {
      game.colorMap[i].push(chooseColor(game))
    }
  }
}

function chooseColor(game) {
  let colors = game.colors.background
  return (colors[Math.floor(Math.random() * colors.length)]);
}

export function createObject(x, y, health, max, attack, name, char, damage, movement) {
  return {
    x: x, y: y,
    health: health, maxHealth: max, //MaxHealth -1 indicates a nonliving object
    attack: attack,
    name: name, //Name as string
    char: char, //Representative moji character as a string
    damage: damage, //String of damage, or blank emoji char if null
    movement: movement, //String of movement type: controlled, auto, none
    wasHit: false,
    status: {},//An array of statuses, where the effect is the emoji and the value is the remaining time
    color: "",//Color and transparency are combined for the visual colorchange
    transparency: 1,
    //effect: null, if an item, it takes a function as effect
    //uses: 0, if an item has a set number of uses
    overlay: { char: "󠀠‎", time: 0 },//emoji characters overlayed on object for effects
    immune: {},
    building: false,
    XP: max * attack.damage * 5,
    stats: {
      melee: 5,
      ranged: 5,
      defense: 5,
    },
    //freeAction: false,//If an item, is using it free
  }
}

/**
*Creates a dictionary where the keys are the coordinates of the objects
*
*This allows O(1) lookup for findObj calls before objects move
*
*Prioritizes the first object it finds, which may be an issue later
*/
function createObjectDict(game) {
  game.objectDict = {}
  for (let i = 0; i < game.objects.length; i++) {
    let obj = game.objects[i]

    obj.damage = emptyEmoji

    if (!game.objectDict[obj.x + " " + obj.y]) {
      game.objectDict[obj.x + " " + obj.y] = obj
    }
  }
}
/*
* Searches through all objects and finds the first one at the given coordinates
*
* returns the object at inputted coordiates or a blank object if none exists
*
* @params x,y - coordinates to find object ats
*/
export function findObj(game, x, y) {

  if (game.objects.some(item => item.x === x)) {
    if (game.objects.filter(item => item.x === x).some(item => item.y === y)) {
      return game.objects.filter(item => item.x === x).filter(item => item.y === y)[0];
    }
  }
  return { name: "", char: emptyEmoji, health: -1, maxHealth: -1, status: {}, damage: emptyEmoji, x: x, y: y, overlay: { char: emptyEmoji, time: 0 } }; //returns object of blank emoji chars if no object is located there
}
/**
*O(1) call time for findObj, but needs to be manually updated
*useful for findObj calls from the player, where we need to call it a bunch without moving anything (spells and ranged attacks)
*
* returns the object at inputted coordiates or a blank object if none exists
*
* @params x,y - coordinates to find object at
*/
export function findObjInDict(game, x, y) {
  if (game.objectDict[x + " " + y]) {
    return game.objectDict[x + " " + y]
  } else {
    return { name: "", x: x, y: y, char: emptyEmoji, health: -1, maxHealth: -1, status: {}, damage: emptyEmoji }; //returns object of blank emoji chars if no object is located there
  }
}

function createWall(game, startx, endx, starty, endy) {
  for (let x = startx; x <= endx; x++) {
    for (let y = starty; y <= endy; y++) {
      game.board[x][y] = 1;
    }
  }
}

function useItem(game, player, inv_num) {
  let p = player;
  let free = !(p.inventory[inv_num].freeAction)
  if (p.inventory[inv_num]) {
    if (p.inventory[inv_num].food) {
      logAction(game, "eatItem", p, null, { item: p.inventory[inv_num].name })
    }
    else if (p.inventory[inv_num].equipment) {
      logAction(game, "cantUseEquip", p, null, { item: p.inventory[inv_num].name })
      free = true;
    }
    else {
      logAction(game, "useItem", p, null, { item: p.inventory[inv_num].name })
    }
    p.inventory[inv_num].effect(p, game)
    p.inventory[inv_num].uses -= 1;
    if (p.inventory[inv_num].uses <= 0) {
      p.inventory.splice(inv_num, 1);
    }
    p.use_item = false;
    return free;
  }
  else {
    logAction(game, "itemDNE", null, null, null)
    return false;
  }
}

function useSpell(game, player, spell) {
  let p = player;
  if (p.mana < spell.mana ? spell.mana : 0) {
    logAction(game, "outOfMana", p, null, { spell: spell.name })
    return false
  }
  logAction(game, "useSpell", p, null, { spell: spell.name })


  spell.effect(p, game) //book
  let free = !(spell.freeAction) //book
  return free;
}

export function update(game) {
  let p = game.player
  let c = game.camera

  if (p.health <= 0) {
    //if the player is dead, you can't do stuff
    p.input = null;
  }

  game.objects.sort(sortObjects)

  function selectClass(game, playerclass) {
    game.class.class = playerclass
    let p = game.player
    p.char = playerclass.char
    p.spells = playerclass.spells
    p.stats = playerclass.stats.base
    p.maxHealth = playerclass.health
    p.health = playerclass.health
    p.maxMana = playerclass.mana
    p.mana = playerclass.mana
    p.inShop.money = playerclass.money + Math.floor(Math.random() * 5)
  }

  //moved determined if the action did anything
  //we don't want enemies acting if the player acidentally tried to move into a wall
  let moved = false;
  let attacked = false;
  let quick = false;
  //move/update player

  if (game.class.name === "none") {
    //On class select screen
    if (p.input === "left") {
      game.class.select += game.class.select > 0 ? -1 : classes.length - 1
    }
    if (p.input === "right") {
      game.class.select += game.class.select < classes.length - 1 ? 1 : -(classes.length - 1)
    }
    if (p.input === "select") {
      game.class.name = classes[game.class.select].name
      selectClass(game, classes[game.class.select])
    }
    p.input = null;
  }

  if (p.rangedInProgress.check) {
    let movement = rangedAttackSelect(game, p.rangedInProgress.obj);
    //movement = [out, quick]
    moved = movement[0]
    quick = movement[1]
    p.input = null;
  }
  if (game.displayMap.check || game.displayInfo) {
    p.input = null;
  }
  if (p.input || p.input === 0) {
    if (isFinite(p.input) && p.input !== null) {
      if (game.displaySpells.check) {
        game.displaySpells.check = false;
        console.log(p.input)
        moved = useSpell(game, p, p.spells[p.input])
      }
      p.input = null;
    }
    if (p.input === "pickup") {
      if (findObjInDict(game, p.x, p.y).building) {
        if (findObjInDict(game, p.x, p.y).buildingType === "shop") {
          //move into shop
          p.inShop.check = true;
          p.inShop.shop = findObjInDict(game, p.x, p.y).shop
        }
        if (findObjInDict(game, p.x, p.y).buildingType === "stairs") {
          let newGame = createGame(game.floor + 1)
          newGame.objects.splice(0, 1)
          for (const [key, value] of Object.entries(newGame)) {
            if (key !== "player" && key !== "floor" && key !== "class")
              game[key] = value
          }
          game.objects.unshift(game.player)
          p.x = newGame.player.x
          p.y = newGame.player.y

          game.floor = newGame.floor
          delete newGame["player"]
          p.input = null;
          //breaks game in the same way your savestate thing did
          return game

        }
        p.input = null;
      }
    }
    if (p.inShop.check) {
      if (p.inShop.active[0] === 0) {
        switch (p.input) {
          //Shop movement, size is harcoded for now, rewrite if buy/sell size changes
          case "up":
            if (p.inShop.active[1] > 1) {
              p.inShop.active[1] -= 1
            }
            break;
          case "down":
            if (p.inShop.active[1] < 3) {
              p.inShop.active[1] += 1
            }
            break;
          case "left":
            break;
          case "right":
            p.inShop.active[0] = 1;
            p.inShop.active[1] = 1;
            break;
        }
      }
      else if (p.inShop.active[0] === 1) {
        switch (p.input) {
          //Shop movement, size is harcoded for now, rewrite if buy/sell size changes
          case "up":
            if (p.inShop.active[1] > 4) {
              p.inShop.active[1] -= 4;
            }
            break;
          case "down":
            if (p.inShop.active[1] < 21)
              p.inShop.active[1] += 4;
            break;
          case "left":
            if (p.inShop.active[1] % 4 === 1) {
              p.inShop.active[0] = 0
              p.inShop.active[1] = 2
            }
            p.inShop.active[1] -= 1;
            break;
          case "right":
            p.inShop.active[1] += 1;
            if (p.inShop.active[1] > 24) { p.inShop.active[1] = 1 }
            break;
        }
      }
      if (p.input === "select") {
        if (p.inShop.active[0] === 0) {
          //buy item
          let cost = p.inShop.shop.buy.costs[p.inShop.active[1] - 1]
          if (cost <= p.inShop.money && (!p.inShop.shop.buy.stock || p.inShop.shop.buy.stock && p.inShop.shop.buy.stock[p.inShop.active[1] - 1] && p.inShop.shop.buy.stock[p.inShop.active[1] - 1] > 0 || p.inShop.shop.buy.stock[p.inShop.active[1] - 1] === -1)) {
            p.inShop.money -= cost
            if (p.inShop.shop.buy.stock && p.inShop.shop.buy.stock[p.inShop.active[1] - 1] && p.inShop.shop.buy.stock[p.inShop.active[1] - 1] > 0) {
              p.inShop.shop.buy.stock[p.inShop.active[1] - 1] -= 1
            }
            //Scaling prices, not currently implemented
            //p.inShop.shop.buy.costs[p.inShop.active[1] - 1] += Math.ceil(p.inShop.shop.buy.costs[p.inShop.active[1] - 1] * 0.3)
            p.inventory.push(p.inShop.shop.buy.items[p.inShop.active[1] - 1])
          }
        }
        else if (p.inShop.active[0] === 1) {
          //sell item
          if (p.inventory.length >= p.inShop.active[1]) {
            let item = p.inventory[p.inShop.active[1] - 1]
            if (!(item.name in p.inShop.shop.sell)) {
              p.inShop.shop.sell[item.name] = Math.round(item.sell.price + (Math.random() - 0.5) * 2 * item.sell.variation)
            }
            for (let n = 0; n < p.inShop.shop.buy.items.length; n++) {
              //Add to stock if the store carries it
              if (item.name === p.inShop.shop.buy.items[n].name) {
                p.inShop.shop.buy.stock[n] += 1
              }
            }
            p.inShop.money += p.inShop.shop.sell[item.name]
            p.inventory.splice(p.inShop.active[1] - 1, 1)
          }
        }
      }
      p.input = null;
    }
    if (p.inStats.check) {
      if (p.inStats.active[0] === 0) {
        switch (p.input) {
          //Shop movement, size is harcoded for now, rewrite if buy/sell size changes
          case "up":
            if (p.inStats.active[1] > 1) {
              p.inStats.active[1] -= 1
            }
            break;
          case "down":
            if (p.inStats.active[1] < 3) {
              p.inStats.active[1] += 1
            }
            break;
          case "left":
            break;
          case "right":
            p.inStats.active[0] = 1;
            p.inStats.active[1] = 1;
            break;
          case "stats":
            p.inStats.check = false;
            p.inStats.active[0] = 0;
            p.inStats.active[1] = 1;
            break;
        }
      }
      else if (p.inStats.active[0] === 1) {
        switch (p.input) {
          //Stat screen movement, size is harcoded for now, rewrite if buy/sell size changes
          case "up":
            if (p.inStats.active[1] > 4) {
              p.inStats.active[1] -= 4;
            }
            break;
          case "down":
            if (p.inStats.active[1] < 21)
              p.inStats.active[1] += 4;
            break;
          case "left":
            if (p.inStats.active[1] % 4 === 1) {
              p.inStats.active[0] = 0
              p.inStats.active[1] = 2
            }
            p.inStats.active[1] -= 1;
            break;
          case "right":
            p.inStats.active[1] += 1;
            if (p.inStats.active[1] > 24) { p.inStats.active[1] = 1 }
            break
          case "stats":
            p.inStats.check = false;
            p.inStats.active[0] = 0;
            p.inStats.active[1] = 1;
            break;
        }
      }
      if (p.input === "select") {
        if (p.inStats.active[0] === 0) {
          //unequip item
          let s = p.inStats.active[1] - 1
          if (s > 0) {
            let type = s === 1 ? "body" : "weapon"
            if (p.inventory.length < 24) {
              p.inventory.push(p.equipment[type])
              p.equipment[type] = {}
            }
          }
        }
        else if (p.inStats.active[0] === 1) {
          //equip item
          let s = p.inStats.active[1] - 1
          if (p.inventory[s]) {
            if (p.inventory[s].equipment) {
              let tempEquip = p.equipment[p.inventory[s].equipment.type]
              p.equipment[p.inventory[s].equipment.type] = p.inventory[s]
              if (tempEquip.health) {
                p.inventory.splice(s, 1, tempEquip);
              } else {
                p.inventory.splice(s, 1);
              }
            }
            else {
              p.inStats.check = false;
              moved = useItem(game, p, s)
              p.input = null
            }
          }
        }
      }
      p.input = null;
    }
    else if (game.displaySpells.check) {
      switch (p.input) {
        case "up":
          if (game.displaySpells.active > 0) {
            game.displaySpells.active -= 1;
          }
          else {
            game.displaySpells.active = p.spells.length - 1;
          }
          break;
        case "down":
          if (game.displaySpells.active < p.spells.length - 1) {
            game.displaySpells.active += 1;
          }
          else {
            game.displaySpells.active = 0;
          }
          break;
        case "spell":
          game.displaySpells.check = false;
          break;
      }
      p.input = null;
    }
    else {
      if (p.status["⚡"]) {
        if (p.input === "up" || p.input === "down" || p.input === "left" || p.input === "right") {
          p.input = "wait"
        }
      }
      let move = [p.x, p.y]
      switch (p.input) {
        case "up":
          move[1] -= 1
          break;
        case "down":
          move[1] += 1
          break;
        case "left":
          move[0] -= 1
          break;
        case "right":
          move[0] += 1
          break;
        case "wait":
          moved = true
          break;
        case "pickup":
          moved = pickup(p, game)
          break;
        case "spell":
          game.displaySpells.check = !(game.displaySpells.check);
          break;
        case "stats":
          game.player.inStats.check = !(game.player.inStats.check);
          break;
      }
      if (moved) {
        p.use_item = false;
      }
      p.input = ""

      createObjectDict(game)

      if (findObjInDict(game, move[0], move[1]).maxHealth < 0) {
        if (game.board[move[0]][move[1]] === 0) {
          p.x = move[0]
          p.y = move[1]
          c.x = p.x - Math.floor(c.w / 2)
          c.y = p.y - Math.floor(c.h / 2)

          //bounds camera so no errors
          c.x = Math.min(c.x, game.board.length - c.w)
          c.y = Math.min(c.y, game.board[0].length - c.h)
          c.x = Math.max(c.x, 0)
          c.y = Math.max(c.y, 0)

          moved = true;
        }
      }
      else {
        //do something if another living object is in the square we're trying to move into, currently that thing is auto-attacking
        attacked = hit(game, p, findObjInDict(game, move[0], move[1]), { attackName: p.attack.name })
      }
    }
  }

  if (moved || attacked) {
    p.damage = emptyEmoji
    let o = game.objects
    for (let i = 0; i < o.length; i++) {
      if (o[i] !== p) {
        if (!o[i].wasHit) {
          //if someone wasn't hit this step, their damage resets to empty
          o[i].damage = emptyEmoji;
        }
        if (o[i].health <= 0 && o[i].maxHealth > 0) {
          //Kill the object if it was living and below 0 hp
          //console.log("Killed", o[i].name)
          logAction(game, "death", o[i])
          if (Math.random() < 0.01) {
            //Rare chance of a unique drop
            dropUniqueObj(game, o[i].x, o[i].y)
          }
          //Player gets XP
          p.XP.total += o[i].XP
          while (p.XP.total >= p.XP.nextLevel) {
            //If levelup, player levels up (health + damage increase)
            let healthplus = p.XP.level * 10
            p.stats.melee += game.class.class.stats.growth.melee
            p.stats.ranged += game.class.class.stats.growth.ranged
            p.stats.defense += game.class.class.stats.growth.defense
            p.XP.level += 1;
            p.maxHealth += healthplus
            p.health += healthplus
            logAction(game, "levelup", p, null, { level: p.XP.level })
            p.XP.next = p.XP.nextLevel * 2
            p.XP.nextLevel = p.XP.nextLevel * 3
          }
          drops(game, o[i])
          console.log("xp death")
          game.objects.splice(i, 1);
          i -= 1;

        }
        else if (!("⚡" in o[i].status) && !("💨" in p.status) && !(quick)) {
          //if the object auto-moves, find a route
          if (o[i].movement === "auto" || o[i].movement === "stationary" || o[i].movement === "passive" || o[i].movement === "ranged") {
            let map = boardToBoolean(game.board)

            //enemy becomes activated upon seeing player
            //As long as enemy sees the play, it will go towards it
            //If the enemy loses sight of the player, it will go to the last location it saw the player
            if (sightCheck(o[i].x, o[i].y, p.x, p.y, map)) {
              o[i].target = { x: p.x, y: p.y }
            }

            if (o[i].target && o[i].target.x === p.x && o[i].target.y === p.y && o[i].x >= game.camera.x && o[i].x <= game.camera.x + game.camera.w && o[i].y >= game.camera.y && o[i].y <= game.camera.y + game.camera.h && o[i].rangedCooldown === 0) {
              //logAction(game, "useSpell", o[i], null, { spell: o[i].attack.spell.name })
              o[i].attack.spell.host = o[i]
              hit(game, o[i].attack.spell, p, { ranged: true, attacker: o[i], attackName: o[i].attack.spell.name, noHit: o[i].attack.spell.noHit })
              o[i].rangedCooldown = o[i].rangeChargeTime

            }
            else if (o[i].target) {
              //dfs *should* always  work, but just in case, run BFS if it fails
              let action = dfs(o[i].x, o[i].y, o[i].target.x, o[i].target.y, map);
              if (!action[0]) {

                action = bfs(o[i].x, o[i].y, o[i].target.x, o[i].target.y, map);
              }

              //if pathfinding was sucessful and not on top of target
              if (action[0] && action[1].length > 1) {
                let path = action[1]
                //if trying to move into player space, attack instead              
                //console.log(o[i].name, path)
                if (o[i].target && o[i].target.x === p.x && o[i].target.y === p.y && o[i].x >= game.camera.x && o[i].x <= game.camera.x + game.camera.w && o[i].y >= game.camera.y && o[i].y <= game.camera.y + game.camera.h && o[i].rangedCooldown > 0) {
                  o[i].rangedCooldown -= 1
                }

                //add ranged 
                if (path[1][0] === p.x && path[1][1] === p.y) {
                  if ((o[i].movement !== "passive" || o[i].wasHit) && o[i].movement !== "ranged") {
                    //nonpassive objects with non-none movement, or passive objects that were attacked will attack back
                    if (p.damage === emptyEmoji) {
                      p.damage = 0;
                    }
                    hit(game, o[i], p, { attackName: o[i].attack.name })
                  }
                }

                //simple check for if attempted movement square is empty. Currently monster AI won't move into a position to attack the player if the optimal square is full, probably should be reworked. Also doesn't move if object is stationary (different from movement type = "none")
                else if (
                  game.board[path[1][0]][path[1][1]] === 0 && findObj(game, path[1][0], path[1][1]).maxHealth < 0 && o[i].movement !== "stationary" && o[i].movement !== "passive") {
                  //console.log(path[0])
                  o[i].x = path[1][0]
                  o[i].y = path[1][1]
                } //end else if
                else if (o[i].movement !== "stationary" && o[i].movement !== "passive") { //if first choice of movement fails, but movement still wanted, do this instead
                  for (let i = 2; i < path.length; i++) {
                    let d1 = [path[1][0] - o[i].x, path[1][1] - o[i].y]
                    let d2 = [path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]]
                    if (!(d1[0] === d2[0] && d1[1] === d2[1])) {
                      let p = [o[i].x + d2[0], o[i].y + d2[1]]
                      if (game.board[p[0]][p[1]] === 0 && findObj(game, p[0], p[1]).maxHealth < 0) {
                        console.log(o[i], p)
                        o[i].x = p[0]
                        o[i].y = p[1]
                        break
                      }
                    }
                  }
                }//end second else if
              } //end pathfinding check 
            } // end target check
          } //end movement type check
        } //end death check
      } //end o[i] != p

      if ("buildingEffect" in o[i]) {
        if (o[i].justCreated > 0) {
          o[i].justCreated -= 1
        }
        else {
          //If the building does something and wasn't just created, do the thing
          o[i].buildingEffect(game, game.player, i)
        }
      }
      if ("ability" in o[i]) {
        o[i].ability(game)
      }

      for (const [key, value] of Object.entries(o[i].status)) {
        console.log("key: " + key)
        switch (key) {
          case "☣️":
            let poisonDamage = 3
            o[i].health -= poisonDamage
            if (o[i].damage === emptyEmoji) {
              o[i].damage = 0;
            }
            o[i].damage -= poisonDamage
            o[i].status[key] -= 1

            logAction(game, "poison", o[i], null, { lifeLoss: poisonDamage })
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { name: "poison" });
              delete (o[i].status[key]);
            }
            break;
          case "⚡":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { name: "shock" });
              delete (o[i].status[key]);
            }
            break;
          case "🍀":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { positive: true, name: "luck" });
              delete (o[i].status[key]);
            }
            break;
          case "🛡️":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { positive: true, name: "shield" });
              delete (o[i].status[key]);
            }
            break;
          case "⚔️":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { positive: true, name: "strength" });
              delete (o[i].status[key]);
            }
            break;
          case "💫":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { positive: true, name: "boon" });
              delete (o[i].status[key]);
            }
            break;
          case "💨":
            o[i].status[key] -= 1;
            if (o[i].status[key] <= 0) {
              logAction(game, "effectOff", o[i], null, { positive: true, name: "speed" });
              delete (o[i].status[key]);
            }
            break;
        }
        if (o[i].health <= 0 && o[i] !== p) {
          logAction(game, "death", o[i])
          console.log("non xp death")
          game.objects.splice(i, 1);
          i -= 1;
        }
      } //end status loop
      o[i].wasHit = false; //wasHit not needed any more, clear
    } //end object for loop
  } //end moved/attack check


  //move/update objects

  //resolve everything and get output matrix to draw

  for (let x = 0; x < c.w; x++) {
    for (let y = 0; y < c.h; y++) {

      if (x + c.x == p.x && y + c.y == p.y) {
        game.displayMap.board[x + c.x][y + c.y] = 2
      }
      else if (c.board[x][y].visible && game.board[x + c.x][y + c.y] === 0) {
        game.displayMap.board[x + c.x][y + c.y] = 0
      } else if (game.board[x + c.x][y + c.y] !== 0) {
        game.displayMap.board[x + c.x][y + c.y] = 1
      }

      if (game.board[x + c.x][y + c.y] === 0) {
        c.board[x][y].color = game.colorMap[(x + c.x) % game.colorMap.length][(y + c.y) % game.colorMap[(x + c.x) % game.colorMap.length].length]
      } else {
        c.board[x][y].color = game.colors.wall
      }
      c.board[x][y].visible = sightCheck(x + c.x, y + c.y, p.x, p.y, boardToBoolean(game.board))
      if (c.board[x][y].visible) {
        c.board[x][y].object = findObj(game, x + c.x, y + c.y)

        //fire good

        if (p.rangedInProgress.check && x + c.x === p.rangedInProgress.x && y + c.y === p.rangedInProgress.y) {
          //If we're in ranged select and the selected square is it, display the overlay
          c.board[x][y].object.overlay.char = "❌";
        }
        else if (c.board[x][y].object.overlay.char === "❌") {
          //Otherwise, the object's overlay gets cleared
          c.board[x][y].object.overlay.char = emptyEmoji;
          c.board[x][y].object.overlay.time = 0;
        }
        else if (c.board[x][y].object.overlay.time <= 0) {
          c.board[x][y].object.overlay.char = emptyEmoji;
          c.board[x][y].object.overlay.time = 0;
          c.board[x][y].object.overlay.color = "";
          c.board[x][y].object.overlay.transparency = "";
        }
        else {
          c.board[x][y].object.overlay.time -= 1;
        }
      }
      else {
        c.board[x][y].object = { name: "", char: emptyEmoji, status: {}, damage: emptyEmoji, health: -1, overlay: { char: emptyEmoji } };
      }
      if (!c.board[x][y].visible) {
        c.board[x][y].color = transparency(c.board[x][y].color, "#000000", 0.5)
      }
    }
  }
}

export function rangedAttackSelect(game, object) {

  let out = false;
  let p = game.player;
  let c = game.camera;
  let x = p.rangedInProgress.x
  let y = p.rangedInProgress.y
  if (p.rangedInProgress.x < 0 || p.rangedInProgress.y < 0) {
    x = p.x
    y = p.y
  }
  if (p.input) {
    if (p.input === "up" || p.input === "down" || p.input === "left" || p.input === "right") {

      let next = findNextAimSpot(game, x - c.x, y - c.y, p.input)
      if (next) {
        x += next[0]
        y += next[1]
      }
    } else if (p.input === "wait") {
      p.rangedInProgress.check = false;
      x = -1
      y = -1
    } else if (p.input === "spell") {
      out = true;

      if (object.name === "teleport") {
        if (findObj(game, x, y).health > 0 || findObj(game, x, y).building) {
          p.rangedInProgress.check = false;
          p.rangedInProgress.obj = {};
          p.rangedInProgress.x = -1
          p.rangedInProgress.y = -1
          return false
        }
      }

      if (object.name === "summon rock") {
        if (findObj(game, x, y).health > 0 || findObj(game, x, y).building) {
          p.rangedInProgress.check = false;
          p.rangedInProgress.obj = {};
          p.rangedInProgress.x = -1
          p.rangedInProgress.y = -1
          return false
        }
      }

      if (object.mana) {
        p.mana -= object.mana
        logAction(game, "useMana", p, null, { amount: object.mana })
      }


      if (object.attack) {
        hit(game, object, findObj(game, x, y), { ranged: true, attacker: p, attackName: object.name, noHit: object.noHit })
      } else {

      }
      p.rangedInProgress.check = false;
      p.rangedInProgress.obj = {};
      x = -1
      y = -1
    }

  }

  p.rangedInProgress.x = x
  p.rangedInProgress.y = y

  return [out, object.attack.noTurn]
}

function drops(game, object) {
  let money = Math.floor(Math.random() * object.drops.maxMoney)
  for (let i = 0; i < object.drops.guaranteed.length; i++) {
    game.objects.push(createItem(object.drops.guaranteed[i], object.x, object.y, null))
  }
  let dropped = 0;
  for (const [key, value] of Object.entries(object.drops.random)) {
    if (Math.random() < value && dropped < object.drops.randNum) {
      game.objects.push(createItem(key, object.x, object.y, null))
      dropped += 1;
    }
  }
  if (money > 0) {
    if ("🍀" in game.player.status) {
      money += Math.floor(Math.random() * 5 * game.player.XP.level)
    }
    game.objects.push(createItem("money", object.x, object.y, { amount: money }))
  }
}

function findNextAimSpot(game, x, y, input) {
  let c = game.camera
  let x1 = 0
  let y1 = 0
  let found = false

  while (!found) {
    switch (input) {
      case "up":
        y1 -= 1
        break;
      case "down":
        y1 += 1
        break;
      case "left":
        x1 -= 1
        break;
      case "right":
        x1 += 1
        break;
    }
    if (!(withinArr(x + x1, c.board.length) && withinArr(y + y1, c.board[0].length))) {
      return false
    }
    if (withinArr(x + x1, c.board.length) && withinArr(y + y1, c.board[0].length) && c.board[x + x1][y + y1] && c.board[x + x1][y + y1].visible) {
      return [x1, y1]
    } else {
      let dx = Math.abs(x1) < Math.abs(y1) ? 1 : 0
      let dy = Math.abs(y1) < Math.abs(x1) ? 1 : 0

      for (let i = -1; i <= 1; i += 2) {
        if (withinArr(x + x1 + dx * i, c.board.length) && withinArr(y + y1 + dy * i, c.board[0].length) && c.board[x + x1 + dx * i][y + y1 + dy * i] && c.board[x + x1 + dx * i][y + y1 + dy * i].visible) {
          return [x1 + dx * i, y1 + dy * i]
        }
      }
    }
  }

}

export function charInArr(array, num) {
  if (array[num]) {
    return array[num].char
  }
  return emptyEmoji
}

export function colorInArr(array, num) {
  if (array[num]) {
    return array[num].color
  }
  return "#000000"
}
export function transparencyInArr(array, num) {
  if (array[num]) {
    return array[num].transparency
  }
  return 0
}

export function objOverlay(overlay) {
  if (overlay.char) {
    return overlay.char;
  }
  return emptyEmoji;
}
export function objOverlayColor(overlay) {

  if (overlay.color) {

    return overlay.color;
  }
  return "rgba(0,0,0,0)";
}
export function objOverlayTransparency(overlay) {
  if (overlay.transparency) {
    return overlay.transparency;
  }
  return 0.8;
}

export function printStatus(status) {
  let full = false;
  let output = ""
  for (const [key, value] of Object.entries(status)) {
    if (value > 0) {
      output = output + String(key);
      full = true;
    }
  }
  if (full) {
    return output;
  }
  return emptyEmoji
}

function pickup(player, game) {
  let out = false
  let p = game.player
  let inventory = game.player.inventory
  console.log("inventory", inventory)
  let o = game.objects
  for (let i = 0; i < o.length; i++) {
    if (o[i] !== player && o[i].x == p.x && o[i].y == p.y && o[i].item) {
      if (o[i].amount) {
        //if it's money, add it to money instead of inventory
        p.inShop.money += o[i].amount
        logAction(game, "pickedUp", p, null, { object: o[i] })
        game.objects.splice(i, 1);
        out = true
        i -= 1;
      }
      else {
        if (inventory.length < 24) {
          inventory.push(o[i])
          logAction(game, "pickedUp", p, null, { object: o[i] })
          game.objects.splice(i, 1);
          out = true
          i -= 1;
        }
        else {
          logAction(game, "invFull", p, null, { object: o[i] })
        }
      }
    }
  }
  return out
}

function hit(game, attacker, target, params) {
  if (params.noHit) {
    if (params.attackName === "teleport") {
      attacker.host.x = target.x
      attacker.host.y = target.y
      game.camera.x = target.x - 3
      game.camera.y = target.y - 3
      attacker.host.overlay.char = attacker.overlay.char;
      attacker.host.overlay.time = attacker.overlay.time;
      attacker.host.overlay.transparency = attacker.overlay.transparency;
      attacker.host.overlay.color = attacker.overlay.color;
      logAction(game, "teleport", attacker.host)
    }
    if (params.attackName === "summon rock") {
      game.objects.splice(1, 0, createEnemy("boulder", target.x, target.y));
    }
    return true
  }

  if (attacker === target || (target.name === "" && target !== game.player) || target.maxHealth < 0) {
    return false
  }
  if (target === game.player && "chain" in params) {
    return false
  }
  if (attacker.attack.accuracy < Math.random()) {
    logAction(game, "missed", params.attacker ? params.attacker : attacker, target, { attack: params.attackName })
    return false
  }
  if ("🍀" in target.status && Math.random() < 0.8) {
    logAction(game, "missed", params.attacker ? params.attacker : attacker, target, { attack: params.attackName })
    return false
  }
  let damage = 0
  if (params.ranged) {
    console.log("host", attacker.host.name)
    damage = calcDamage(attacker.host, attacker.attack, target, { ranged: true })
  } else {
    damage = calcDamage(attacker, attacker.attack, target)
  }

  target.health -= damage//attacker.attack.damage;
  if (target.damage === emptyEmoji) {
    target.damage = 0;
  }
  let equipImmunity = {}
  //Check armor and weapon immunity
  if (target.equipment && "equipment" in target.equipment.body && "immunity" in target.equipment.body.equipment) {
    equipImmunity = target.equipment.body.equipment.immunity
  }
  if (target.equipment && "equipment" in target.equipment.weapon && "immunity" in target.equipment.weapon.equipment) {
    for (const [key, value] of Object.entries(target.equipment.weapon.equipment.immunity)) {
      equipImmunity[key] = value;
    }
  }
  //Do status effects
  for (const [key, value] of Object.entries(attacker.attack.status)) {
    if (Math.random() < attacker.attack.status[key].chance && !(key in target.immune) && !(key in equipImmunity)) {
      target.status[game.statusMap[key]] = attacker.attack.status[key].time;
    }
  }
  if ("equipment" in attacker && "equipment" in attacker.equipment.weapon && "status" in attacker.equipment.weapon.equipment) {
    //Do weapon status effects
    for (const [key, value] of Object.entries(attacker.equipment.weapon.equipment.status)) {
      if (Math.random() < attacker.equipment.weapon.equipment.status[key].chance && !(key in target.immune)) {
        target.status[game.statusMap[key]] = attacker.equipment.weapon.equipment.status[key].time;
      }
    }
  }
  //UN-HARDCODE THIS
  if (params.ranged) {
    target.overlay.char = attacker.overlay.char
    target.overlay.time = attacker.overlay.time
    target.overlay.transparency = attacker.overlay.transparency
    target.overlay.color = attacker.overlay.color
    if (params.attackName === "lightning") {
      target.wasHit = true;
      if (!("chain" in params)) { params.chain = "" }
      if (findObj(game, target.x, target.y + 1).maxHealth > 0 && !(findObj(game, target.x, target.y + 1).wasHit)) {
        findObj(game, target.x, target.y + 1).wasHit = true;
        hit(game, attacker, findObj(game, target.x, target.y + 1), { ranged: true, attacker: params.attacker, attackName: params.attackName, noHit: params.noHit, chain: params.chain + "above" })
      }
      if (findObj(game, target.x, target.y - 1).maxHealth > 0 && !(findObj(game, target.x, target.y - 1).wasHit)) {
        findObj(game, target.x, target.y - 1).wasHit = true;
        hit(game, attacker, findObj(game, target.x, target.y - 1), { ranged: true, attacker: params.attacker, attackName: params.attackName, noHit: params.noHit, chain: params.chain + "down" })
      }
      if (findObj(game, target.x + 1, target.y).maxHealth > 0 && !(findObj(game, target.x + 1, target.y).wasHit)) {
        findObj(game, target.x + 1, target.y).wasHit = true;
        hit(game, attacker, findObj(game, target.x + 1, target.y), { ranged: true, attacker: params.attacker, attackName: params.attackName, noHit: params.noHit, chain: params.chain + "left" })
      }
      if (findObj(game, target.x - 1, target.y).maxHealth > 0 && !(findObj(game, target.x - 1, target.y).wasHit)) {
        findObj(game, target.x - 1, target.y).wasHit = true;
        hit(game, attacker, findObj(game, target.x - 1, target.y), { ranged: true, attacker: params.attacker, attackName: params.attackName, noHit: params.noHit, chain: params.chain + "right" })
      }
    }
    logAction(game, "attack", params.attacker, target, { attack: params.attackName, damage: calcDamage(attacker.host, attacker.attack, target, { ranged: true }) })
  } else {
    logAction(game, "attack", attacker, target, { damage: calcDamage(attacker, attacker.attack, target) })
  }

  //although negative is wrong, it makes more sense visually
  target.damage -= damage//attacker.attack.damage;
  target.wasHit = true;

  return true
}

function calcDamage(by, attack, to, params = {}) {
  let defense = getStat(to, "defense")
  if (params.ranged) {
    let ranged = getStat(by, "ranged")
    return Math.ceil(attack.damage * (2 * ranged) / (2 * defense))
  } else {
    let melee = getStat(by, "melee")
    return Math.ceil(attack.damage * (2 * melee) / (2 * defense))
  }
}

export function getStat(obj, stat) {
  if (obj.stats) {
    let s = 0
    if (obj.stats && obj.stats[stat]) {
      s += obj.stats[stat]
    }
    if (obj.equipment) {
      for (const [key, value] of Object.entries(obj.equipment)) {
        if (value.equipment && value.equipment[stat]) {
          s += value.equipment[stat]
        }
      }
      if (stat === "defense" && obj.status["🛡️"]) {
        s += 15
      }
      if (stat === "melee" && obj.status["⚔️"]) {
        s += 5
      }
      if (stat === "ranged" && obj.status["💫"]) {
        s += 5
      }
    }
    return s
  }
  return
}

export function getStatusEmojiName(emoji) {
  switch (emoji) {
    case "☣️":
      return "poison";
    case "⚡":
      return "shock";
  }
  return null;
}

export function objectSummary(obj) {
  if (obj.maxHealth > -1) {
    return obj.name + " " + obj.health + " / " + obj.maxHealth
  }
  else {
    return obj.name
  }
}

export function squareSummary(game, x, y) {
  let n = 0
  let out = ""
  for (let i = 0; i < game.objects.length; i++) {
    let o = game.objects[i]
    if (o.x === x && o.y === y) {
      if (n > 0) {
        out += ", "
      }
      n += 1
      out += objectSummary(o)
    }
  }
  return out
}

export function healthDisplay(obj, game) {
  if (obj === game.player) {
    return emptyEmoji
  }
  if (obj.health > 0) {
    return obj.health;
  }
  else {
    return emptyEmoji
  }
}

//action first to solitary or no-object actions can be easily made
export function logAction(game, action, by = {}, to = {}, params = {}) {
  let text = game.log.text
  //console.log("action: " + action)
  switch (action) {
    case "blank":
      text.push(emptyEmoji);
      break;
    case "attack":
      text.push(by.name + " attacked " + to.name + (params.attack ? " with " + params.attack : "") + (params.damage ? "\n for " + params.damage + " damage" : ""))
      break;
    case "missed":
      text.push(by.name + " missed " + to.name + (params.attack ? " with " + params.attack : ""))
      break;
    case "levelup":
      text.push(by.name + " leveled up to level " + params.level + "!")
      break;
    case "death":
      if (by.movement === "passive" || by.movement === "none") {
        //objects that don't have movement type are destroyed rather than killed
        text.push(by.name + " destroyed")
      }
      else { text.push(by.name + " died") }
      break;
    case "poison":
      text.push(by.name + " took " + (params.lifeLoss) + " damage from poison")
      break;
    case "effectOff":
      if (params.positive) {
        text.push(params.name + " wore off " + by.name);
        break;
      }
      text.push(by.name + " recovered from " + params.name);
      break;
    case "pickedUp":
      text.push(by.name + " picked up " + params.object.name);
      break;
    case "invFull":
      text.push("Inventory is full, can't pick up more items")
      break;
    case "usePrompt":
      text.push("Choose the number of the item you wish to use")
      break;
    case "cantUseEquip":
      text.push(params.item + " is an equipment, press E to equip it")
      break;
    case "useItem":
      text.push(by.name + " used " + params.item)
      break;
    case "eatItem":
      text.push(by.name + " ate " + params.item)
      break;
    case "useSpell":
      text.push(by.name + " used " + params.spell)
      break;
    case "itemDNE":
      text.push("No item with that number, input another item number or take another action")
      break;
    case "startAim":
      text.push("Now aiming. Fire with fire button or pass a turn to stop")
      break;
    case "outOfMana":
      text.push("Not enough mana to use " + params.spell)
      break
    case "useMana":
      text.push(by.name + " used " + params.amount + " mana")
      break;
    case "teleport":
      text.push(by.name + " teleported")
      break;
    case "new spell":
      text.push(by.name + " learned " + params.spell)
      break;
    case "already learned":
      text.push(by.name + " read " + params.name + " but didn't learn anything new")
      break;
  }
  if (text.length > game.log.length) {
    game.log.text.shift()
  }
}

export function outputLog(game, i = 0) {
  if (i < game.log.text.length) {
    return <div><p
    /*
style={{ opacity: ((i + 1) / (game.log.text.length + 1))}}
*/
    >{game.log.text[i]}</p> {outputLog(game, i + 1)}</div>
  }
}

export function switchInfo(game) {
  game.displayInfo = !(game.displayInfo)
  return
}

function withinArr(a, len) {
  return a >= 0 && a < len
}
