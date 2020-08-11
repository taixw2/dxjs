export interface DxAction<T> {
  type: string;
  payload?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Dispatch {
  <T>(payload?: T): unknown;
  <T>(payload: T, autoDispatch: false): DxAction<T>;
  <T>(payload: T, autoDispatch: true): unknown;
  <T>(payload?: T, autoDispatch?: boolean): DxAction<T> | unknown;
}
