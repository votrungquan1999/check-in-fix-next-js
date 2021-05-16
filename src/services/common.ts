export interface CommonError {
  message: string;
}

export type CommonResponse<T> = {
  data: T;
  error?: CommonError;
};
