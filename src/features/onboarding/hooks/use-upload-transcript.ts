import { useMutation } from '@tanstack/react-query';

import { uploadTranscript } from '../apis/upload-transcript';

export const useUploadTranscript = () =>
  useMutation({
    mutationFn: uploadTranscript,
  });
