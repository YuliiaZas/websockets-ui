import ws from 'ws'
export const turn = (currentPlayer: string, plyaers: ws[]) => {
    const turnResponse = JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
            currentPlayer,
        }),
        id: 0,
    })
    plyaers.forEach((player) => {
        player.send(turnResponse)
    })
}
