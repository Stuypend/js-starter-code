//global variables
let board = []
// let table = document.querySelector(".board")

let pieces = [
    { coordinates: [ [0,0], [0,1], [1,0], [1,1] ], color: "yellow", letter: "O"},
    { coordinates: [ [0,0], [0,1], [0,2], [0,3] ], color: "blue", letter: "I"},
    { coordinates: [ [1,0], [1,1], [0,1], [0,2] ], color: "red", letter: "S"},
    { coordinates: [ [0,0], [0,1], [1,1], [1,2] ], color: "green", letter: "Z"},
    { coordinates: [ [0,0], [1,0], [2,0], [2,1] ], color: "orange", letter: "L"},
    { coordinates: [ [0,2], [1,2], [1,1], [0,1] ], color: "pink", letter: "J"},
    { coordinates: [ [0,0], [0,1], [0,2], [1,1] ], color: "purple", letter: "T"}
    
]

// setInterval(alert("alert"), 1000);

// let timer = setInterval(moveDown, 1000, currentPiece);

document.addEventListener('DOMContentLoaded', () => {


    let table = initializeBoard()
    let score = 0;

    document.addEventListener("keydown", event => {
            if (event.code == "ArrowLeft") {
                moveLeft(currentPiece)
            } else if (event.code == "ArrowRight") {
                moveRight(currentPiece)
            } else if (event.code == "ArrowDown") {
                moveDown(currentPiece)
            }
        });
    
    addNewPiece()

    let timer = setInterval(() => {
        moveDown(currentPiece)
        if (isCollision(currentPiece)) {
            for(let i =0; i < coords.length; i++) {
                if(isRowFull(coords[i][0])) {
                    clearRow(coords[i][0])
                }
            }
            if (!addNewPiece()) {
                console.log("GAME OVER")
                clearInterval(timer)
            }  
        }



    }, 1000)

})



function wait() {
    sleep(3000).then(() => { return true })
}

function message () {
    console.log("Hello World")
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
let currentPiece = ""

function initializeBoard()
{
    let table = document.querySelector(".board")

    for (let row = 0; row < 10; row++)
    {
        board.push([])
        let newRow = document.createElement("tr")
        newRow.dataset.row = row

        for (let col = 0; col < 4; col++) //columns
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
    // currentPiece = JSON.parse(JSON.stringify(pieces[0]));
    updateBoard(currentPiece)

    return !isCollision(currentPiece)

}

function updateBoard(pieceType) {

    pieceType.coordinates.forEach(coord => { // x and y coordindate
        updateCell(coord[0], coord[1], pieceType.color)
    });

}

// function timeStep() {
//     if (!isCollision(currentPiece)) {
//         moveDown(currentPiece)
//     }
// }

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
            // debugger
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
    // debugger
    if (isInBounds(piece, "down") && isOpen(piece, "down"))
    {
        piece.coordinates.forEach(coord => { // x and y coordindates
            updateCell(coord[0], coord[1])
            coord[0]++
        });
        updateBoard(piece)
    }

}

function updateCell(row, col, color="gray")
{
    board[row][col] = color

    let tableRow = document.querySelector(`[data-row="${row}"]`)
    let tableCell = tableRow.querySelector(`[data-col="${col}"]`)

    tableCell.style.backgroundColor = color
}

function updateTable()
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

function moveDownFive() {
    for (let i =0; i < 9; i++) {
        moveDown(currentPiece)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


