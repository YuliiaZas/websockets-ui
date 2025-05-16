import 'ws';

import { Player } from '../models/player.type';

declare module 'ws' {
  interface WebSocket {
    player?: Player;
  }
}
