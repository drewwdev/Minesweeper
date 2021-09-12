import React, { useState } from 'react'

export function App() {
  type Cell = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | '*' | 'F' | ' ' | '_' | '@'
  type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
  type Board = [Row, Row, Row, Row, Row, Row, Row, Row]

  type Game = {
    board: Board
    id: null | number
    state: null | 'new' | 'playing' | 'won' | 'lost'
    mines: null | number
  }
  const [game, setGame] = useState<Game>({
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    id: 1,
    state: 'new',
    mines: 10,
  })

  async function handleNewGame() {
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )

    if (response.ok) {
      const newGameState = (await response.json()) as Game
      setGame(newGameState)
    }
  }

  async function handleCheck(row: number, column: number) {
    const body = { row: row, col: column }

    const response = await fetch(
      `https://minesweeper-api.herokuapp.com/games/${game.id}/check?row=${row}&col=${column}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    if (response.ok) {
      const newGameState = (await response.json()) as Game
      setGame(newGameState)
    }
  }

  async function handleFlag(row: number, column: number) {
    event?.preventDefault()
    const body = { row: row, col: column }

    const response = await fetch(
      `https://minesweeper-api.herokuapp.com/games/${game.id}/flag?row=${row}&col=${column}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    if (response.ok) {
      const newGameState = (await response.json()) as Game
      setGame(newGameState)
    }
  }

  const header = `${game.state} game - ${game.id}`
  return (
    <body>
      <h1>
        {header}
        <button onClick={handleNewGame}>New Game</button>
      </h1>
      <main className={game.state === null ? undefined : 'game-over'}>
        {game.board.map((row, rowIndex) =>
          row.map((column, columnIndex) => (
            <button
              onContextMenu={() => handleFlag(rowIndex, columnIndex)}
              key={columnIndex}
              onClick={() => handleCheck(rowIndex, columnIndex)}
            >
              {game.board[rowIndex][columnIndex]}
            </button>
          ))
        )}
      </main>
    </body>
  )
}
