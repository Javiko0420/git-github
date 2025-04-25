const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const players = []

class Player {
    constructor(id) {
        this.id = id
    }

    assignJopomon(jopomon){
        this.jopomon = jopomon
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
     }

     assignAttacks(attacks) {
        this.attacks = attacks
     }
}

class Jopomon {
    constructor(name) {
        this.name = name
    }
}

app.get('/join', (req, res) => {
    const id = Math.random().toString(36).substr(2, 9)

    const player = new Player(id)

    players.push(player)

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.send(id)
})

app.post("/jopomon/:playerId", (req, res) => {
    const playerId = req.params.playerId || ""
    const name = req.body.jopomon || ""
    const jopomon = new Jopomon(name)

    const playerIndex = players.findIndex((player) => playerId === player.id)

    if (playerIndex >= 0) {
        players[playerIndex].assignJopomon(jopomon)
    }

    console.log(players)
    console.log(playerId)
    res.end()
})

app.post("/jopomon/:playerId/position", (req, res) => {
    const playerId = req.params.playerId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const playerIndex = players.findIndex((player) => playerId === player.id)

    if (playerIndex >= 0) {
        players[playerIndex].updatePosition(x, y)
    }

    const enemies = players
      .filter(player => player.id !== playerId && player.jopomon !== undefined)

    console.log("Connected players:", players)

    res.send({ enemies })
})

app.post("/jopomon/:playerId/attacks", (req, res) => {
    const playerId = req.params.playerId || ""
    const attacks = req.body.attacks || []

    const playerIndex = players.findIndex((player) => playerId === player.id)

    if (playerIndex >= 0) {
        players[playerIndex].assignAttacks(attacks)
    }

    res.end()
})

app.get("/jopomon/:playerId/attacks", (req, res) => {
    const playerId = req.params.playerId || ""
    const player = players.find((player) => player.id === playerId)

    console.log('Consulting attacks for: ${playerId}')

    res.send({
        attacks: player.attacks || []
    })
})

app.listen(8080, () => {
    console.log("Server is running")
})
