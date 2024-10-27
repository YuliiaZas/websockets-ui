const players = []

const addPlayerFromDb = (player) => {
  players.push(player);
}

const deletePlayerFromDb = (playerId) => {
  players = players.filter(player => player.id !== playerId);  
}
