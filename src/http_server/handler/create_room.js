// import { handleAddUserToRoom } from "./add_user_to_room.js"


export function handleCreateRoom(ws, rooms, players, data) {
   rooms[rooms.length - 1].roomUsers.push(players[players.length - 1]);
  // handleRegistration(ws, data, players, rooms);
  updateRoom(ws, rooms, players);
  // handleAddUserToRoom(ws, data);
  
  
};

function updateRoom(ws, rooms, players) {
  
  const roomId = rooms.length;
  console.log(rooms);
  const newRoom = { roomId, roomUsers: [] };
  rooms.push(newRoom);
  ws.send(JSON.stringify({ type: 'update_room', data: JSON.stringify(rooms), id: 0 }));
  updateWinners(ws, players);
 
  
};

function updateWinners(ws, players) {
  const winners = players.map(player => ({
    name: player.name,
    wins: player.wins,
  }));
  console.log(winners)
  ws.send(JSON.stringify({ type: 'update_winners', data: JSON.stringify(winners), id: 0 }));

};
function handleRegistration(ws, data, players, rooms) {
  const parsedData = JSON.parse(data);
  const player = { name: parsedData.name, password: parsedData.password, wins: 0, index: players.length };
  players.push(player);


  const response = {
    type: "reg",
    data: JSON.stringify({
      name: player.name,
      error: false,
      errorText: "",
    }),
    id: 0
  };
  console.log(response)
  let stringify = JSON.stringify(response).toString();
  ws.send(stringify);


  updateRoom(ws, rooms, players);
};