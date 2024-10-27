interface Player {
    id: string;
    username: string;
    password: string;
}

interface Room {
    id: string;
    players: Player[];
    gameState: GameState | null;
}

export const players: Map<string, Player> = new Map();
export const rooms: Map<string, Room> = new Map();
