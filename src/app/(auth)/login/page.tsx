import { LoginCarousel } from './carousel/login-carousel';

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px] rounded-[12px] bg-white p-40 shadow-sm">
        <LoginCarousel />
      </div>
    </div>
  );
}
