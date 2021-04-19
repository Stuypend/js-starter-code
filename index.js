let board = []

document.addEventListener('DOMContentLoaded', () => {

    initializeBoard()
    console.log(board)

})

function initializeBoard()
{
    let table = document.querySelector(".board")

    for (let i = 0; i < 10; i++)
    {
        board.push([])
        let newRow = document.createElement("tr")
        newRow.dataset.row = i
        for (let j = 0; j < 10; j++)
        {
            board[i][j] = "gray"
            let cell = document.createElement("td")
            cell.dataset.row = i
            cell.dataset.col = j
            newRow.append(cell)
        }
        table.append(newRow)
    }
}





