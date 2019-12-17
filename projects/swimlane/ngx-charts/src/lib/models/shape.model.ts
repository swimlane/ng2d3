export interface IShapeData {
  series: string | number | Date;
  name: string | number | Date;
  value: string | number | Date;
  x: string | number | Date;
  radius: number;
}

export interface IShapeBase {
  data: IShapeData;
  x: string | number | Date;
  y: string | number | Date;
  r: number;
  classNames: string[];
  value: string | number | Date;
  label: string | number | Date;
  tooltipLabel: string;
  color: string;
  opacity: number;
  seriesName: string | number | Date;
  isActive: boolean;
  transform: string;
  barVisible: boolean;
  cx?: number;
  cy?: number;
  width?: number;
  height?: number;
  radius?: number;
  formattedPoints?: string;
}

export interface IShapeCircle extends IShapeBase {
  cx: number;
  cy: number;
  radius: number;
}

export interface IShapeRectangle extends IShapeBase {
  cx: number;
  cy: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface IShapePolygon extends IShapeBase {
  formattedPoints: string;
}
