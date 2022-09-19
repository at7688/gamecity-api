export interface ZgResBase {
  result: {
    code: number;
    msg: string;
    timestamp?: string;
  };
}

export interface ZgReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
