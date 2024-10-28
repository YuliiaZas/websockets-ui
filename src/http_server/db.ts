interface Player {
    id: string;
    username: string;
    password: string;
    wins: number;
}

interface Room {
    id: string;
    players: Player[];
    gameId: string | null;
}

interface Game {
    id: string;
    players: { [key: string]: PlayerGameData }; // PlayerGameData for each player
    currentPlayer: string;
}

interface PlayerGameData {
    ships: Ship[];
    shots: Coordinate[];
}

interface Ship {
    position: Coordinate;
    direction: boolean;
    length: number;
    type: "small" | "medium" | "large" | "huge";
}

interface Coordinate {
    x: number;
    y: number;
}


export const players: Map<string, Player> = new Map();
export const rooms: Map<string, Room> = new Map();
export const games: Map<string, Game> = new Map();
