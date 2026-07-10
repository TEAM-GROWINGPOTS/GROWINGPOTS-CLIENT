import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <Link
        href="/semester-planner?view=card"
        className="text-body-sb-16 inline-flex items-center gap-6 rounded bg-gray-700 px-14 py-8 text-white hover:bg-gray-800"
      >
        학기플래너로 이동 이곳 페이지명=메인홈으로 할지 논의해보아요 이것은 그냥 임시일 뿐입니다.
      </Link>
    </main>
  );
}
