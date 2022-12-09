import React from 'react'
import ReactDOM from 'react-dom/client'
import { createGame, createObject, update, objectSummary, squareSummary, healthDisplay, outputLog, printStatus, charInArr, colorInArr, transparencyInArr, objOverlay, objOverlayTransparency, objOverlayColor, switchInfo, getStat } from './game.jsx'
import { classes } from './objects.jsx'
import './App.css'
import { useEffect } from 'react';
import { useState } from 'react';

//added summary as title instead of just emoji. Gives name and health
function Square(props) {
  return (
    <button className={"square"} title={(props.value === emptyEmoji ? "" : props.summary)} style={{ backgroundColor: props.color }}>

      <span style={
        {
          "textShadow": "0 0 " + props.effects[0],
          "color": "rgba(0, 0, 0, " + props.effects[1] + ")"
        }}>
        {[props.value]}
      </span>

      <button className={"status"}>
        {props.status}
      </button>
      <button className={"damage"}>
        {props.damage}
      </button>
      <p className={"overlay"}>
        <span style={
          {
            "textShadow": "0 0 " + props.overColor,
            "color": "rgba(0,0,0," + props.overOpacity + ")"
          }}>
          {props.overlay}
        </span>
      </p>
      <button className={"health"}>
        {props.health}
      </button>

    </button >


  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.drawBoard = this.drawBoard.bind(this)
    //console.log("props", this.props.value);
  }
  renderSquare(square) {
    let obj = square.object
    let c = square.color
    if (obj) {
      return (
        <Square
          summary={squareSummary(game, obj.x, obj.y)}
          value={obj.char}
          effects={[obj.color, obj.transparency]}
          overlay={objOverlay(obj.overlay)}
          overColor={objOverlayColor(obj.overlay)}
          overOpacity={objOverlayTransparency(obj.overlay)}
          status={printStatus(obj.status)}
          damage={obj.damage}
          health={healthDisplay(obj, game)}
          color={c}
        />
      );
    } else {
      <Square
        color={"red"}
      />
    }
  }
  drawBoard(game, i) {
    function handleClick() {
      //Restarts the game because the way button propagation works in react, calls the parent button method
    }
    if (game.class.name === "none") {
      //If the player hasn't chosen a class, class select screen
      return <div style={{ position: "relative", height: "77.5vh", width: "100%" }}>
        <div style={{ position: "absolute", height: "10%", top: "15%", left: "20%", font: "400% Courier New" }}>
          Select Class
        </div>
        <div style={{ position: "absolute", top: "40%", left: "0%" }}>
          {this.drawClasses(game, 0)}
          {this.drawClasses(game, 1)}
          {this.drawClasses(game, 2)}
          {this.drawClasses(game, 3)}
        </div>
      </div>
    }
    if (game.player.health <= 0 && i === 0) {
      //check highscore when player dies
      delete localStorage.game
      if (game.player.XP.total > localStorage.highscore) {
        localStorage.highscore = game.player.XP.total
        localStorage.highscoreName = game.player.name
      }
      //If player dead, restart the game option with xp score
      return <div> {this.drawBoard(game, 1)}
        <div style={{ position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5" }}></div>
        <div className="popup">
          <div style={{ display: "flex", "flex-direction": "column", "margin-top": "5%" }}>
            <p>Game Over: Play Again?</p>
            <p>{"Total XP: " + game.player.XP.total}</p>
            <p style={{ font: "65% Courier New" }}>{localStorage.highscore <= game.player.XP.total ? "New High Score! Congratulations " + game.player.name : "High Score: " + localStorage.highscoreName + " (" + localStorage.highscore + ")"}</p>
          </div>
          <form onSubmit={handleClick}>
            <button className="playButton" type="submit" style={{ position: "absolute", width: "70%", left: "15%", top: "75%" }}>Play Again</button>
          </form>
        </div>
      </div>
    }
    if (game.displayInfo && i === 0) {
      //If displaying game info, do this
      return <div> {this.drawBoard(game, 1)}
        <div style={{ position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5" }}></div>
        <button style={{ width: "5vh", height: "5vh", position: "fixed", left: "3%", top: "6%", "borderRadius": "50%", font: "3.5vh Courier New" }} onClick={() => { game.displayInfo = !(game.displayInfo); this.setState({ count: this.state.count + 1 }); }}>X</button>
        <div className="popup" style={{ "justify-content": "left", height: "60%", "flex-direction": "column", "padding-right": "20px" }}>
          <p style={{ "margin-left": "2%", width: "100%", height: "10%" }}>Game Controls:</p>
          <p style={{ "margin-left": "2%", font: "50% Courier New", width: "100%", height: "10%", "margin-top": "-6%" }}>qDungeon is a turn-based, in-browser, dungeon-crawler game. <br></br><br></br>Use the arrow keys to navigate around the board. Moving into enemies auto-attacks them with your melee attack, and after each action you take, your enemies will move and attack.<br></br><br></br>Press "P" while standing on top of an item to pick it up, adding it to your inventory. While standing on a building, press "P" to enter it.<br></br><br></br>Press "S" to see your spell/ability menu and press "I" to see your inventory and equip weapons or armor. <br></br>⠀- Use arrow keys to navigate those menus. <br></br>⠀- Press enter to use an item or ability.<br></br>⠀- You can't use an ability unless you have enough mana for it.<br></br><br></br>If you get lost, press "M" to pull up a map of the areas of the dungeon you've explored so far.</p>
        </div>
      </div>
    }
    if (game.displaySpells.check && i === 0) {
      //If displaying spells, do this
      // Scrolling works, but its tricker and probably requires different specifics than logs do
      let show = game.player.spells.length > 4 ? 4 : game.player.spells.length
      return <div> {this.drawBoard(game, 1)}
        <div style={{ position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5" }}></div>
        <div className="popup" style={{ height: 20 * show + "%", top: "10%", background: "#949494" }}>
          {this.drawSpells(0, 0, show, game.displaySpells.active, 1)}
        </div>
      </div>
    }
    if (game.player.inShop.check && i === 0) {
      //If displaying shop, do this
      return <div> {this.drawBoard(game, 1)}
        <div style={{ position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5" }}></div>
        <div className="popup" style={{ height: "75%", top: "10%", "justify-content": "left" }}>
          {this.drawShop(game, 1)}
        </div>
      </div>
    }
    if (game.player.inStats.check && i === 0) {
      //If displaying shop, do this
      return <div> {this.drawBoard(game, 1)}
        <div style={{ position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5" }}></div>
        <div className="popup" style={{ height: "75%", top: "10%", "justify-content": "left" }}>
          {this.drawStats(game, 1)}
        </div>
      </div>
    }
    if (game.displayMap.check && i === 0) {
      //If display map, show the map
      return <div> {this.drawBoard(game, 1)}
        <div style={{
          position: "fixed", background: "black", top: "0", left: "0", color: "black", height: "100vh", width: "100vw", opacity: "0.5"
        }}></div>
        <div className="popup" style={{
          height: "80%", top: "10%", width: (80 * game.board.length / game.board[0].length) + "vh",
          // left: "calc((50vw - " + (80 * game.board.length / game.board[0].length) + "vh))",
          left: "calc((100vw - " + (80 * game.board.length / game.board[0].length) + "vh)/2)",
          display: "inline-block"
        }}>
          <div style={{ height: "100%", "margin-top": "2%", width: "100%", "margin-left": "3.1%" }}>
            {this.tinyBoard(0, 0, game.board[0].length, game.board.length, 1)}
          </div>
        </div>
      </div >
    }
    return <div id="container">
      <button style={{ width: "5vh", height: "5vh", position: "fixed", left: "3%", top: "6%", "borderRadius": "50%", font: "3.5vh Courier New" }} onClick={() => { game.displayInfo = !(game.displayInfo); this.setState({ count: this.state.count + 1 }); }}>i</button>
      {this.drawRow(game, -1, 0)}
      <div id="playerState" style={{ position: "relative", height: "100%" }}>
        <p>{game.class.name}: {game.player.name}</p>
        <p>Level: {game.player.XP.level} / Floor: {game.floor}</p>
        <div className="healthBarBack" style={{ position: "relative" }}>
          <div className="healthBar" style={{ width: (100 * game.player.health / game.player.maxHealth) + "%", height: "100%" }}>
            <div style={{ position: "relative", left: "3%" }}>{game.player.health + "/" + game.player.maxHealth}</div>
          </div>
          <div style={{ position: "absolute", right: "-25%", bottom: "5%", 'fontSize': "135%" }}> {printStatus(game.player.status)}</div>
        </div>
        <div className="healthBarBack" style={{ position: "absolute", top: "100%" }}>
          <div className="healthBar" style={{ 'backgroundColor': "yellow", width: (100 * game.player.mana / game.player.maxMana) + "%", height: "100%" }}>
            <div style={{ position: "relative", left: "3%" }}>{game.player.mana + "/" + game.player.maxMana}</div>
          </div>

        </div>
        <div className="healthBarBack" style={{ position: "absolute", top: "135%" }}>
          <div className="healthBar" style={{ 'backgroundColor': "#55D1FF", width: (100 * (game.player.XP.total - (game.player.XP.nextLevel - game.player.XP.next)) / (game.player.XP.next)) + "%", height: "100%" }}>
            <p style={{ position: "relative", "white-space": "nowrap" }}>{"󠀠  XP: " + game.player.XP.total}</p>
          </div>

        </div>
        <p>
          <div className="outerLog" style={{ position: "absolute" }}>
            <div className="innerLog">
              {outputLog(game)}
              <div ref={this.messagesEndRef} />
            </div>
          </div>
        </p>
      </div>
    </div >
  }
  drawClasses(game, i) {
    return <div>
      <button className="box" style={{ "fontSize": "6vw", position: "absolute", width: "12vw", height: "12vw", left: i * 20 + "vw", background: game.class.select === i ? "#a3a3a3" : "#d4d4d4" }}
      >
        <span style={{
          //no span currently
        }}>
          {classes[i].char}
        </span>
        <div className="inv_num" style={{ font: "2vw Courier New", top: "-75%" }}>{" " + classes[i].name}</div>
      </button>
    </div>
  }
  drawShop(game, i) {
    return <div>
      <div style={{ position: "absolute", width: "100%", "margin-left": "0%" }}></div>
      {this.drawShopSquares(game, 0, 0)}
    </div>
  }
  drawShopSquares(game, i, k) {
    if (k === 0) {
      return <div style={{ position: "absolute", width: "100%", height: "100%", "margin-left": "3%", display: "flex", "flex-direction": "row", "flex-wrap": "wrap" }}>
        <div style={{ position: "absolute", width: "40%", "margin-top": "2.5%", "line-height": "100%" }}>{"Gold: $" + game.player.inShop.money}<br></br><br></br>Buy:</div><br></br>
        <div style={{ position: "absolute", height: "80%", width: "20%", display: "flex", "flex-direction": "column", "margin-top": "25%" }}>
          {this.drawShopSquares(game, 0, 1)}
          {this.drawShopSquares(game, 1, 1)}
          {this.drawShopSquares(game, 2, 1)}
        </div>

        <div style={{ position: "absolute", "width": "60%", height: "65%", "margin-top": "2.5%", "margin-left": "40%", "line-height": "100%", "justify-content": "left" }}>
          {" " + "Sell:" + (game.player.inShop.active[0] === 1 && game.player.inShop.active[1] <= game.player.inventory.length ? (game.player.inventory[game.player.inShop.active[1] - 1].name in game.player.inShop.shop.sell ? " $" + game.player.inShop.shop.sell[game.player.inventory[game.player.inShop.active[1] - 1].name] : " ?") : "")}<br></br>
          {this.drawBoxes(0, 24, game.player.inShop.active[0] === 1 ? game.player.inShop.active[1] : -1)}
        </div>
      </div>
    }
    return <button className="box" style={{ width: "100%", background: game.player.inShop.active[0] === 0 ? (game.player.inShop.active[1] === i + 1 ? "#a3a3a3" : "#d4d4d4") : "#d4d4d4" }}
      title={game.player.inShop.shop.buy.items[i].name}>
      <span style={{
        "textShadow": "0 0 " + game.player.inShop.shop.buy.items[i].color,
        "color": "rgba(0, 0, 0, " + game.player.inShop.shop.buy.items[i].transparency + ")"
      }}>
        {game.player.inShop.shop.buy.items[i].char}
      </span>
      <div className="inv_num">{"$" + game.player.inShop.shop.buy.costs[i]}</div>
      <div className={"status"} style={{ "margin-left": "100%", "top":"30%", color: game.player.inShop.shop.buy.stock ? game.player.inShop.shop.buy.stock[i] === 0 ? "#FF0000" : "#000000" : "#000000" }}>
        {(game.player.inShop.shop.buy.stock ? (game.player.inShop.shop.buy.stock[i] >= 0 ? game.player.inShop.shop.buy.stock[i] : "") : "")}
      </div>
    </button>
  }
  checkEquip(game) {
    //Checks if the active location has an equipment
    let p = game.player
    let equipmentLocation = p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length && p.inventory[p.inStats.active[1] - 1].equipment || p.inStats.active[0] === 0 && p.inStats.active[1] > 1 && p.equipment[p.inStats.active[1] === 3 ? "weapon" : "body"].item
    return equipmentLocation
  }
  getEquip(game) {
    //Returns the active equipment, assume the equipment is there
    let p = game.player
    if (p.inStats.active[0] === 0) {
      if (p.inStats.active[1] === 2) {
        return p.equipment.body
      }
      else if (p.inStats.active[1] === 3) {
        return p.equipment.weapon
      }
    }
    else if (p.inStats.active[0] === 1) {
      return p.inventory[p.inStats.active[1] - 1]
    }
    return null
  }
  drawStats(game, i) {
    return <div>
      <div style={{ position: "absolute", width: "100%", "margin-left": "0%" }}></div>
      {this.drawStatSquares(game, 0, 0)}
    </div>
  }
  drawStatSquares(game, i, k) {
    let p = game.player
    if (k === 0) {
      return <div style={{ position: "absolute", width: "100%", height: "100%", "margin-left": "3%", display: "flex", "flex-direction": "row", "flex-wrap": "wrap" }}>
        <div style={{ position: "absolute", width: "40%", "margin-top": "4%", "white-space": "pre-wrap", "line-height": "100%", "background": "rgba(100,100,100,0.1", "fontSize": "2vw" }}>
          {this.checkEquip(game) ? this.getEquip(game).name + "\n" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? p.inventory[p.inStats.active[1] - 1].name : "Level: " + p.XP.level + "\n"}
          {this.checkEquip(game) ? "" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? p.inventory[p.inStats.active[1] - 1].description ? ": \n\n" + p.inventory[p.inStats.active[1] - 1].description : "" : "HP: " + p.health + "/" + p.maxHealth + "\n"}
          {this.checkEquip(game) ? "" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? "" : "Mana: " + p.mana + "/" + p.maxMana}<br></br>
          {this.checkEquip(game) ? "" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? "" : "XP: " + (p.XP.next - (p.XP.nextLevel - p.XP.total)) + "/" + p.XP.next + "\n"}
          {this.checkEquip(game) ? (this.getEquip(game).equipment.melee >= 0 ? "melee:   +" : "melee:   ") + this.getEquip(game).equipment.melee + "\n" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? "" : "melee: " + getStat(p, "melee") + "\n"}
          {this.checkEquip(game) ? (this.getEquip(game).equipment.ranged >= 0 ? "ranged:  +" : "ranged:  ") + this.getEquip(game).equipment.ranged + "\n" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? "" : "ranged: " + getStat(p, "ranged") + "\n"}
          {this.checkEquip(game) ? (this.getEquip(game).equipment.defense >= 0 ? "defense: +" : "defense: ") + this.getEquip(game).equipment.defense + "\n" : p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? "" : "defense: " + getStat(p, "defense")}
        {this.checkEquip(game) ? this.getEquip(game).equipment.status ? "Effect: " + Object.keys(this.getEquip(game).equipment.status).toString() : this.getEquip(game).equipment.immunity ? "Resist: " + Object.keys(this.getEquip(game).equipment.immunity).toString() : "" : "" }</div><br></br>
        <div style={{ position: "absolute", height: "65%", width: "20%", display: "flex", "flex-direction": "column", "margin-top": "35%" }}>
          {this.drawStatSquares(game, 0, 1)}
          {this.drawStatSquares(game, 1, 1)}
          {this.drawStatSquares(game, 2, 1)}
        </div>
        <div style={{ position: "absolute", "width": "60%", height: "65%", "margin-top": "-3%", "margin-left": "40%", "line-height": "100%", "justify-content": "left" }}>
          {
            /*
            " " + "Sell:" + (p.inStats.active[0] === 1 && p.inStats.active[1] <= p.inventory.length ? (p.inventory[p.inStats.active[1] - 1].name in p.inStats.shop.sell ? " $" + p.inStats.shop.sell[p.inventory[p.inShop.active[1] - 1].name] : " ?") : "") */
          }<br></br>
          {this.drawBoxes(0, 24, p.inStats.active[0] === 1 ? p.inStats.active[1] : -1)}
        </div>
      </div>
    }
    let color = ""
    let transparency = "1"
    let title = ""
    let char = emptyEmoji
    switch (i) {
      case 0:
        color = p.color
        title = p.name
        transparency = p.transparency
        char = p.char
        break;
      case 1:
        if (p.equipment.body) {
          color = p.equipment.body.color
          title = p.equipment.body.name
          transparency = p.equipment.body.transparency
          char = p.equipment.body.char
        }
        break;
      case 2:
        if (p.equipment.weapon) {
          color = p.equipment.weapon.color
          title = p.equipment.weapon.name
          transparency = p.equipment.weapon.transparency
          char = p.equipment.weapon.char
        }
        break;
    }
    // <div className="inv_num">{"$" + p.inShop.shop.buy.costs[i]}</div> //this if for top left stuff after span
    return <button className="box" style={{ width: "90%", "margin-left": "40%", background: p.inStats.active[0] === 0 ? (p.inStats.active[1] === i + 1 ? "#a3a3a3" : "#d4d4d4") : "#d4d4d4" }}
      title={title}>
      <span style={{
        "textShadow": "0 0 " + color,
        "color": "rgba(0, 0, 0, " + transparency + ")"
      }}>
        {char}
      </span>

    </button>
  }

  //make drawStatSquares

  tinyBoard(i, k, rows, columns, real, debug) {
    if (i < rows - 1 && real === 1) {
      return <div style={{ display: "inline" }}>
        {this.tinyBoard(i, columns - 1, rows, columns, 0, debug)}<br></br>
        {this.tinyBoard(i + 1, columns - 1, rows, columns, 1, debug)}
      </div>
    }
    else if (k > -1) {
      return <div style={{ display: "inline" }}>
        {this.tinyBoard(i, k - 1, rows, columns, 0, debug)}
        <button className="box" style={{
          height: (94 / game.board[0].length) + "%", "border-style": "none", "fontSize": "0px", width: (94 / game.board.length) + "%", margin: "0%", padding: "0%",
          //background: (game.board[k][i] === 1 ? "black" : "#d4d4d4")
          background: (game.displayMap.colors[(debug ? game.board[k][i] : game.displayMap.board[k][i])])
        }}>
        </button>
      </div>
    }
    else return
  }
  drawSpells(i, k, n, active, start) {
    if (start === 1) {
      return <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div className="outerLog" style={{ overflow: "hidden", position: "absolute", left: "5%", top: "5%", width: "100%", height: "88%" }}>
          <div className="innerLog" style={{ overflow: "hidden" }}>
            <div>
              {this.drawSpells(active - 1, 0, n, active, 0)}
            </div>
          </div>
        </div>
      </div>
    }
    else if (i < game.player.spells.length && i >= 0 && k < n) {
      return <div>
        <button className="bar" style={{ background: (i === active ? "#a3a3a3" : "#bfbfbf") }}>
          <h1 style={{ color: game.player.spells[i].color }}>{game.player.spells[i].displayName}</h1>
          <p>{game.player.spells[i].mana + ": " + game.player.spells[i].description}</p>
        </button>
        {this.drawSpells(i + 1, k + 1, n, active, 0)}
      </div>
    }
    else if (i < active && k < n) {
      let old_i = i
      i = game.player.spells.length - 1
      return <div>
        <button className="bar" style={{ background: (i === active ? "#a3a3a3" : "#bfbfbf") }}>
          <h1 style={{ color: game.player.spells[i].color }}>{game.player.spells[i].displayName}</h1>
          <p>{game.player.spells[i].mana + ": " + game.player.spells[i].description}</p>
        </button>
        {this.drawSpells(old_i + 1, k + 1, n, active, 0)}
      </div>
    }
    else if (i > game.player.spells.length - 1 && k < n) {
      let old_i = i
      i = i - game.player.spells.length
      return <div>
        <button className="bar" style={{ background: (i === active ? "#a3a3a3" : "#bfbfbf") }}>
          <h1 style={{ color: game.player.spells[i].color }}>{game.player.spells[i].displayName}</h1>
          <p>{game.player.spells[i].mana + ": " + game.player.spells[i].description}</p>
        </button>
        {this.drawSpells(old_i + 1, k + 1, n, active, 0)}
      </div>
    }
    else {
      return
    }
  }
  drawBoxes(i, k, active) {
    if (i === 0) { //The first line has to return all boxes, as they must be part of the same div
      return <div style={{ height: "100%" }}>
        {this.drawBoxes(i + 1, k, active)}
        {this.drawBoxes(i + 2, k, active)}
        {this.drawBoxes(i + 3, k, active)}
        {this.drawBoxes(i + 4, k, active)}
        {this.drawBoxes(i + 5, k, active)}
        {this.drawBoxes(i + 6, k, active)}
        {this.drawBoxes(i + 7, k, active)}
        {this.drawBoxes(i + 8, k, active)}
        {this.drawBoxes(i + 9, k, active)}
        {this.drawBoxes(i + 10, k, active)}
        {this.drawBoxes(i + 11, k, active)}
        {this.drawBoxes(i + 12, k, active)}
        {this.drawBoxes(i + 13, k, active)}
        {this.drawBoxes(i + 14, k, active)}
        {this.drawBoxes(i + 15, k, active)}
        {this.drawBoxes(i + 16, k, active)}
        {this.drawBoxes(i + 17, k, active)}
        {this.drawBoxes(i + 18, k, active)}
        {this.drawBoxes(i + 19, k, active)}
        {this.drawBoxes(i + 20, k, active)}
        {this.drawBoxes(i + 21, k, active)}
        {this.drawBoxes(i + 22, k, active)}
        {this.drawBoxes(i + 23, k, active)}
        {this.drawBoxes(i + 24, k, active)}
      </div>
    } else {
      return <button className="box" style={{ background: (i === active ? "#a3a3a3" : "#d4d4d4") }}
        title={(charInArr(game.player.inventory, i - 1) === emptyEmoji ? "" : objectSummary(game.player.inventory[i - 1]))}
      >
        <span style={{
          "textShadow": "0 0 " + colorInArr(game.player.inventory, i - 1),
          "color": "rgba(0, 0, 0, " + transparencyInArr(game.player.inventory, i - 1) + ")"
        }}>
          {charInArr(game.player.inventory, i - 1)}
        </span>
        <div className="inv_num">{i}</div>
      </button>
    }
  }
  drawRow(game, x, y) {
    if (y < game.camera.h) {

      return <div>
        <div className="board-row">
          {this.drawSquare(game, x + 1, y)}
        </div>
        {this.drawRow(game, -1, y + 1)}
      </div>
    } else {
      return
    }
  }
  /*
  this.renderSquare(game.camera.board[x][y].object.char, game.camera.board[x][y].object.status, game.camera.board[x][y].object.damage, game.camera.board[x][y].color)}
  */
  drawSquare(game, x, y) {
    //console.log(x,y)
    if (x < game.camera.w) {
      return <>
        {
          this.renderSquare(game.camera.board[x][y])}

        {this.drawSquare(game, x + 1, y)}
      </>
    } else {
      return
    }
  }
  render() {
    let out = update(game)
    if (out) {
      //game = out
      //update(game)
    }
    return (
      this.drawBoard(game, 0)
    );
  }
}

class StartUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", entered: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getName = this.getName.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value, entered: false });
  }

  handleSubmit(event) {
    this.setState({ value: this.state.value, entered: true });
    event.preventDefault();
  }
  getName() {
    return this.state.value;
  }
  render() {
    if (this.state.entered) {
      game = createGame(1);
      return (
        <Game
          name={this.state.value}
        />
      );
    }
    return (
      <div className="entry">
        <img className="logo" src="https://i.imgur.com/V68ibrh.png" alt="QDungeonLogo"></img>
        <form onSubmit={this.handleSubmit}>
          <label>
            Player Name:
            <input className="entryField" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <button className="playButton" type="submit">Play</button>
        </form>
      </div>
    );
  }
}

function Game(props) {
  game.player.name = props.name;
  const [values, setValues] = useState({ counter: 0 });
  //Processes the keypress and returns the resulting boardstate
  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true)
  }, []);
  const detectKeyDown = (e) => {
    let p = game.player
    //console.log("Clicked key: ", e.key);
    setValues({ counter: values.counter + 1 });
    if (e.key === "ArrowUp") {
      p.input = "up"
    }
    if (e.key === "ArrowDown") {
      p.input = "down"
    }
    if (e.key === "ArrowRight") {
      p.input = "right"
    }
    if (e.key === "ArrowLeft") {
      p.input = "left"
    }
    if (e.key === "p") {
      p.input = "pickup"
    }
    if (e.key === "i") {
      p.input = "stats"
    }
    if (isFinite(e.key)) {
      p.input = parseInt(e.key);
    }
    if (e.key === "s") {
      p.input = "spell"
    }
    if (e.key === " ") {
      p.input = "wait"
    }
    if (e.key === "d") {
      p.input = "drop"
    }
    if (e.key === "m") {
      game.displayMap.check = !game.displayMap.check
    }
    if (e.key === "Escape") {
      if (game.displaySpells.check) {
        game.displaySpells.check = false
      }
      if (p.rangedInProgress.check) {
        p.input = "wait"
      }
      if (game.displayMap.check) {
        game.displayMap.check = false;
        p.input = null;
      }
      if (p.inShop.check) {
        p.inShop.check = false;
        p.inShop.active[0] = 0;
        p.inShop.active[1] = 1;
      }
      if (p.inStats.check) {
        p.inStats.check = false;
        p.inStats.active[0] = 0;
        p.inStats.active[1] = 1;
      }
    }
    if (e.key === "Enter") {
      p.input = "pickup"
      if (game.displaySpells.check) {
        p.input = game.displaySpells.active
      }
      if (p.rangedInProgress.check) {
        p.input = "spell"
      }
      if (game.displayMap.check) {
        game.displayMap.check = false;
        p.input = null;
      }
      if (p.inShop.check || p.inStats.check || game.class.name === "none") {
        p.input = "select"
      }
    }
    //Store game in storage
    //localStorage.game = JSON.stringify(game)
  }
  return (
    <Board
      value={values.board}
    />
  );
}
/*
Wraps the board within a Game functional component in order to be able to run EventListeners for the whole window.
*/

let emojis = ["🧝", "🧙‍♂️", "🤴", "🥷", "🧑‍🌾",
  "🦧", "🦇", "🦉", "🦭", "🐙", "🐌", "🪲", "🪳", "🕷️", "🕸️", "🦂", "🪰", "🦠", "🗿", "🦞", "🦑", "👹", "💀", "🐉", "🧚", "🧚‍♀️", "🧚‍♂️", "🧛‍♂️", "🧟", "🤺", "🐀", "🦔", "🦅", "🦉",
  "🌲", "🌳", "🌴", "🌵", "🌾", "🍄", "🌻", "🌹", "🌷", "🌼",
  "🧊", "🏺", "🧭", "🌋", "🏛️", "🪨", "🪵", "🛖", "🏚️", "🏯", "🏰", "⛩️", "⛪", "⛲", "🚪", "🪦",
  "🌪️", "🌀", "⚡", "🔥", "❄️", "🔮", "💎", "💍", "🕯️", "📕", "📗", "📘", "📙", "📚", "💰", "🪙", "🔒", "🔓", "🔑", "🗝️", "🧪", "⛏️", "🪓", "🗡️", "⚔️", "💣", "🪃", "🏹", "🛡️", "⚖️", "💥", "🕳️", "📜", "🧨", "⚗️", "🔱"];


//blank emoji char: "󠀠 "


// get key
console.log("start")
if (localStorage.highscore === undefined) {
  localStorage.highscore = -1
}
if (localStorage.highscoreName === undefined) {
  localStorage.highscoreName = "none"
}
console.log(localStorage.highscore);
//to clear localstorage
//delete localStorage.highscore;
let emptyEmoji = "󠀠‎"
let game = createGame(1);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StartUp />
  </React.StrictMode>
)
