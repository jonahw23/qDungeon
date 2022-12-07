import { createObject, logAction, rangedAttackSelect, getStatusEmojiName, findObj } from './App.jsx'

let emptyEmoji = "󠀠‎"

//sorts objects so that enemies are on top, then shops, then items
export function sortObjects(a, b) {
  if (a.maxHealth > 0) {
    if (b.maxHealth > 0) {
      return 0
    }
    return -1
  } else if (b.maxHealth > 0) {
    return 1
  } else if (a.shop) {
    if (b.shop) {
      return 0
    }
    return -1
  } else if (b.shop) {
    return 1
  } else {
    return 0
  }
}

export function createEquipment(name, x, y, params) {
  let equipment = {}
  switch (name) {
    case ("wooden sword"):
      equipment = createObject(x, y, -1, -1, {}, "Wooden Sword", "⚔️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#963C00"
      equipment.item = true;
      equipment.sell = { price: 8, variation: 2 }
      equipment.equipment = { type: "weapon", melee: 1 + Math.round(rand(0, 0.3)*10)/10, ranged:0, defense:0 }
      return equipment
      break;
    case ("bronze sword"):
      equipment = createObject(x, y, -1, -1, {}, "Bronze Sword", "⚔️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#CD7F32"
      equipment.item = true;
      equipment.sell = { price: 10, variation: 2 }
      equipment.equipment = { type: "weapon", melee: 1.5 + Math.round(rand(-0.3, 0.3)*10)/10, ranged:0, defense:0 }
      return equipment
      break;
    case ("iron sword"):
      equipment = createObject(x, y, -1, -1, {}, "Iron Sword", "⚔️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#A4A4A4"
      equipment.item = true;
      equipment.sell = { price: 10, variation: 2 }
      equipment.equipment = { type: "weapon", melee: 2 + Math.round(rand(-0.5, 0.5)*10)/10, ranged:0, defense:0 }
      return equipment
      break;
    case ("poison dagger"):
      equipment = createObject(x, y, -1, -1, {}, "Poison Dagger", "🗡️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#2b8040"
      equipment.item = true;
      equipment.sell = { price: 16, variation: 2 }
      equipment.equipment = { type: "weapon", melee: 1, ranged:0, defense:0, status:{poison: { chance: 0.5, time: 5 }} }
      return equipment
      break;
      case ("robe of peace"):
      equipment = createObject(x, y, -1, -1, {}, "Robe of Peace", "👘", emptyEmoji, "none")
      equipment.transparency = 0.15
      equipment.color = "#878787"
      equipment.item = true;
      equipment.sell = { price: 18, variation: 3 }
      equipment.equipment = { type: "body", melee: -5, ranged:-3, defense:25 }
      return equipment
      break;
      case ("shawl of rage"):
      equipment = createObject(x, y, -1, -1, {}, "Shawl of Rage", "🥻", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#bf1111"
      equipment.item = true;
      equipment.sell = { price: 16, variation: 8 }
      equipment.equipment = { type: "body", melee: 3, ranged:-2, defense:1 }
      return equipment
      break;
      case ("iron axe"):
      equipment = createObject(x, y, -1, -1, {}, "Iron Axe", "🪓", emptyEmoji, "none")
      equipment.transparency = 0.1
      equipment.color = "#5c5c5c"
      equipment.item = true;
      equipment.sell = { price: 10, variation: 1 }
      equipment.equipment = { type: "weapon", melee: 2 + Math.round(rand(-0.3, 1)*10)/10, ranged:0, defense:-2 + Math.round(rand(-1,1)*10)/10 }
      return equipment
      break;
      case ("golden bow"):
      equipment = createObject(x, y, -1, -1, {}, "Golden Bow", "🏹", emptyEmoji, "none")
      equipment.transparency = 0.1
      equipment.color = "#ffc70f"
      equipment.item = true;
      equipment.sell = { price: 20, variation: 4 }
      equipment.equipment = { type: "weapon", melee: 0, ranged:4 + Math.round(rand(-1,1)*10)/10, defense:0 }
      return equipment
      break;
      case ("dark shield"):
      equipment = createObject(x, y, -1, -1, {}, "Dark Shield", "🛡️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#321b52"
      equipment.item = true;
      equipment.sell = { price: 14, variation: 5 }
      equipment.equipment = { type: "weapon", melee: 1.5 + Math.round(rand(-1,0.5)*10)/10, ranged:0, defense:5+Math.round(rand(0,2)*10)/10, immunity:{poison:1} }
      return equipment
      case ("iron shield"):
      equipment = createObject(x, y, -1, -1, {}, "Iron Shield", "🛡️", emptyEmoji, "none")
      equipment.transparency = 0.3
      equipment.color = "#747575"
      equipment.item = true;
      equipment.sell = { price: 12, variation: 5 }
      equipment.equipment = { type: "weapon", melee: 0, ranged:0, defense:8+Math.round(rand(0,2)*10)/10 }
      return equipment
      break;
      case ("amethyst wand"):
      equipment = createObject(x, y, -1, -1, {}, "Amethyst Wand", "🪄", emptyEmoji, "none")
      equipment.transparency = 0.05
      equipment.color = "#8b59f7"
      equipment.item = true;
      equipment.sell = { price: 12, variation: 4 }
      equipment.equipment = { type: "weapon", melee: 0, ranged:2 + Math.round(rand(0,2)*10)/10, defense:0 + Math.round(rand(-2,0)*10)/10 }
      return equipment
      break;
      case ("leather armor"):
      equipment = createObject(x, y, -1, -1, {}, "Leather Armor", "👚", emptyEmoji, "none")
      equipment.transparency = 0.05
      equipment.color = "#963C00"
      equipment.item = true;
      equipment.sell = { price: 8, variation: 3 }
      equipment.equipment = { type: "body", melee: 0, ranged:0, defense:1 + Math.round(rand(0,2)*10)/10}
      return equipment
      break;
    case ("steel armor"):
      equipment = createObject(x, y, -1, -1, {}, "Steel Armor", "👚", emptyEmoji, "none")
      equipment.transparency = 0.05
      equipment.color = "#949494"
      equipment.item = true;
      equipment.sell = { price: 22, variation: 5 }
      equipment.equipment = { type: "body", melee: 0, ranged:0, defense:6 + Math.round(rand(-2,3)*10)/10}
      return equipment
      break;
      case ("magic robe"):
      equipment = createObject(x, y, -1, -1, {}, "Magic Robe", "👘", emptyEmoji, "none")
      equipment.transparency = 0.05
      equipment.color = "#AA33BB"
      equipment.item = true;
      equipment.sell = { price: 15, variation: 3 }
      equipment.equipment = { type: "body", melee: 0, ranged: + Math.round(rand(1,2)*10)/10, defense:3 + Math.round(rand(-1,1)*10)/10}
      return equipment
      break;
      
  }
}

let shopEquipment = [
  "wooden sword",
  "bronze sword",
  "iron sword",
  "iron axe",
  "iron shield",
  "leather armor",
  "steel armor",
  "magic robe",
  "golden bow",
  "amethyst wand",
  "dark shield"
]

function chooseEquipment(num){
  //Choose num random equipment from shopEquipment and return them in an array
  let arr = []
  console.log(shopEquipment)
  for(let i = 0; i < num; i++){
    let add = shopEquipment[Math.floor(Math.random()*shopEquipment.length)]
    while(arr.includes(add)){
      add = shopEquipment[Math.floor(Math.random()*shopEquipment.length)]
    }
    arr.push(add)
  }
  for(let i = 0; i < num; i++){
    arr[i] = createEquipment(arr[i], 0, 0, null)
  }
  let costs = []
  for(let i = 0; i < num; i++){
    costs[i] = arr[i].sell.price + 10
  }
  let stock = []
  for(let i = 0; i < num; i++){
    stock[i] = 1
  }
  return {items:arr, costs:costs, stock:stock}
}

export function createBuilding(name, x, y, params) {
  params = params ? params : {}
  let building = {}
  switch (name) {
    case "trade hut":
      building = createObject(x, y, -1, -1, { damage: 0 }, "Trade Hut", "🛖", emptyEmoji, "none")
      building.building = true;
      building.shop = { sell: {}, buy: { items: [createItem("potion of healing", 0, 0, null), createItem("potion of cure effects", 0, 0, null), createItem("potion of mana", 0, 0, null)], costs: [10, 5, 15], stock:[5,7,3] } };
      building.buildingType = "shop";
      break;
    case "potion hut":
      building = createObject(x, y, -1, -1, { damage: 0 }, "Trade Hut", "🛖", emptyEmoji, "none")
      building.building = true;
      building.shop = { sell: {}, buy: { items: [createItem("potion of strength", 0, 0, null), createItem("potion of magic", 0, 0, null), createItem("potion of defense", 0, 0, null)], costs: [10, 8, 6],stock:[4,4,4]  } };
      building.color = "#74009e"
      building.transparency = 0.7
      building.buildingType = "shop";
      break;
    case "spell hut":
      building = createObject(x, y, -1, -1, { damage: 0 }, "Trade Hut", "🛖", emptyEmoji, "none")
      building.building = true;
      building.shop = { sell: {}, buy: { items: [createItem("summon rock spellbook", 0, 0, null), createItem("chain lightning spellbook", 0, 0, null), createItem("magic boost spellbook", 0, 0, null)], costs: [42, 75, 60],stock:[1,1,1]  } };
      building.color = "#001285"
      building.transparency = 0.7
      building.buildingType = "shop";
      break;
    case "equipment hut":
      building = createObject(x, y, -1, -1, { damage: 0 }, "Trade Hut", "🛖", emptyEmoji, "none")
      building.building = true;
      building.shop = { sell: {}, buy: chooseEquipment(3) };
      building.color = "#ff8000"
      building.transparency = 0.7
      building.buildingType = "shop";
      break;
    case "gravestone":
      building = createObject(x, y, -1, -1, { damage: 0 }, "Gravestone", "🪦", emptyEmoji, "none")
      building.building = true;
      building.buildingType = "gravestone";
      building.justCreated = 1;
      building.buildingEffect = function(game, player, i) {
        // i is the location in the game object array
        if (Math.random() < 0.3 && !(player.x === game.objects[i].x && player.y === game.objects[i].y)) {
          game.objects.splice(i + 1, 0, createEnemy("zombie", game.objects[i].x, game.objects[i].y));
          game.objects.splice(i, 1)
        }
      };
      break;
    case "stairs":
      building = createObject(x, y, -1, -1, {}, "Stairs down", "📐", emptyEmoji, "none")
      //possible alternatives: 🕳️,📐,⏬,🪜,📶,𓊍,📥
      building.building = true;
      building.color = "#664003";
      building.transparency = 0.5;
      building.buildingType = "stairs";
      console.log("stairs at", x, y)
      break;
  }
  if(building.shop && building.shop.buy){
    for(let i = 0; i < building.shop.buy.costs.length;i++){
      building.shop.buy.costs[i] *= 1 + 0.5 * (params.floor ? params.floor-1:0)
    }
    
  }
  return building
}

export function createEnemy(name, x, y) {
  switch (name) {
    case "bat":
      let bat = createObject(x, y, 8, 8, { name: "bite", damage: 5, type: "melee", status: {}, accuracy: 1 }, "Bat", "🦇", emptyEmoji, "auto")
      bat.drops = { randNum: 1, maxMoney: 3, random: { "meat-leg": 0.5, "gust spellbook": 0.05 }, guaranteed: [] }
      return bat;
      break;
    case "scorpion":
      let scorpion = createObject(x, y, 18, 18, { name: "sting", damage: 3, type: "melee", status: { poison: { chance: 0.5, time: 10 } }, accuracy: 1 }, "Scorpion", "🦂", emptyEmoji, "auto")
      scorpion.XP += 200;
      scorpion.stats.melee = 5;
      scorpion.stats.defense = 8;
      scorpion.drops = { randNum: 1, maxMoney: 8, random: { "potion of cure effects": 0.3 }, guaranteed: [] }
      return scorpion
      break;
    case "statue":
      let statue = createObject(x, y, 95, 95, { name: "hit", damage: 1, type: "melee", status: {}, accuracy: 1 }, "Statue", "🗿", emptyEmoji, "stationary")
      statue.immune.poison = 1
      statue.drops = { randNum: 1, maxMoney: 10, random: { "summon rock spellbook": 0.5 }, guaranteed: [] }
      return statue;
      break;
    case "boulder":
      let rock = createObject(x, y, 30, 30, { damage: 0 }, "Boulder", "🪨", emptyEmoji, "none")
      rock.immune.poison = 1
      rock.immune.shock = 1
      rock.drops = { randNum: 1, maxMoney: 0, random: {}, guaranteed: [] }
      return rock;
      break;
    case "barbed cactus":
      let cactus = createObject(x, y, 50, 50, { name: "spike", damage: 3, type: "melee", status: { poison: { chance: 0.1, time: 3 } }, accuracy: 1 }, "Barbed Cactus", "🌵", emptyEmoji, "passive")
      cactus.color = "#8909d9";
      cactus.transparency = 0.5;
      cactus.XP -= 350;
      cactus.stats.defense = 6;
      cactus.immune.poison = 1
      cactus.immune.shock = 1
      cactus.drops = { randNum: 0, maxMoney: 0, random: {}, guaranteed: [] }
      return cactus
      break;
    case "pyromancer":
      let pyro = createObject(x, y, 15, 15, { spell: spells.fireball, name: "fireball", damage: 10, type: "ranged", status: {}, accuracy: 1 }, "Pyromancer", "🧙", emptyEmoji, "ranged")
      pyro.transparency = 0.2
      pyro.color = "#f24e30"
      pyro.rangedCooldown = 3
      pyro.rangeChargeTime = 3
      pyro.drops = { randNum: 1, maxMoney: 10, random: { "potion of mana": 0.5, "super fireball spellbook": 0.2 }, guaranteed: [] }
      return pyro
      break;
    case "electromancer":
      let electro = createObject(x, y, 15, 15, { spell: spells.electricity, name: "lightning", damage: 10, type: "ranged", status: {}, accuracy: 1 }, "Electromancer", "🧙", emptyEmoji, "ranged")
      electro.transparency = 0.5
      electro.color = "#42eff5"
      electro.rangedCooldown = 3
      electro.rangeChargeTime = 3
      electro.drops = { randNum: 1, maxMoney: 12, random: { "potion of mana": 0.5, "chain lightning spellbook": 0.2 }, guaranteed: [] }
      return electro
      break;
    case "ape":
      let ape = createObject(x, y, 24, 24, { name: "bite", damage: 12, type: "melee", status: {}, accuracy: 1 }, "Ape", "🦧", emptyEmoji, "auto")
      ape.drops = { randNum: 2, maxMoney: 10, random: { "meat-steak": 0.5 }, guaranteed: ["meat-steak"] }
      ape.stats.melee = 10;
      ape.stats.defense = 10;
      ape.XP *= 2
      return ape;
      break;
    case "dragon":
      let dragon = createObject(x, y, 45, 45, { spell: spells.fireball, name: "fireball", damage: 15, type: "ranged", status: {}, accuracy: 1 }, "Dragon", "🐉", emptyEmoji, "ranged")
      dragon.rangedCooldown = 1
      dragon.rangeChargeTime = 1
      dragon.stats.ranged = 10
      dragon.stats.defense = 14
      dragon.XP *= 5
      dragon.drops = { randNum: 2, maxMoney: 45, random: { "meat-steak": 0.5 }, guaranteed: ["meat-steak", "potion of mana"] }
      return dragon;
      break;
    case "poison dragon":
      let pdragon = createObject(x, y, 45, 45, { spell: spells.sludge, name: "sludge", damage: 15, type: "ranged", status: {}, accuracy: 1 }, "Poison Dragon", "🐉", emptyEmoji, "ranged")
      pdragon.transparency = 0.2
      pdragon.color = "#881F88"
      pdragon.immune.poison = 1
      pdragon.rangedCooldown = 1
      pdragon.rangeChargeTime = 2
      pdragon.stats.ranged = 10
      pdragon.stats.defense = 12
      pdragon.XP *= 5
      pdragon.drops = { randNum: 2, maxMoney: 35, random: { "poison sludge spellbook": 0.3, "meat-steak": 0.5, "meat-steak": 0.5, }, guaranteed: ["meat-steak", "potion of cure effects"] }
      return pdragon;
      break;
    case "trex":
      let trex = createObject(x, y, 80, 80, { name: "bite", damage: 18, type: "melee", status: {}, accuracy: 1 }, "T-Rex", "🦖", emptyEmoji, "auto")
      trex.drops = { randNum: 2, maxMoney: 12, random: { "meat-bone": 0.5 }, guaranteed: ["meat-bone", "meat-bone", "meat-bone"] }
      trex.stats.melee = 10;
      trex.stats.defense = 14;
      return trex;
      break;
    case "zombie":
      let zombie = createObject(x, y, 12, 12, { name: "bite", damage: 9, type: "melee", status: { poison: { chance: 0.3, time: 4 } }, accuracy: 0.8 }, "Zombie", "🧟", emptyEmoji, "auto")
      zombie.drops = { randNum: 1, maxMoney: 5, random: { "gravestone": 0.5 }, guaranteed: [] }
      zombie.immune.poison = 1;
      zombie.stats.melee = 7;
      zombie.stats.defense = 9;
      return zombie;
      break;
    case "troll":
      let troll = createObject(x, y, 24, 24, { name: "club", damage: 9, type: "melee", status: {}, accuracy: 1 }, "Troll", "🧌", emptyEmoji, "auto")
      troll.drops = { randNum: 2, maxMoney: 32, random: { "potion of healing": 0.5, "meat-bone": 0.5 }, guaranteed: ["meat-bone"] }
      troll.stats.melee = 7;
      troll.stats.defense = 16;
      troll.XP *= 6;
      troll.ability = function(game) {
        if (!this.wasHit) {
          if (troll.health < troll.maxHealth - 5) {
            troll.health += 5
          }
          else {
            troll.health = troll.maxHealth
          }
        }
      }
      return troll;
      break;
  }
}

let colors = ["#3933a6", "#b32d15", "#d4762f", "#d6ca3e", "#2da631", "#2e7b9e", "#3e3cab", "#923ca6", "#cc1680"]

export function createItem(name, x, y, params) {
  switch (name) {
    case ("gravestone"):
      return createBuilding("gravestone", x, y, null)
    case ("magic mushroom"):
      let mushroom = createObject(x, y, -1, -1, {}, "Mushroom", "🍄", emptyEmoji, "none")
      mushroom.uses = 1;
      mushroom.freeAction = false;
      mushroom.color = colors[Math.floor(Math.random() * colors.length)];
      mushroom.transparency = 0.2;
      mushroom.item = true;
      mushroom.food = true;
      mushroom.sell = { price: 5, variation: 2 }
      mushroom.effect = function(player, game) {
        if("🍀" in player.status && Math.random() > 0.5){
          player.health = player.maxHealth
          return;
        }
        if (Math.random() < 0.4) {
          createItem("potion of healing", 0, 0, null).effect(player, game)
        }
        else if (Math.random() < 0.5) {
          createItem("potion of mana", 0, 0, null).effect(player, game)
        }
        else if (Math.random() < 0.6) {
          player.status["☣️"] = 5
        }
        else {
          player.health = player.maxHealth
        }
      };
      return mushroom
      break;
    case ("meat-leg"):
      let meatleg = createObject(x, y, -1, -1, {}, "Meat", "🍗", emptyEmoji, "none")
      meatleg.uses = 1;
      meatleg.freeAction = false;
      meatleg.item = true;
      meatleg.food = true;
      meatleg.sell = { price: 3, variation: 1 }
      meatleg.effect = function(player, game) {
        if (player.health <= player.maxHealth - 5) {
          player.health += 5
        }
        else if (player.health <= player.maxHealth) {
          player.health = player.maxHealth
        }
      };
      return meatleg
      break;
    case ("meat-bone"):
      let meatbone = createObject(x, y, -1, -1, {}, "Meat", "🍖", emptyEmoji, "none")
      meatbone.uses = 1;
      meatbone.freeAction = false;
      meatbone.item = true;
      meatbone.food = true;
      meatbone.sell = { price: 5, variation: 2 }
      meatbone.effect = function(player, game) {
        if (player.health <= player.maxHealth - 5) {
          player.health += 5
        }
        else if (player.health <= player.maxHealth) {
          player.health = player.maxHealth
        }
      };
      return meatbone
      break;
    case ("meat-steak"):
      let meatsteak = createObject(x, y, -1, -1, {}, "Meat", "🥩", emptyEmoji, "none")
      meatsteak.uses = 1;
      meatsteak.freeAction = false;
      meatsteak.item = true;
      meatsteak.food = true;
      meatsteak.sell = { price: 5, variation: 2 }
      meatsteak.effect = function(player, game) {
        if (player.health <= player.maxHealth - 5) {
          player.health += 5
        }
        else if (player.health <= player.maxHealth) {
          player.health = player.maxHealth
        }
      };
      return meatsteak
      break;
    case ("money"):
      let money = createObject(x, y, -1, -1, {}, "$" + params.amount, "🪙", emptyEmoji, "none")
      money.amount = params.amount;
      money.item = true;
      return money;
      break;
    case ("potion of healing"):
      let potion = createObject(x, y, -1, -1, {}, "Potion of Healing", "🧪", emptyEmoji, "none");
      potion.color = "#71BE2B"//"#fcbe2b";
      potion.transparency = 0.3;
      potion.uses = 1;
      potion.freeAction = false;
      potion.item = true;
      potion.description = "Increases health when consumed"
      potion.sell = { price: 7, variation: 3 }
      potion.effect = function(player, game) {
        if (player.health <= player.maxHealth - 20) {
          player.health += 20
        }
        else {
          player.health = player.maxHealth
        }
      };
      return potion
      break;
    case ("potion of vitality"):
      let potionv = createObject(x, y, -1, -1, {}, "Potion of Vitality", "🧪", emptyEmoji, "none");
      potionv.color = "#fc0f03"
      potionv.transparency = 0.2;
      potionv.uses = 1;
      potionv.freeAction = false;
      potionv.item = true;
      potionv.description = "When consumed, increases heath and max health"
      potionv.sell = { price: 12, variation: 3 }
      potionv.effect = function(player, game) {
        player.maxHealth += 10
        player.health += 10
      };
      return potionv
      break;
    case ("potion of cure effects"):
      let potion2 = createObject(x, y, -1, -1, {}, "Potion of Cure Effects", "🧪", emptyEmoji, "none");
      potion2.color = "#8909d9";
      potion2.transparency = 0.3;
      potion2.uses = 1;
      potion2.freeAction = false;
      potion2.item = true;
      potion2.description = "When consumed, ends all status effects"
      potion2.sell = { price: 4, variation: 2 }
      potion2.effect = function(player, game) {
        for (const [key, value] of Object.entries(player.status)) {
          logAction(game, "effectOff", player, null, { name: getStatusEmojiName(key) });
          delete (player.status[key]);
        }
      }

      return potion2
      break;
    case ("potion of mana"):
      let potion3 = createObject(x, y, -1, -1, {}, "Potion of Mana", "🧪", emptyEmoji, "none");
      potion3.color = "#FFFF00";
      potion3.transparency = 0.1;
      potion3.uses = 1;
      potion3.freeAction = false;
      potion3.item = true;
      potion3.description = "Replenishes mana when consumed"
      potion3.sell = { price: 7, variation: 1 }
      potion3.effect = function(player, game) {
        if (player.mana <= player.maxMana - 20) {
          player.mana += 20
        }
        else if (player.mana < player.maxMana) {
          player.mana = player.maxMana
        }
      }
      return potion3
      break;
    case ("potion of luck"):
      let potion4 = createObject(x, y, -1, -1, {}, "Potion of Luck", "🧪", emptyEmoji, "none");
      potion4.color = "#fc42fc";
      potion4.transparency = 0.1;
      potion4.uses = 1;
      potion4.freeAction = false;
      potion4.item = true;
      potion4.description = "When consumed, temporarily increases luck"
      potion4.sell = { price: 6, variation: 5 }
      potion4.effect = function(player, game) {
        if ("🍀" in player.status) {
          player.status["🍀"] += 5
        }
        else {
          player.status["🍀"] = 5
        }
      }
      return potion4
      break;
    case ("potion of strength"):
      let potion5 = createObject(x, y, -1, -1, {}, "Potion of Strength", "🧪", emptyEmoji, "none");
      potion5.color = "#FFAB00";
      potion5.transparency = 0.1;
      potion5.uses = 1;
      potion5.freeAction = false;
      potion5.item = true;
      potion5.description = "When consumed, temporarily increases melee damage"
      potion5.sell = { price: 6, variation: 3 }
      potion5.effect = function(player, game) {
        if ("⚔️" in player.status) {
          player.status["⚔️"] += 8
        }
        else {
          player.status["⚔️"] = 8
        }
      }
      return potion5
      break;
    case ("potion of defense"):
      let potion6 = createObject(x, y, -1, -1, {}, "Potion of Defense", "🧪", emptyEmoji, "none");
      potion6.color = "#00BCFF";
      potion6.transparency = 0.1;
      potion6.uses = 1;
      potion6.freeAction = false;
      potion6.item = true;
      potion6.description = "When consumed, temporarily increases defense"
      potion6.sell = { price: 6, variation: 3 }
      potion6.effect = function(player, game) {
        if ("🛡️" in player.status) {
          player.status["🛡️"] += 8
        }
        else {
          player.status["🛡️"] = 8
        }
      }
      return potion6
      break;
    case ("potion of magic"):
      let potion7 = createObject(x, y, -1, -1, {}, "Potion of Magic", "🧪", emptyEmoji, "none");
      potion7.color = "#BF00FF";
      potion7.transparency = 0.1;
      potion7.uses = 1;
      potion7.freeAction = false;
      potion7.item = true;
      potion7.description = "When consumed, temporarily increases spell and ranged attack damage"
      potion7.sell = { price: 6, variation: 3 }
      potion7.effect = function(player, game) {
        if ("💫" in player.status) {
          player.status["💫"] += 8
        }
        else {
          player.status["💫"] = 8
        }
      }
      return potion7
      break;
    case ("super fireball spellbook"):
      let book = createObject(x, y, -1, -1, {}, "Super Fireball Spellbook", "📙", emptyEmoji, "none");
      book.color = "#ff3600";
      book.transparency = 0.3;
      book.freeAction = false;
      book.item = true;
      book.uses = 1;
      book.sell = { price: 12, variation: 4 }
      book.effect = function(player, game) {
        if (!inSpells("super fireball", player.spells)) {
          player.spells.push(spells.superFireball)

          logAction(game, "new spell", player, null, { spell: "super fireball" })
          rangedAttackSelect(game, book);
        }
        else {
          logAction(game, "already learned", player, null, { name: "super fireball spellbook" })
        }
      };
      return book
      break;
    case ("gust spellbook"):
      let book2 = createObject(x, y, -1, -1, {}, "Gust Spellbook", "📗", emptyEmoji, "none");
      book2.color = "#979e96";
      book2.transparency = 0.3;
      book2.freeAction = false;
      book2.item = true;
      book2.uses = 1;
      book2.sell = { price: 8, variation: 5 }
      book2.effect = function(player, game) {
        if (!inSpells("gust", player.spells)) {
          player.spells.push(spells.gust)

          logAction(game, "new spell", player, null, { spell: "gust" })
        }
        else {
          logAction(game, "already learned", player, null, { name: "gust spellbook" })
        }
      };
      return book2
      break;
    case ("magic boost spellbook"):
      let book3 = createObject(x, y, -1, -1, {}, "Magic Boost Spellbook", "📘", emptyEmoji, "none");
      book3.color = "#550080";
      book3.transparency = 0.2;
      book3.freeAction = false;
      book3.item = true;
      book3.uses = 1;
      book3.sell = { price: 8, variation: 5 }
      book3.effect = function(player, game) {
        if (!inSpells("magic boost", player.spells)) {
          player.spells.push(spells.magic)

          logAction(game, "new spell", player, null, { spell: "magic boost" })
        }
        else {
          logAction(game, "already learned", player, null, { name: "magic boost spellbook" })
        }
      };
      return book3
      break;
    case ("summon rock spellbook"):
      let book4 = createObject(x, y, -1, -1, {}, "Summon Rock Spellbook", "📗", emptyEmoji, "none");
      book4.color = "#696763";
      book4.transparency = 0.3;
      book4.freeAction = false;
      book4.item = true;
      book4.uses = 1;
      book4.sell = { price: 8, variation: 5 }
      book4.effect = function(player, game) {
        if (!inSpells("rock", player.spells)) {
          player.spells.push(spells.rock)

          logAction(game, "new spell", player, null, { spell: "summon rock" })
        }
        else {
          logAction(game, "already learned", player, null, { name: "summon rock spellbook" })
        }
      };
      return book4
      break;
    case ("chain lightning spellbook"):
      let book5 = createObject(x, y, -1, -1, {}, "Chain Lightning Spellbook", "📘", emptyEmoji, "none");
      book5.color = "#24f0ff";
      book5.transparency = 0.3;
      book5.freeAction = false;
      book5.item = true;
      book5.uses = 1;
      book5.sell = { price: 15, variation: 5 }
      book5.effect = function(player, game) {
        if (!inSpells("lightning", player.spells)) {
          player.spells.push(spells.lightning)

          logAction(game, "new spell", player, null, { spell: "chain lightning" })
        }
        else {
          logAction(game, "already learned", player, null, { name: "chain lightning spellbook" })
        }
      };
      return book5
      break;
    case ("poison sludge spellbook"):
      let book6 = createObject(x, y, -1, -1, {}, "Poison Sludge Spellbook", "📘", emptyEmoji, "none");
      book6.color = "#872abd";
      book6.transparency = 0.3;
      book6.freeAction = false;
      book6.item = true;
      book6.uses = 1;
      book6.sell = { price: 15, variation: 5 }
      book6.effect = function(player, game) {
        if (!inSpells("sludge", player.spells)) {
          player.spells.push(spells.sludge)

          logAction(game, "new spell", player, null, { spell: "poison sludge" })
        }
        else {
          logAction(game, "already learned", player, null, { name: "poison sludge spellbook" })
        }
      };
      return book6
      break;
  }
}

export function createRandBuilding(x, y) {
  //Uncomment to test dungeon delving
  //return createBuilding("stairs", x, y, null)
  let rand = Math.random()
  if (rand < 0.5) {
    return createBuilding("trade hut", x, y, null)
  }
  if(rand < 0.8){
    return createBuilding("equipment hut", x, y, null)
  }
  if (rand < 0.9) {
    return createBuilding("spell hut", x, y, null)
  }
  return createBuilding("potion hut", x, y, null)
}

export function createScaledRandMonster(x, y, game) {
  //Simple scaled monster generation, harder monsters appear as you get deeper into the dungeon
  let rand = Math.random() * (x + y) * game.floor
  if (rand < 15) {
    if (Math.random() < 0.5) {
      return createEnemy("boulder", x, y)
    }
    return createEnemy("bat", x, y)
  }
  if (rand < 25) {
    if (Math.random() < 0.1) {
      return createEnemy("statue", x, y)
    }
    else if (Math.random() < 0.35) {
      return createEnemy("bat", x, y)
    }
    else if (Math.random() < 0.5) {
      return createEnemy("boulder", x, y)
    }
    else {
      return createEnemy("scorpion", x, y)
    }
  }
  if (rand < 30) {
    return createEnemy("barbed cactus", x, y)
  }
  if (rand < 60) {
    if (Math.random() < 0.7) {
      return createEnemy("pyromancer", x, y)
    }
    return createEnemy("scorpion", x, y)
  }
  if (rand < 70) {
    if (Math.random() < 0.6) {
      return createEnemy("electromancer", x, y)
    }
    else {
      return createEnemy("zombie", x, y)
    }
  }
  if (rand < 95) {
    if (Math.random() < 0.5) {
      return createEnemy("zombie", x, y)
    }
    return createEnemy("ape", x, y)
  }
  if (rand < 105) {
    return createEnemy("poison dragon", x, y)
  }
  if (rand < 120) {
    return createEnemy("troll", x, y)
  }
  if (rand < 135) {
    return createEnemy("trex", x, y)
  }
  else {
    return createEnemy("dragon", x, y)
  }
}

export function createRegularRandMonster(x, y) {
  let rand = Math.random()
  if (rand < 0.15) {
    return createEnemy("bat", x, y)
  }
  if (rand < 0.25) {
    return createEnemy("scorpion", x, y)
  }
  if (rand < 0.40) {
    return createEnemy("statue", x, y)
  }
  if (rand < 0.75) {
    return createEnemy("boulder", x, y)
  }
  if (rand < 0.90) {
    return createEnemy("barbed cactus", x, y)
  }
  if (rand < 0.95) {
    return createEnemy("pyromancer", x, y)
  }
  else {
    return createEnemy("ape", x, y)
  }
}

export function createRandItem(x, y) {
  let rand = Math.random()
  if (rand < 0.25) {
    return createItem("potion of healing", x, y, null)
  }
  if (rand < 0.5) {
    return createItem("magic mushroom", x, y, null)
  }
  if (rand < 0.70) {
    return createItem("potion of cure effects", x, y, null)
  }
  if (rand < 0.85) {
    return createItem("potion of mana", x, y, null)
  }
  if (rand < 0.95) {
    return createItem("potion of vitality", x, y, null)
  }
  else {
    return createItem("potion of luck", x, y, null)
  }
}

export let spells = {
  fireball: {
    displayName: "Fireball🔥", name: "fireball", color: "#ff6a14", description: "Launch a fireball at a target",
    attack: {
      name: "fireball", damage: 10,
      type: "ranged", status: {}, accuracy: 1
    },
    overlay: {
      char: "🔥",
      time: 1,
    },
    mana: 12, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  heal: {
    displayName: "Heal💫", name: "heal", color: "#fcba03", description: "Heal your wounds", freeAction: true, mana: 12,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      if (player.health <= player.maxHealth - 10) {
        player.health += 10
      }
      else if (player.health < player.maxHealth) {
        player.health = player.maxHealth
      }
    }
  },
  sludge: {
    displayName: "Poison Sludge ☣", name: "sludge", color: "#881F88", description: "Launch poisionous sludge at a target", attack: {
      name: "sludge", damage: 6,
      type: "ranged", status: { poison: { chance: 0.85, time: 5 } }, accuracy: 1
    },
    overlay: {
      char: "🫧",
      time: 1,
      transparency: 0.4,
      color: "rgba(136,31,136,0.7)",
    },
    freeAction: true, mana: 14, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  teleport: {
    displayName: "Teleport🌀", name: "teleport", color: "#363dba", description: "Teleport to a nearby location", attack: { name: "teleport", accuracy: 1 },
    overlay: {
      char: "🌀",
      time: 1,
      transparency: 0.1,
      color: "rgba(255,100,255,0.5)",
    },
    freeAction: true, noHit: true, host: null, mana: 20, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  cure: {
    displayName: "Cure ⚕", name: "cure", color: "#8909d9", description: "Cure status effects", freeAction: true, mana: 8,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      for (const [key, value] of Object.entries(player.status)) {
        logAction(game, "effectOff", player, null, { name: getStatusEmojiName(key) });
        delete (player.status[key]);
      }
    }
  },
  rock: {
    displayName: "Summon Rock 🪨", name: "summon rock", color: "#696763", description: "Summon a boulder to block enemies", attack: {
      name: "summon rock",
      accuracy: 1
    }, freeAction: true, noHit: true, mana: 15,
    effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  lightning: {
    displayName: "Chain Lightning 🌩", name: "lightning", color: "#4affd5", description: "Send a shock through multiple enemies", attack: {
      name: "lightning", damage: 4,
      type: "ranged", status: { shock: { chance: 1, time: 2 } }, accuracy: 1
    },
    overlay: {
    },
    freeAction: true, mana: 25, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  gust: {
    displayName: "Gust 🌪️", name: "gust", color: "#909990", description: "Push back enemies around you", freeAction: true, mana: 5,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      let o = game.objects
      let p = game.player
      for (let i = 1; i < o.length; i++) {
        if (!(o[i].building)) {
          if (o[i].x > p.x && game.board[o[i].x + 1][o[i].y] === 0) {
            o[i].x += 1;
          }
          if (o[i].x < p.x && game.board[o[i].x - 1][o[i].y] === 0) {
            o[i].x -= 1;
          }
          if (o[i].y < p.y && game.board[o[i].x][o[i].y - 1] === 0) {
            o[i].y -= 1;
          }
          if (o[i].y > p.y && game.board[o[i].x][o[i].y + 1] === 0) {
            o[i].y += 1;
          }
        }
      }
    }
  },
  superFireball: {
    displayName: "Super Fireball☄️", name: "super fireball", color: "#f52f07", description: "Launch a big fireball at a target",
    attack: {
      name: "super fireball", damage: 28,
      type: "ranged", status: {}, accuracy: 0.85
    },
    overlay: {
      char: "💥",
      time: 1,
      transparency: 0.3,
      color: "rgba(245, 47, 7, 0.8)",
    },
    mana: 20, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  magic: {
    displayName: "Magic boost 🔮", name: "magic boost", color: "#4d067d", description: "Boost magic damage", freeAction: true, mana: 15,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      if ("💫" in player.status) {
        player.status["💫"] += 5
      }
      else {
        player.status["💫"] = 5
      }

    }
  },
  shield: {
    displayName: "Shield 🛡️", name: "defense boost", color: "#4eb3ed", description: "Boost defense", freeAction: true, mana: 15,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      if ("🛡️" in player.status) {
        player.status["🛡️"] += 5
      }
      else {
        player.status["🛡️"] = 5
      }

    }
  },
  buff: {
    displayName: "War cry ⚔️", name: "attack boost", color: "#281452", description: "Boost attack", freeAction: true, mana: 15,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      if ("⚔️" in player.status) {
        player.status["⚔️"] += 5
      }
      else {
        player.status["⚔️"] = 5
      }

    }
  },
  electricity: {
    displayName: "Thunderbolt 🗲", name: "thunderbolt", color: "#fc9003", description: "Launch lightning at a target",
    attack: {
      name: "thunderbolt", damage: 10,
      type: "ranged", status: { shock: { chance: 0.2, time: 2 } }, accuracy: 0.9
    },
    overlay: {
      char: "⚡",
      time: 1,
    },
    mana: 12, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  speedBoost: {
    displayName: "Dash 💨", name: "dash", color: "#d8eff0", description: "Move faster than enemies can react", freeAction: true, mana: 25,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      if ("💨" in player.status) {
        player.status["💨"] += 5
      }
      else {
        player.status["💨"] = 5
      }

    }
  },
  shuriken: {
    displayName: "Shuriken ✫", name: "shuriken", color: "#5A5A5A", description: "Throw a shuriken at a target",
    attack: {
      name: "shuriken", damage: 6,
      type: "ranged", status: {}, accuracy: 1
    },
    overlay: {
      //char: "⭐",
      //time: 1,
      //transparency: 0.3,
      //color: "#757575",
    },
    mana: 6, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  bow: {
    displayName: "Bow 🏹", name: "bow", color: "#784936", description: "Shoot an arrow at a target",
    attack: {
      name: "arrow", damage: 5,
      type: "ranged", status: {}, accuracy: 1
    },
    overlay: {
      //char: " ➴",
      //time: 1,
      //transparency: 0.3,
      //color: "#918f8a",
    },
    mana: 0, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  quickdraw: {
    displayName: "Quickdraw 🎯", name: "quickdraw", color: "#ed3211", description: "Rapidly fire an arrow at a target",
    attack: {
      name: "arrow", damage: 5,
      type: "ranged", status: {}, accuracy: 1, noTurn: true,
    },
    overlay: {
      //char: " ➴",
      //time: 1,
      //transparency: 0.3,
      //color: "#918f8a",
    },
    mana: 8, freeAction: true, effect: function(player, game) {
      this.host = player
      player.rangedInProgress.check = true;
      player.rangedInProgress.obj = this;
      logAction(game, "startAim")
      rangedAttackSelect(game, this);
    }
  },
  navigate: {
    displayName: "Navigate ⛰️", name: "navigate", color: "#459923", description: "Detect surrounding terrain",
    attack: {},
    mana: 18, freeAction: true, effect: function(player, game) {
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      this.host = player
      expandMap(game, 14)
    }
  },
  shieldBash: {
    displayName: "Shield Bash 💥", name: "shield bash", color: "#ed4811", description: "Stun adjacent enemies", freeAction: true, mana: 15,
    effect: function(player, game) {
      this.host = player
      if (this.mana) {
        player.mana -= this.mana
        logAction(game, "useMana", player, null, { amount: this.mana })
      }
      let dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      for (let i = 0; i < 4; i++) {
        let o = findObj(game, player.x + dirs[i][0], player.y + dirs[i][1])
        if (o.maxHealth > 0) {
          o.status["⚡"] = 2
        }
      }
    }
  },
}

export let classes = [
  { name: "Ranger", char: "🧝", spells: [spells.bow, spells.quickdraw, spells.navigate, spells.heal, spells.cure,], stats: { base: { defense: 5, melee: 5, ranged: 5 }, growth: { defense: 1, melee: 1, ranged: 1.5 } }, money: 5, health:100, mana:100 },
  { name: "Ninja", char: "🥷", spells: [spells.speedBoost, spells.teleport, spells.shuriken,], stats: { base: { defense: 3, melee: 7, ranged: 5 }, growth: { defense: 0.5, melee: 2, ranged: 1 } }, money: 45, health:100, mana:100 },
  { name: "Wizard", char: "🧙‍♂️", spells: [spells.gust, spells.fireball, spells.heal, spells.teleport, spells.cure], stats: { base: { defense: 4, melee: 5, ranged: 6 }, growth: { defense: 1, melee: 0.5, ranged: 2 } }, money: 12, health:100, mana:120 },
  { name: "Knight", char: "🤴", spells: [spells.buff, spells.shield, spells.shieldBash], stats: { base: { defense: 7, melee: 6, ranged: 2 }, growth: { defense: 1.5, melee: 1.5, ranged: 0.5 } }, money: 20, health:120, mana:80 }
]

export let uniqueObjs = [
  createEquipment("poison dagger", 0, 0),
  createEquipment("robe of peace", 0, 0),
  createEquipment("shawl of rage", 0, 0),
]

export function dropUniqueObj(game, x, y){
  if(uniqueObjs.length > 0){
    let i = Math.floor(Math.random()*uniqueObjs.length)
    let object = uniqueObjs.splice(i, 1)[0]
    console.log("object:", object)
    object.x = x
    object.y = y
    game.objects.push(object)
  }
}

function expandMap(game, r) {
  //expand the player's known map by a radius of r
  let p = game.player
  for (let x = p.x - r; x < p.x + r + 1; x++) {
    for (let y = p.y + r + 1; y > p.y - r - 1; y--) {
      if (Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < r) {
        if (game.board[x] !== undefined) {
          if (game.board[x][y] !== undefined) {
            if (game.board[x][y] === 0) {
              game.displayMap.board[x][y] = 0
            } else if (game.board[x][y] !== 0) {
              game.displayMap.board[x][y] = 1
            }
          }
        }
      }
    }
  }
}

function inSpells(spellname, spells) {
  let check = false
  for (let i = 0; i < spells.length; i++) {
    if (spells[i].name === spellname) {
      check = true
    }
  }
  return check
}

function rand(min, max) {
  return Math.random() * (max - min) + min

}
