//global variables
let board = []
// let table = document.querySelector(".board")

document.addEventListener('DOMContentLoaded', () => {

   

    let table = initializeBoard()
    console.log(board)

    addNextPiece(longPiece)

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

function addNextPiece(pieceType) {

    pieceType.coordinates.forEach(coord => { // x and y coordindates
        // debugger
        board[coord[0]] [coord[1]] = pieceType.color
        updateCell(coord[0], coord[1])
    });

}

let longPiece = { coordinates: [ [0,0], [0,1], [0,2], [0,3] ], color: "blue"}

function updateCell(x, y) {
    let row = document.querySelector(`[data-row="${x}"]`)

    let cell = row.querySelector(`[data-col="${y}"]`)
    // debugger
    cell.style.backgroundColor = board[x][y]
}

function timeStep(pieceType) {
    pieceType.coordinates.forEach(coord => { // x and y coordindates
        // debugger
        board[coord[0]] [coord[1]] = "gray"
        updateCell(coord[0], coord[1])
        coord[0]++
    });
    addNextPiece(pieceType)

}

