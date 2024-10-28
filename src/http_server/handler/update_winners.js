import { players } from '../../../index.js'; 

export function updateWinners(ws) {
  const winners = players.map(player => ({
    name: player.name,
    wins: player.wins || 0
  }));
  ws.send(JSON.stringify({ type: 'update_winners', data: winners, id: 0 }));
}