class Player {
    constructor(id, jopomon) {
        this.id = id;
        this.jopomon = jopomon;
        this.lastUpdate = Date.now();
    }

    updatePosition(x, y) {
        this.jopomon.x = x;
        this.jopomon.y = y;
        this.lastUpdate = Date.now();
    }
}
// startgame //
const sectionSelectAttack = document.getElementById("select-attack")
const sectionRestart = document.getElementById("reset")
const buttonselect = document.getElementById("button-select")
const buttonReset = document.getElementById("button-reset")
sectionRestart.style.display = "none"

// playerselectpet //
const sectionSelectPet = document.getElementById("select-pet")
const spanPlayerMascot = document.getElementById("player-mascot")

// selectEnemyPet //
const spanEnemyMascot = document.getElementById("enemy-mascot")

// combat //
const spanplayerLives = document.getElementById("player-lives")
const spanenemyLives = document.getElementById("enemy-lives")

// createMessage //
const sectionMessages = document.getElementById("result")
const playerAttacks = document.getElementById("player-attacks")
const enemyAttacks = document.getElementById("enemy-attacks")

// cardContainer //
const cardContainer = document.getElementById("cardContainer")

// attacksContainer //
const attacksContainer = document.getElementById("attacksContainer")

// map //
const sectionSeeMap = document.getElementById("see-map")
const map = document.getElementById("map")

let enemiesInGame = []
let playerId = null
let enemyId = null
let jopomons = []
let playerAttack = []
let enemyAttack = []
let optionOfJopomons
let inputHipodoge
let inputCapipepo
let inputRatigueya
let inputLangostelvis
let inputTucapalma
let inputPydos
let playerMascot
let playerMascotObject
let jopomonAttacks
let jopomonEnemyAttacks
let fireButton
let waterButton
let landButton
let buttons = []
let indexplayerAttack
let indexenemyAttack
let playerVictories = 0
let enemyVictories = 0
let playerLives = 3
let enemyLives = 3
let canvas = map.getContext("2d")
let interval
let backgroundMap = new Image()
backgroundMap.src = "./images/JopomonMap.png"
let heightWeAreLookingFor
let mapWidth = window.innerWidth - 20
const maximumMapWidth = 650

if (mapWidth > maximumMapWidth) {
    mapWidth = maximumMapWidth - 20
}

heightWeAreLookingFor = mapWidth * 600 / 800

map.width = mapWidth
map.height = heightWeAreLookingFor

class Jopomon {
    constructor(name, image, lives, imageMap, id = null) {
        this.id = id
        this.name = name
        this.image = image
        this.lives = lives
        this.attacks = []
        this.height = 40
        this.width = 40
        this.x = random(0, map.width - this.width)
        this.y = random(0, map.height - this.height)
        this.imageMap = new Image()
        this.imageMap.src = imageMap
        this.speedX = 0
        this.speedY = 0
    }

    paintMascot() {
        canvas.drawImage(
            this.imageMap,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

let hipodoge = new Jopomon("Hipodoge", "./images/Hipodoge.png", 5, "./images/Hipodoge1.png")
let capipepo = new Jopomon("Capipepo", "./images/Capipepo.png", 5, "./images/Capipepo1.png")
let ratigueya = new Jopomon("Ratigueya", "./images/Ratigueya.png", 5, "./images/Ratigueya1.png")
let langostelvis = new Jopomon("Langostelvis", "./images/Langostelvis.png", 5, "./images/Langostelvis1.png")
let tucapalma = new Jopomon("Tucapalma", "./images/Tucapalma.png", 5, "./images/Tucapalma1.png")
let pydos = new Jopomon("Pydos", "./images/Pydos.png", 5, "./images/Pydos1.png")

const HIPODOGE_ATTACKS = [
    { name: "💧", id: "button-water" },
    { name: "💧", id: "button-water" },
    { name: "💧", id: "button-water" },
    { name: "🔥", id: "button-fire" },
    { name: "🌿", id: "button-land" },
]

hipodoge.attacks.push(...HIPODOGE_ATTACKS)

const CAPIPEPO_ATTACKS = [
    { name: "🌿", id: "button-land" },
    { name: "🌿", id: "button-land" },
    { name: "🌿", id: "button-land" },
    { name: "💧", id: "button-water" },
    { name: "🔥", id: "button-fire" },
]

capipepo.attacks.push(...CAPIPEPO_ATTACKS)

const RATIGUEYA_ATTACKS = [
    { name: "🔥", id: "button-fire" },
    { name: "🔥", id: "button-fire" },
    { name: "🔥", id: "button-fire" },
    { name: "💧", id: "button-water" },
    { name: "🌿", id: "button-land" },
]

ratigueya.attacks.push(...RATIGUEYA_ATTACKS)

const LANGOSTELVIS_ATTACKS = [
    { name: "💧", id: "button-water" },
    { name: "💧", id: "button-water" },
    { name: "🌿", id: "button-land" },
    { name: "🔥", id: "button-fire" },
    { name: "🔥", id: "button-fire" },
]

langostelvis.attacks.push(...LANGOSTELVIS_ATTACKS)

const TUCAPALMA_ATTACKS = [
    { name: "🌿", id: "button-land" },
    { name: "🌿", id: "button-land" },
    { name: "🔥", id: "button-fire" },
    { name: "🔥", id: "button-fire" },
    { name: "💧", id: "button-water" },
]

tucapalma.attacks.push(...TUCAPALMA_ATTACKS)

const PYDOS_ATTACKS = [
    { name: "🔥", id: "button-fire" },
    { name: "🔥", id: "button-fire" },
    { name: "💧", id: "button-water" },
    { name: "💧", id: "button-water" },
    { name: "🌿", id: "button-land" },
]

pydos.attacks.push(...PYDOS_ATTACKS)

jopomons.push(hipodoge, capipepo, ratigueya, langostelvis, tucapalma, pydos)

function startgame() {
    sectionSelectAttack.style.display = "none"
    sectionSeeMap.style.display = "none"

    jopomons.forEach(jopomon => {
        optionOfJopomons = `
        <input type="radio" name="mascot" id=${jopomon.name} />    
            <label class="jopomon-card" for=${jopomon.name}>
                <p>${jopomon.name}</p>
                <img src=${jopomon.image} alt=${jopomon.name} />
            </label>
        `
        cardContainer.innerHTML += optionOfJopomons

        inputHipodoge = document.getElementById("Hipodoge")
        inputCapipepo = document.getElementById("Capipepo")
        inputRatigueya = document.getElementById("Ratigueya")
        inputLangostelvis = document.getElementById("Langostelvis")
        inputTucapalma = document.getElementById("Tucapalma")
        inputPydos = document.getElementById("Pydos")

    })    

    buttonselect.addEventListener("click" , playerselectpet)
    buttonReset.addEventListener("click" , restartGame)

    joinTheGame()
}

function joinTheGame() {
    fetch("http://yiras-macbook-air.local:8080/join")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (answer) {
                        console.log(answer)
                        playerId = answer
                    })
            }
        })
}

function playerselectpet() {
    
    if (inputHipodoge.checked) {
        spanPlayerMascot.innerHTML = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanPlayerMascot.innerHTML = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanPlayerMascot.innerHTML = inputRatigueya.id
    } else if (inputLangostelvis.checked) {
        spanPlayerMascot.innerHTML = inputLangostelvis.id
    } else if (inputTucapalma.checked) {
        spanPlayerMascot.innerHTML = inputTucapalma.id
    } else if (inputPydos.checked) {
        spanPlayerMascot.innerHTML = inputPydos.id
    } else {
        alert("Select a pet")
        return
    }

    sectionSelectPet.style.display = "none"

    playerMascot = spanPlayerMascot.innerHTML;
    playerMascotObject = getPetObject(playerMascot);
    // Enviar la posición de forma repetida cada 1 segundo hasta que inicie el juego
    setInterval(() => {
    sendPosition(playerMascotObject.x, playerMascotObject.y);
     }, 1000);
    sendPosition(playerMascotObject.x, playerMascotObject.y);
    selectMascot(playerMascot)
    extractAttacks(playerMascot);
    sectionSeeMap.style.display = "flex"
    mapStart()
}

function selectMascot(playerMascot) {
    fetch(`http://yiras-macbook-air.local:8080/jopomon/${playerId}`, {
       method: "post",
         headers: {
              "Content-Type": "application/json"
         },
            body: JSON.stringify({
                id: playerId,
                jopomon: playerMascot
            }) 
    })
}

function extractAttacks(playerMascot) {
    let attacks
    for (let i = 0; i < jopomons.length; i++) {
        if (playerMascot === jopomons[i].name) {
            attacks = jopomons[i].attacks
        }
    }
    showAttacks(attacks)
}

function showAttacks(attacks) {
    attacks.forEach((attack) => {
        jopomonAttacks = `
        <button id=${attack.id} class="button-attack BAttack">${attack.name}</button>
        `
        attacksContainer.innerHTML += jopomonAttacks
    })

    fireButton = document.querySelectorAll("#button-fire");
    waterButton = document.querySelectorAll("#button-water");
    landButton = document.querySelectorAll("#button-land");
    buttons = document.querySelectorAll(".BAttack")

}

function attackSequence() {
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                playerAttack.push("FIRE")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            } else if (e.target.textContent === "💧") {
                playerAttack.push("WATER")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            }  else { (e.target.textContent === "🌿") 
                playerAttack.push("LAND")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            }
            if (playerAttack.length === 5) {
                sendAtacks()
            }
        })    
    })
}

function sendAtacks() {
    fetch(`http://yiras-macbook-air.local:8080/jopomon/${playerId}/attacks`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            attacks: playerAttack
        })
    })

    interval = setInterval(getAttacks, 50)
}

function getAttacks() {
    fetch(`http://yiras-macbook-air.local:8080/jopomon/${enemyId}/attacks`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ attacks }) {
                        if (attacks.length === 5) {
                            enemyAttack = attacks
                            combat()
                        }
                    })
                }    
            })
    }
    
function selectEnemyPet(enemy) {
    spanEnemyMascot.innerHTML = enemy.name
    jopomonEnemyAttacks = enemy.attacks

    attackSequence()
}

function randomEnemyAtack() {
    let randomAttack = random(0,jopomonEnemyAttacks.length - 1)

    if (randomAttack == 0 || randomAttack == 1) {
        enemyAttack.push("FIRE")
    } else if (randomAttack == 3 || randomAttack == 4) {
        enemyAttack.push("WATER")
    } else {
        enemyAttack.push("LAND")
    }
    console.log(enemyAttack)
    startFight()
}
function startFight() {
    if (playerAttack.length === 5) {
    combat()
    }
}

function indexBothOpponents(player, enemy) {
    indexPlayerAttack = playerAttack[player]
    indexEnemyAttack = enemyAttack[enemy] 
}

function combat() {
    clearInterval(interval)
    
    for (let index = 0; index < playerAttack.length; index++) {
        if (playerAttack[index] === enemyAttack[index]) {
            indexBothOpponents(index, index)
            createMessage("It's a tie! 🤝")
        } else if 
            (playerAttack[index] === "FIRE" && enemyAttack[index] === "LAND") {
            indexBothOpponents(index, index)
            createMessage("You win! ✌🏻")
            playerVictories++
            spanplayerLives.innerHTML = playerVictories
        } else if 
            (playerAttack[index] === "WATER" && enemyAttack[index] === "FIRE") {
            indexBothOpponents(index, index)
            createMessage("You win! ✌🏻")
            playerVictories++
            spanplayerLives.innerHTML = playerVictories
        } else if
            (playerAttack[index] === "LAND" && enemyAttack[index] === "WATER") {
            indexBothOpponents(index, index)
            createMessage("You win! ✌🏻")
            playerVictories++
            spanplayerLives.innerHTML = playerVictories
        } else {
            indexBothOpponents(index, index)
            createMessage("You lose! ☠️")
            enemyVictories++
            spanenemyLives.innerHTML = enemyVictories
        } 
    }

    checkVictories()
}

function checkVictories() {
    if (playerVictories === enemyVictories) {
        createFinalMessage ("It's a tie! 🤝")
    } else if (playerVictories > enemyVictories) {
        createFinalMessage ("You win! ✌🏻")
    } else {
        createFinalMessage ("You lose! ☠️, Game Over")
    }
    enemiesInGame = [];   
}    

function createMessage(result) {
    
    let newplayerAttack = document.createElement('p')
    let newenemyAttack = document.createElement('p')

    sectionMessages.innerHTML = result
    newplayerAttack.innerHTML = indexPlayerAttack
    newenemyAttack.innerHTML = indexEnemyAttack

    playerAttacks.appendChild(newplayerAttack)
    enemyAttacks.appendChild(newenemyAttack) 
} 

function createFinalMessage(finalResult) {
    
    sectionMessages.innerHTML = finalResult

    sectionRestart.style.display = "block"
}

function restartGame(){
    //enemiesInGame = []
    location.reload()

}
    
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function paintCanvas() {
    playerMascotObject.y = playerMascotObject.y + playerMascotObject.speedY
    playerMascotObject.x = playerMascotObject.x + playerMascotObject.speedX
    canvas.clearRect(0, 0, map.width, map.height)
    canvas.drawImage(
        backgroundMap,
        0,
        0,
        map.width,
        map.height
    )
    
    playerMascotObject.paintMascot()

    sendPosition(playerMascotObject.x, playerMascotObject.y)

    enemiesInGame.forEach(function (enemy) {
        enemy.paintMascot()
        checkCollision(enemy)
    })
    
    if (playerMascotObject.speedX !== 0 || playerMascotObject.speedY !== 0) {
        enemiesInGame.forEach(enemy => {
            if (enemy && enemy.x !== undefined && enemy.y !== undefined) {
                checkCollision(enemy)
            }
        })
    }

}

function sendPosition(x, y) {
    fetch(`http://yiras-macbook-air.local:8080/jopomon/${playerId}/position`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function (data) {
                    if (data.collision) {
                        const enemy = new Jopomon(
                            data.collision.jopomon.name,
                            "./images/" + data.collision.jopomon.name + ".png",
                            5,
                            "./images/" + data.collision.jopomon.name + "1.png"
                        );
                        enemy.id = data.collision.id;
                        stopMovement();
                        clearInterval(interval);
                        sectionSelectAttack.style.display = "flex";
                        sectionSeeMap.style.display = "none";
                        selectEnemyPet(enemy);
                        return; // Detener procesamiento de enemigos normales si colisionaste
                    }
                    if (!data.enemies) {
                        console.warn("There are no enemies in the answer:", data);
                        enemiesInGame = [];
                        return;
                    }
                    console.log(data.enemies);
                    enemiesInGame = data.enemies.map(function (enemy) {
                        let jopomonEnemy = null
                        const jopomonName = enemy.jopomon?.name || ""
    
                        if (jopomonName === "Hipodoge") {
                            jopomonEnemy = new Jopomon("Hipodoge", "./images/Hipodoge.png", 5, "./images/Hipodoge1.png", enemy.id)
                        } else if (jopomonName === "Capipepo") {
                            jopomonEnemy = new Jopomon("Capipepo", "./images/Capipepo.png", 5, "./images/Capipepo1.png", enemy.id)
                        } else if (jopomonName === "Ratigueya") {
                            jopomonEnemy = new Jopomon("Ratigueya", "./images/Ratigueya.png", 5, "./images/Ratigueya1.png", enemy.id)
                        } else if (jopomonName === "Langostelvis") {
                            jopomonEnemy = new Jopomon("Langostelvis", "./images/Langostelvis.png", 5, "./images/Langostelvis1.png", enemy.id)
                        } else if (jopomonName === "Tucapalma") {
                            jopomonEnemy = new Jopomon("Tucapalma", "./images/Tucapalma.png", 5, "./images/Tucapalma1.png", enemy.id)
                        } else if (jopomonName === "Pydos") {
                            jopomonEnemy = new Jopomon("Pydos", "./images/Pydos.png", 5, "./images/Pydos1.png", enemy.id)
                        }
    
                        if (jopomonEnemy !== null) {
                            jopomonEnemy.x = enemy.x
                            jopomonEnemy.y = enemy.y
                        }
    
                        return jopomonEnemy
                    })
                })
        }
        })
}        

function moveUp() {
    playerMascotObject.speedY = -5
}
function moveDown() {
    playerMascotObject.speedY = 5
}
function moveRight() {
    playerMascotObject.speedX = 5
}
function moveLeft() {
    playerMascotObject.speedX = -5
}

function stopMovement() {
    playerMascotObject.speedX = 0
    playerMascotObject.speedY = 0
}

function aKeyWasPressed(event) {
    switch (event.key) {
        case "ArrowUp":
            moveUp()
            break
        case "ArrowDown":
            moveDown()
            break
        case "ArrowRight":
            moveRight()
            break
        case "ArrowLeft":
            moveLeft()
            break
        default:
            break    
    }
}

function mapStart() {
    
    playerMascotObject = getPetObject(playerMascot)
    sendPosition(playerMascotObject.x, playerMascotObject.y)
    interval = setInterval(paintCanvas, 50)

    window.addEventListener("keydown", aKeyWasPressed)

    window.addEventListener("keyup", stopMovement) 
}

function getPetObject() {
    for (let i = 0; i < jopomons.length; i++) {
        if (playerMascot === jopomons[i].name) {
            return jopomons[i]
        }
    }
    
}

function checkCollision(enemy) {
    const upEnemy = enemy.y
    const downEnemy = enemy.y + enemy.height
    const leftEnemy = enemy.x
    const rightEnemy = enemy.x + enemy.width
    const upMascot = playerMascotObject.y
    const downMascot = playerMascotObject.y + playerMascotObject.height
    const leftMascot = playerMascotObject.x
    const rightMascot = playerMascotObject.x + playerMascotObject.width
    if (downMascot < upEnemy || upMascot > downEnemy || rightMascot < leftEnemy || leftMascot > rightEnemy) {
        return
    }

    stopMovement()
    clearInterval(interval)
    console.log("Collision with enemy")
    enemyId = enemy.id
    sectionSelectAttack.style.display = "flex"
    sectionSeeMap.style.display = "none"
    selectEnemyPet(enemy)
}

window.addEventListener("load" , startgame)
// Server-side route handler for /jopomon/:playerId/position
// This function updates the player's position and cleans inactive players before sending the response.
function updatePlayerPosition(req, res) {
    // Assume 'players' is a global array of Player instances.
    const playerId = req.params.playerId;
    const { x, y } = req.body;
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.updatePosition(x, y);
    }

    // Clean inactive players (30 seconds without update)
    const now = Date.now();
    for (let i = players.length - 1; i >= 0; i--) {
        if (now - players[i].lastUpdate > 30000) { // 30 segundos sin actualizar
            console.log(`Eliminando jugador inactivo: ${players[i].id}`);
            players.splice(i, 1);
        }
    }

    // Send the list of active enemies (excluding the current player)
    const enemies = players.filter(p => p.id !== playerId);
    res.send({ enemies });
}