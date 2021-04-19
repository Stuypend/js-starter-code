//global variables
let board = []
// let table = document.querySelector(".board")

document.addEventListener('DOMContentLoaded', () => {

   

    let table = initializeBoard()
    console.log(board)

    addNewPiece(longPiece)

})



function initializeBoard()
{
    let table = document.querySelector(".board")

    for (let i = 0; i < 10; i++)
    {
        board.push([])
        let newRow = document.createElement("tr")
        newRow.dataset.row = i
        for (let j = 0; j < 5; j++) //columns
        {
            board[i][j] = "gray"
            let cell = document.createElement("td")
            cell.dataset.row = i
            cell.dataset.col = j
            newRow.append(cell)
        }
        table.append(newRow)
    }
    return table
}

function addNewPiece()
{
    // generate a piece
    updateBoard(longPiece)

    // call updateBoard
}

function updateBoard(pieceType) {

    pieceType.coordinates.forEach(coord => { // x and y coordindate
        updateCell(coord[0], coord[1], pieceType.color)
    });

}

let longPiece = { coordinates: [ [0,0], [0,1], [0,2], [0,3] ], color: "blue"}

function timeStep(pieceType) {
    pieceType.coordinates.forEach(coord => { // x and y coordindates
        // debugger
        board[coord[0]] [coord[1]] = "gray"
        updateCell(coord[0], coord[1])
        coord[0]++
    });
    addNextPiece(pieceType)

}

function isInBounds(piece, move)
{
    let coords =  piece.coordinates

   /* switch (move) {
        case "right":
            coords.forEach(coord => {
                if (coord[1] + 1 > board[0].length)
                    return false;

            })
            break;*/

        if(move == "left") {
            debugger
            coords.forEach(coord => {
                if (coord[1] - 1 < 0) {
                    return false;
                }

            })
        }
    /*
            break;
        case "down":
            coords.forEach(coord => {
                if (coord[0] + 1 > board[0][0].length)
                    return false;

            })
    }*/

    return true


}

function isOpen(piece, move)
{
    let coords =  piece.coordinates

    switch (move) {
        case "right":
            coords.forEach(coord => {
                if (board[coord[0]][coord[1]+1] != "gray")
                    return false

            })
            break;
        case "left":
            coords.forEach(coord => {
                if (board[coord[0]][coord[1]-1] != "gray")
                    return false

            })
            break;
        case "down":
            coords.forEach(coord => {
                if (board[coord[0]+1][coord[1]] != "gray")
                    return false

            })
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

function updateCell(row, col, color="gray")
{
    board[row][col] = color

    let tableRow = document.querySelector(`[data-row="${row}"]`)
    let tableCell = tableRow.querySelector(`[data-col="${col}"]`)

    tableCell.style.backgroundColor = color
}


