export interface BngResBase {
  result: {
    code: number;
    msg: string;
    timestamp?: string;
  };
}

export interface BngReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
