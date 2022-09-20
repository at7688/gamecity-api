export interface BngResBase<T = any> {
  status: {
    code: number;
    message: string;
    time: string;
  };
  data?: T;
}

export interface BngReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
