'use client';

import Icon from '@shared/components/icon/icon';
import { useSearchParams } from 'next/navigation';

export const KakaoLoginButton = () => {
  const searchParams = useSearchParams();

  const handleKakaoLoginClick = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/api/auth/kakao/callback`,
      state: searchParams.get('redirect') ?? '',
    });
  };

  return (
    <button
      type="button"
      className="relative flex min-w-[280px] cursor-pointer items-center justify-center self-stretch rounded-lg border border-[#FEE500] bg-[#FEE500] px-16 py-12"
      onClick={handleKakaoLoginClick}
    >
      <div className="absolute left-16 flex items-center">
        <Icon name="KakaoTalk" size={18} />
      </div>
      <span className="text-body-m-16 text-gray-900">카카오 로그인</span>
    </button>
  );
};
