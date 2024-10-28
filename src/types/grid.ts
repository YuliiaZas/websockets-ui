import { ShipType } from "./ship";

export type Grid = [Cell[]];
export type Cell = {
  attacked: boolean,
  type: ShipType,
};