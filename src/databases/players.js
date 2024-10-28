const players = [];

export const getPlayerById = playerId => 
  players.find(p => p.index === playerId)

export const addPlayerToDb = player => 
  players.push({...player, wins: 0});

export const getWinners = () => 
  [...players].sort((a, b) => b.wins - a.wins);

export const setPlayerAsWinners = playerId => 
  players.forEach(p => {
    if (p.index === playerId) {
      p.wins++;
      return;
    }
  })
