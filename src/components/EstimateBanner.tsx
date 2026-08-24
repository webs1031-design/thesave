export default function EstimateBanner() {
  return (
    <section className="w-full bg-[#ffd600] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.25em] text-black">
              FREE ESTIMATE
            </p>

            <h2 className="text-3xl font-black leading-tight text-black md:text-5xl">
              무료방문견적
            </h2>

            <p className="mt-3 text-sm font-medium text-black/70 md:text-base">
              철거부터 원상복구까지 편하게 상담받아보세요.
            </p>
          </div>

          <a
            href="tel:01022698352"
            className="group flex flex-col items-center justify-center bg-black px-10 py-6 text-white transition hover:scale-[1.02] md:px-14"
          >
            <span className="mb-1 text-xs font-bold tracking-[0.2em] text-[#ffd600]">
              전화 상담
            </span>

            <span className="text-2xl font-black tracking-tight md:text-4xl">
              010-2269-8352
            </span>

            <span className="mt-2 text-xs text-neutral-400">
              전화 연결하기 →
            </span>
          </a>

        </div>
      </div>
    </section>
  );
}