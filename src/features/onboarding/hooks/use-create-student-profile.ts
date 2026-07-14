import { useMutation } from '@tanstack/react-query';

import { createStudentProfile } from '../apis/create-student-profile';

export const useCreateStudentProfile = () =>
  useMutation({
    mutationFn: createStudentProfile,
  });
