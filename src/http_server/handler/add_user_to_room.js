// export function handleAddUserToRoom(ws, data, rooms ) {
//     const room = rooms.find(room => room.roomId === data.indexRoom);
//     if (room) {
//       const player = { name: `Player${room.roomUsers.length + 1}`, password: '', index: room.roomUsers.length };
//       room.roomUsers.push(player);
//       if (room.roomUsers.length === 2) {
//         const gameId = rooms.length;
//         games[gameId] = {
//           idGame: gameId,
//           idPlayer: room.roomUsers.length,
//           ships: []
//         };
//         // room.roomUsers.forEach((player, index) => {
//         //   ws.send(JSON.stringify({ type: 'create_game', data: { idGame: gameId, idPlayer: index }, id: 0 }));
//         // });
//       }
//       ws.send(JSON.stringify({ type: 'update_room', indexRoom: 0, id: 0 }));
//     }
//   };

export function handleAddUserToRoom(ws, data, rooms) {
  // const roomId = data.indexRoom;
  // const room = rooms.find(room => room.roomId === roomId);

  // if (!room) {
  //   ws.send(JSON.stringify({ type: 'error', message: `Room with id ${roomId} not found`, id: 0 }));
  //   return;
  // }

  // const player = { name: `Player${room.roomUsers.length + 1}`, index: room.roomUsers.length };
  // room.roomUsers.push(player);

  // // Отправляем обновленное состояние комнаты
  // const roomUpdates = rooms.map(room => ({
  //   roomId: room.roomId,
  //   roomUsers: room.roomUsers
  // }));
  // console.log(ebrtnrn)
  // ws.send(JSON.stringify({
  //   type: 'update_room',
  //   data: roomUpdates,
  //   id: 0
  // }));
  console.log(g3thgtwh)
}