import 'ws';

import { Player } from '../models/player.type.js';

declare module 'ws' {
  interface WebSocket {
    player?: Player;
  }
}
