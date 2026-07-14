'use client';

import Icon from '@shared/components/icon/icon';
import { toast } from '@shared/components/toast/toast';
import { useSearchParams } from 'next/navigation';

export const KakaoLoginButton = () => {
  const searchParams = useSearchParams();

  const handleKakaoLoginClick = () => {
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    if (!kakaoClientId) {
      toast.negative('잠시 후 다시 시도해주세요.');
      return;
    }
    const redirectUri = `${window.location.origin}/api/auth/kakao/callback`;
    const state = searchParams.get('redirect') ?? '';
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${encodeURIComponent(state)}`;
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
