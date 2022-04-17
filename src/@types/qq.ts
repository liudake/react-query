export interface IInfoQqBase {
  qq: string;
  name: string;
  avatar: string;
  code?: number;
}

export interface IInfoQqRes extends IInfoQqBase {
  msg: string;
  qlogo: string;
}
