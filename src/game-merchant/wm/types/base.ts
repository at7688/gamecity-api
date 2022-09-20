export interface WmResBase {
  result: {
    code: number;
    msg: string;
    timestamp?: string;
  };
}

export interface WmReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
