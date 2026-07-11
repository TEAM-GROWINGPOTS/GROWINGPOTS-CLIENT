import { KakaoLoginButton } from '@features/auth/login/kakao-login-button';
import { LoginCarousel } from '@features/auth/login/login-carousel';
import Icon from '@shared/components/icon/icon';

export default function Page() {
  return (
    <main className="flex h-screen w-full items-center justify-between overflow-hidden bg-white p-32">
      <section className="h-full min-w-0 flex-[1_0_0]">
        <LoginCarousel />
      </section>

      <section className="flex h-full w-520 shrink-0 items-center justify-center">
        <div className="flex w-331 flex-col items-center gap-140">
          <div className="flex items-center gap-8">
            <Icon name="ic_lime_potato" size={36} aria-label="그로잉팟 로고" className="text-[#DAF761]" />
            <Icon name="img_logo" width={202} height={36} aria-label="growing pots" />
          </div>
          <KakaoLoginButton />
        </div>
      </section>
    </main>
  );
}
