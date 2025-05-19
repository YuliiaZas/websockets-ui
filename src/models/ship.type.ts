export enum ShipType {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HUGE = 'huge',
}

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipType;
};

export type EnhancedShip = Ship & {
  cells: Set<string>;
  hits: Set<string>;
  emptyCellsAround: [number, number][];
};
