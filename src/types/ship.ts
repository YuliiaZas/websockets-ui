export type Ship = {
  position: { x: number, y: number},
  direction: boolean,
  length: number
  type: ShipType,
};

export type ShipType = 'huge' | 'large' | 'medium' | 'small';