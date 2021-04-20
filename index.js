//global variables
let board = []
// let table = document.querySelector(".board")

let pieces = [
    { coordinates: [ [0,0], [0,1], [1,0], [1,2] ], color: "blue", letter: "O"},
    { coordinates: [ [0,0], [0,1], [0,2], [0,3] ], color: "blue", letter: "I"},
    { coordinates: [ [1,0], [1,1], [0,1], [0,2] ], color: "blue", letter: "S"},
    { coordinates: [ [0,0], [0,1], [1,1], [1,2] ], color: "blue", letter: "Z"},
    { coordinates: [ [0,0], [1,0], [2,0], [2,1] ], color: "blue", letter: "L"},
    { coordinates: [ [0,2], [1,2], [1,1], [0,1] ], color: "blue", letter: "J"},
    { coordinates: [ [0,0], [0,1], [0,2], [1,1] ], color: "blue", letter: "T"}
]

document.addEventListener('DOMContentLoaded', () => {

   

    let table = initializeBoard()
    console.log(board)

    addNewPiece(pieces[1])

})

function initializeBoard()
{
    let table = document.querySelector(".board")

    for (let row = 0; row < 10; row++)
    {
        board.push([])
        let newRow = document.createElement("tr")
        newRow.dataset.row = row

        for (let col = 0; col < 5; col++) //columns
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
    // generate a piece
    updateBoard(pieces[1])

    // call updateBoard
}

function updateBoard(pieceType) {

    pieceType.coordinates.forEach(coord => { // x and y coordindate
        updateCell(coord[0], coord[1], pieceType.color)
    });

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
                if (coords[i][0] + 1 > board[0][0].length)
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
                if (board[coord[0]][coord[1]+1] != "gray")
                    return false
            }


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


