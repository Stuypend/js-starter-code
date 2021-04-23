//global variables
let board = []
let score = 0
let usersPath = "http://localhost:3000/users"
const scorePath = "http://localhost:3000/scores"
let user = {}
let currentPiece = ""


let pieces = [
    { coordinates: [ [0,0], [0,1], [1,0], [1,1] ], color: "yellow", letter: "O", position: 1},
    { coordinates: [ [0,0], [0,1], [0,2], [0,3] ], color: "blue", letter: "I", position: 1},
    { coordinates: [ [0,0], [0,1], [1,1], [1,2] ], color: "red", letter: "Z", position: 1},
    { coordinates: [ [1,0], [1,1], [0,1], [0,2] ], color: "green", letter: "S", position: 1},
    { coordinates: [ [1,0], [1,1], [1,2], [0,2] ], color: "orange", letter: "L", position: 1},
    { coordinates: [ [0,0], [1,0], [1,1], [1,2] ], color: "pink", letter: "J", position: 1},
    { coordinates: [ [1,0], [1,1], [0,1], [1,2] ], color: "purple", letter: "T", position: 1}   
]



document.addEventListener('DOMContentLoaded', () => {


    let table = initializeBoard()
    let rowsCleared = 0
    getHighScores()

    document.querySelector("#username-form").addEventListener("submit", event => {
        event.preventDefault()

        user.name = event.target.username.value

        fetch(usersPath)
            .then(getResponse)
            .then(userNameLookUp)
        
        document.querySelector("h4").textContent = ``

        document.addEventListener("keydown", event => {
            if (event.code == "ArrowLeft") {
                moveLeft(currentPiece)
            } else if (event.code == "ArrowRight") {
                moveRight(currentPiece)
            } else if (event.code == "ArrowDown") {
                moveDown(currentPiece)
            } else if (event.code == "Space") {
                // console.log("Space")
                rotate()
            }
        });

        addNewPiece()

        let timer = setInterval(() => {
            moveDown(currentPiece)
            let clearMultiplier = 0
            if (isCollision(currentPiece)) {
                for (let i = 0; i < coords.length; i++) {
                    if (isRowFull(coords[i][0])) {
                        clearRow(coords[i][0])
                        clearMultiplier++
                        rowsCleared++
                    }
                }
                awardPoints(clearMultiplier, rowsCleared)
                if (!addNewPiece()) {
                    console.log("GAME OVER")
                    // debugger
                    pushScore(score)
                    clearInterval(timer)
                }
            }
        }, 1000)


        document.querySelector("#update-name-form").addEventListener("submit", event => {
            event.preventDefault()
            user.name = event.target.newusername.value
            updateName(user.name)
        })

        document.querySelector("#user-score-list").addEventListener("click", event => {
            event.preventDefault()
            deleteScore(event.target.dataset.scoreId)
            event.target.parentElement.remove()
        })
    })
})

function updateName(username) {
    patchObj = { method: "PATCH", headers: { "Content-Type": "application/json", "Accept": "application/json"} , body: JSON.stringify({username}) }
    // debugger
    fetch(`${usersPath}/${user.id}`, patchObj)
        .then(getResponse)
        .then(noOneisReallySureWhatThisThingIsActually => console.log(noOneisReallySureWhatThisThingIsActually))


}


function pushScore(score) {
    const user_id = user.id
    postObj = { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json"} , body: JSON.stringify({score, user_id}) }
    fetch(scorePath, postObj)
        .then(response => response.json())
        .then(noOneisReallySureWhatThisThingIsActually => console.log(noOneisReallySureWhatThisThingIsActually))
}

function deleteScore(id){
    deleteObj = { method: "DELETE", headers: { "Content-Type": "application/json", "Accept": "application/json"} , body: JSON.stringify({id}) }
    fetch(`${scorePath}/${id}`, deleteObj)
        .then(getResponse)
        .then(res => res)
}

function getUserScore(){

    fetch(`${usersPath}/${user.id}`)
        .then(getResponse)
        .then(scores => {
            document.querySelector("#user-score-header").textContent = `${user.name}'s Scores`
            for(let i = 0; i < scores.length; i++){
                let li = document.createElement("li")
                li.textContent = scores[i].score
                deleteButton = document.createElement("button")
                deleteButton.dataset.scoreId = scores[i].id
                deleteButton.textContent = "x"
                li.append(deleteButton)
                document.querySelector("#user-score-list").append(li)
            }
        })
}

function getHighScores(){

    fetch(scorePath)
        .then(getResponse)
        .then(scores => {
            highScores = document.querySelector(".scores")
            highScores.style.backgroundColor = "yellow"
            for(let i = 0; i < scores.length; i++){
                let tr = document.createElement("tr")
                
                let score = document.createElement("td")
                let user = document.createElement("td")
                let date = document.createElement("td")

                score.textContent = scores[i].score
                user.textContent = scores[i].username
                date.textContent = scores[i].date

                tr.append(user, score, date)

                highScores.append(tr)
            }
        })

}





function createUser(username)
{
    return { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json"} , body: JSON.stringify({username}) }
}

function getUsers() {

    return { method: "GET", headers: { "Content-Type": "application/json", "Accept": "application/json" } }
}


function getResponse(response)
{
    return response.json()
}

function setUser(json)
{
    user.id = json.id
    getUserScore()
}

function userNameLookUp(json)
{
    // debugger
    for(let i = 0; i < json.length; i++)
    {
        if(json[i].username == user.name)
        {
            user.id =  json[i].id
            getUserScore()
            return
            }
    }

    fetch(usersPath, createUser(user.name))
        .then(getResponse)
        .then(setUser)
}

function awardPoints(multi, rows)
{
    let level = Math.floor(rows/10)
    score += 40 * multi * (level+1)

    document.querySelector("h3").textContent = `Score: ${score} Level: ${level}`
}

function initializeBoard()
{
    let table = document.querySelector(".board")

    for (let row = 0; row < 20; row++)
    {
        board.push([])
        let newRow = document.createElement("tr")
        newRow.dataset.row = row

        for (let col = 0; col < 10; col++) //columns
        {
            board[row][col] = "gray"
            let cell = document.createElement("td")
            cell.dataset.row = row
            cell.dataset.col = col
            newRow.append(cell)
        }
        table.append(newRow)
    }
    return table
}

function addNewPiece()
{

    
    currentPiece = JSON.parse(JSON.stringify(pieces[getRandomInt(0, pieces.length)]));
    // currentPiece = JSON.parse(JSON.stringify(pieces[6]));

    let num = board[0].length - currentPiece.coordinates[3][1]
    let randInt = getRandomInt(0, num)

    for (let i = 0; i < 4; i++) {
        currentPiece.coordinates[i][1] += randInt
    }

    updateBoard(currentPiece)

    return !isCollision(currentPiece)

}



function isInBounds(piece, move)
{
    let coords =  piece.coordinates

    switch (move)
    {
        case "right":
            for(let i = 0; i < coords.length; i++)
            {
                if (coords[i][1] + 1 > board[0].length)
                    return false;
            }
            break;

        case "left":
        {
            for(let i = 0; i < coords.length; i++)
            {
                if (coords[i][1] - 1 < 0)
                    return false;

            }
            break;
        }

        case "down":
        {
            for (let i = 0; i < coords.length; i++)
            {
                if (coords[i][0] + 1 >= board.length)
                    return false;

            }
            break;
        }
    }
    return true
}

function isOpen(piece, move)
{
    let coords =  piece.coordinates

    switch (move) {
        case "right":
            for (let i = 0; i < coords.length; i++)
            {
                if (!isMe(piece, [coords[i][0],coords[i][1]+1]) && board[coords[i][0]][coords[i][1]+1] != "gray")
                    return false
            }
            break;
        case "left":
            for (let i = 0; i < coords.length; i++)
            {
                if (!isMe(piece, [coords[i][0],coords[i][1]-1]) && board[coords[i][0]][coords[i][1]-1] != "gray")
                    return false
            }
            break;
        case "down":
             for (let i = 0; i < coords.length; i++)
            {
                if (!isMe(piece, [coords[i][0]+1,coords[i][1]]) && board[coords[i][0]+1][coords[i][1]] != "gray")
                    return false
            }
            break;
    }
    return true
}

function moveRight(piece)
{
    
    if (isInBounds(piece, "right") && isOpen(piece, "right"))
    {
        
        piece.coordinates.forEach(coord => { // x and y coordindates
            updateCell(coord[0], coord[1]) //changing the table cell to gray
            coord[1]++
        });
        updateBoard(piece)
    }

}

function moveLeft(piece)
{
    if (isInBounds(piece, "left") && isOpen(piece, "left"))
    {
        piece.coordinates.forEach(coord => { // x and y coordindates
            updateCell(coord[0], coord[1])
            coord[1]--
        });
        updateBoard(piece)
    }

}

function moveDown(piece)
{
    if (isInBounds(piece, "down") && isOpen(piece, "down"))
    {
        piece.coordinates.forEach(coord => { // x and y coordindates
            updateCell(coord[0], coord[1])
            coord[0]++
        });
        updateBoard(piece)
    }

}

function updateBoard(pieceType) { // Updating Board and Table for an entire piece

    pieceType.coordinates.forEach(coord => { // x and y coordindate
        updateCell(coord[0], coord[1], pieceType.color)
    });

}

function updateCell(row, col, color="gray") // Updates One cell on Board and Table
{
    board[row][col] = color // updates board

    let tableRow = document.querySelector(`[data-row="${row}"]`)  // update table
    let tableCell = tableRow.querySelector(`[data-col="${col}"]`)  // update table

    tableCell.style.backgroundColor = color
}

function updateTable() // Updating All Cells on Board and Table
{
    for(let row = 0; row < board.length; row++)
    {
        for(let col = 0; col < board[row].length; col++)
        {
            updateCell(row, col, board[row][col])
        }
    }
}

function isMe(piece, newCoords) { //newCoords is an array of new location
    coords = piece.coordinates
    for ( let i = 0; i < coords.length; i++) {
        if (coords[i][0] == newCoords[0] && coords[i][1] == newCoords[1]) {
            return true
        }
    }
    return false
}

function isCollision(piece) { //returns true if there is a collision

    let coords = piece.coordinates

    for (let i = 0; i < coords.length; i++)
        {
            let row = coords[i][0] + 1 
            let col = coords[i][1]
            // debugger
            if (!isInBounds(piece, "down")) {
                return true
            } else if (!isMe(piece, [row, col]) && board[row][col] != "gray") {
                return true
            }
        } 
    return false 
}

function isRowFull(row)
{
    for(let col = 0; col < board[row].length; col++)
    {
        if (board[row][col] == "gray")
            return false
    }
    return true;
}

function clearRow(startRow)
{
    for(let row = startRow; row-1 >= 0; row--)
    {
        for(let col = 0; col < board[row].length; col++)
        {
            board[row][col] = board[row-1][col]
        }
    }

    for(let col = 0; col < board[0].length; col++)
    {
        board[0][col] = "gray"
    }
   updateTable()
}

function moveDownFive() { // Bonus; not for prime time
    for (let i =0; i < 9; i++) {
        moveDown(currentPiece)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function isRotateValid(newCoords)
{
    for (let i = 0; i < newCoords.length; i++)
    {
        if (!isMe(currentPiece, [newCoords[i][0],newCoords[i][1]]) && board[newCoords[i][0]][newCoords[i][1]] != "gray")
            return false

    }
    return true;
}

function rotate()
{
    let coords = currentPiece.coordinates

    switch (currentPiece.letter)
    {
        case "I":
        {
            // debugger
            if(currentPiece.position == 1)
            {
               let newCoords = [ [coords[0][0]-1, coords[0][1]+2], [coords[1][0], coords[1][1]+1], [coords[2][0]+1, coords[2][1]], [coords[3][0]+2, coords[3][1]-1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }
                // return false
                
            }
            else
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]-2], [coords[1][0], coords[1][1]-1], [coords[2][0]-1, coords[2][1]], [coords[3][0]-2, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position--
                    updateBoard(currentPiece)
                }
            }
            break;
        }
        case "Z":
        {
            if(currentPiece.position == 1)
            {
               let newCoords = [ [coords[0][0], coords[0][1]+2], [coords[1][0]+1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]-1]]
            //    debugger
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 2)
            {
               let newCoords = [ [coords[0][0]+2, coords[0][1]], [coords[1][0]+1, coords[1][1]-1], [coords[2][0], coords[2][1]], [coords[3][0]-1, coords[3][1]-1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 3)
            {
               let newCoords = [ [coords[0][0], coords[0][1]-2], [coords[1][0]-1, coords[1][1]-1], [coords[2][0], coords[2][1]], [coords[3][0]-1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            }
            else if(currentPiece.position == 4)
            {
               let newCoords = [ [coords[0][0]-2, coords[0][1]], [coords[1][0]-1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position = 1
                    updateBoard(currentPiece)
                }  
            }
            break;
        }
        case "S":
        {
            if(currentPiece.position == 1)
            {
                // let newCoords = [ [coords[0][0], coords[0][1]+2], [coords[1][0]+1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]-1]] // Z
            //    debugger
                let newCoords = [ [coords[0][0]-1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]+1], [coords[3][0]+2, coords[3][1]]] // S
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 2)
            {
                // let newCoords = [ [coords[0][0]+2, coords[0][1]], [coords[1][0]+1, coords[1][1]-1], [coords[2][0], coords[2][1]], [coords[3][0]-1, coords[3][1]-1] ]
                let newCoords = [ [coords[0][0]+1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]-1], [coords[3][0], coords[3][1]-2] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 3)
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]-1], [coords[3][0]-2, coords[3][1]] ]
                // debugger
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            }
            else if(currentPiece.position == 4)
            {
                // let newCoords = [ [coords[0][0]-2, coords[0][1]], [coords[1][0]-1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]+1] ]
                let newCoords = [ [coords[0][0]-1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]+1], [coords[3][0], coords[3][1]+2] ]
                // debugger
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position = 1
                    updateBoard(currentPiece)
                }  
            }
            break;
        }
        case "L": // same as s--- OTHER LETTERS ARE FALLING INTO THIS
        {
            // debugger
            if(currentPiece.position == 1)
            {
                let newCoords = [ [coords[0][0]-1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]-1], [coords[3][0]+2, coords[3][1]]] 
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 2)
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]-1], [coords[3][0], coords[3][1]-2] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 3)
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]+1], [coords[3][0]-2, coords[3][1]] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            }
            else if(currentPiece.position == 4)
            {
                let newCoords = [ [coords[0][0]-1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]+1], [coords[3][0], coords[3][1]+2] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position = 1
                    updateBoard(currentPiece)
                }  
            }
            break;
        }
        case "J":
        {
            if(currentPiece.position == 1)
            {
                let newCoords = [ [coords[0][0], coords[0][1]+2], [coords[1][0]-1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]-1]]
            //    debugger
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 2)
            {
                let newCoords = [ [coords[0][0]+2, coords[0][1]], [coords[1][0]+1, coords[1][1]+1], [coords[2][0], coords[2][1]], [coords[3][0]-1, coords[3][1]-1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 3)
            {
                let newCoords = [ [coords[0][0], coords[0][1]-2], [coords[1][0]+1, coords[1][1]-1], [coords[2][0], coords[2][1]], [coords[3][0]-1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            }
            else if(currentPiece.position == 4)
            {
                let newCoords = [ [coords[0][0]-2, coords[0][1]], [coords[1][0]-1, coords[1][1]-1], [coords[2][0], coords[2][1]], [coords[3][0]+1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position = 1
                    updateBoard(currentPiece)
                }  
            }
            break;
        }
        case "T":
        {
            if(currentPiece.position == 1)
            {
                // debugger
                let newCoords = [ [coords[0][0]-1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]+1], [coords[3][0]+1, coords[3][1]-1]]
              
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 2)
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]+1], [coords[1][0], coords[1][1]], [coords[2][0]+1, coords[2][1]-1], [coords[3][0]-1, coords[3][1]-1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            } else if(currentPiece.position == 3)
            {
                let newCoords = [ [coords[0][0]+1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]-1], [coords[3][0]-1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position++
                    updateBoard(currentPiece)
                }  
            }
            else if(currentPiece.position == 4)
            {
                let newCoords = [ [coords[0][0]-1, coords[0][1]-1], [coords[1][0], coords[1][1]], [coords[2][0]-1, coords[2][1]+1], [coords[3][0]+1, coords[3][1]+1] ]
                if (isRotateValid(newCoords)) {
                    for (let i = 0; i < coords.length; i++) {
                        updateCell(coords[i][0], coords[i][1])
                    }
                    currentPiece.coordinates = newCoords
                    currentPiece.position = 1
                    updateBoard(currentPiece)
                }  
            }
            break;
        }
            
    }
    
}



