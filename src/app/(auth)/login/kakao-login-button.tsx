'use client';

import Icon from '@shared/components/icon/icon';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const KakaoLoginButton = () => {
  const handleClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex min-w-[280px] cursor-pointer items-center justify-between self-stretch rounded-[10px] border border-[#FEE500] bg-[#FEE500] px-4 py-3"
    >
      <Icon name="KakaoTalk" size={18} />
      <span className="text-body-m-16 text-gray-900">카카오 로그인</span>
      <span className="w-[18px]" aria-hidden="true" />
    </button>
  );
};
