import { LoginCarousel } from './carousel/login-carousel';

export default function Page() {
  return (
    <div className="flex h-screen gap-32 bg-white p-32" style={{ zoom: 0.6 }}>
      <div className="flex-[3]">
        <LoginCarousel />
      </div>
      <div className="flex-[2]" />
    </div>
  );
}
