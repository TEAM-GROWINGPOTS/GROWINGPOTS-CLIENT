type ApiResponseBase = {
  code: string;
  message: string;
};

export type SuccessResponse<T> = ApiResponseBase & {
  success: true;
  data: T;
};

export type EmptySuccessResponse = ApiResponseBase & {
  success: true;
  data: null;
};

export type ErrorResponse = ApiResponseBase & {
  success: false;
  data: null;
};

export type SuccessUnion<T> = SuccessResponse<T> | EmptySuccessResponse;

export type ApiResponse<T> = SuccessUnion<T> | ErrorResponse;
