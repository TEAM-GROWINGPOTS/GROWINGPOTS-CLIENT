import { QUERY_KEY } from '@shared/apis/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadTranscript } from '../apis/upload-transcript';

export const useUploadTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.STUDENTS.ME_COURSES() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.GRADUATION.ALL });
    },
  });
};
