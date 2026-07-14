import { ENDPOINT } from '@shared/apis/endpoint';
import { request } from '@shared/apis/request';
import { type EmptySuccessResponse } from '@shared/apis/type';

export const uploadTranscript = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return request.post<EmptySuccessResponse>(ENDPOINT.DIAGNOSIS.UPLOAD, formData);
};
