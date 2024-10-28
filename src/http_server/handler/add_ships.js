
export function handleAddShips(ws, data) {
    const game = games[data.gameId];
    if (game) {
      game.ships.push(...data.ships);
      if (game.ships.length === 2) {
        ws.send(JSON.stringify({ type: 'start_game', data: { ships: game.ships, currentPlayerIndex: data.indexPlayer }, id: 0 }));
      }
    }
  }