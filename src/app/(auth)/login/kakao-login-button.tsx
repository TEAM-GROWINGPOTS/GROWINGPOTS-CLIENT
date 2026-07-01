'use client';

import Icon from '@shared/components/icon/icon';

export const KakaoLoginButton = () => {
  return (
    <button
      type="button"
      className="flex min-w-[280px] cursor-pointer items-center justify-between self-stretch rounded-[10px] border border-[#FEE500] bg-[#FEE500] px-4 py-3"
    >
      <Icon name="KakaoTalk" size={18} />
      <span className="text-body-m-16 text-gray-900">카카오 로그인</span>
      <span className="w-[18px]" aria-hidden="true" />
    </button>
  );
};
