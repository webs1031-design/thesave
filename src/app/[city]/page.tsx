import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EstimateBanner from "../../components/EstimateBanner";

import {
  decodeRegion,
  getChildren,
  isSupportedCity,
  makeRegionUrl,
} from "../../regions";

type PageProps = {
  params: Promise<{
    city: string;
  }>;
};

/* =========================================================
   SEO 메타데이터
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = decodeRegion(resolvedParams.city);

  if (!isSupportedCity(city)) {
    return {
      title: "지역 철거업체 | 더세이브",
    };
  }

  return {
    title: `${city} 철거업체 | 점포철거·매장철거·상가철거·폐업철거`,

    description: `${city} 철거업체 정보를 확인하세요. ${city} 점포철거업체, 매장철거업체, 상가철거업체, 폐업철거, 부분철거, 원상복구 및 지역별 철거 정보를 안내합니다.`,

    keywords: [
      `${city}철거`,
      `${city}철거업체`,
      `${city}철거전문업체`,
      `${city}철거전문`,
      `${city}철거공사`,
      `${city}철거비용`,
      `${city}철거견적`,
      `${city}점포철거`,
      `${city}점포철거업체`,
      `${city}매장철거`,
      `${city}매장철거업체`,
      `${city}상가철거`,
      `${city}상가철거업체`,
      `${city}폐업철거`,
      `${city}폐업철거업체`,
      `${city}원상복구`,
      `${city}원상복구업체`,
      `${city}부분철거`,
      `${city}사무실철거`,
      `${city}음식점철거`,
      `${city}카페철거`,
    ],

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${city} 철거업체 | 더세이브`,
      description: `${city} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인하세요.`,
      type: "website",
    },
  };
}

/* =========================================================
   페이지
========================================================= */

export default async function CityPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  const city = decodeRegion(
    resolvedParams.city
  );

  /* 지원하지 않는 지역이면 404 */
  if (!isSupportedCity(city)) {
    notFound();
  }

  /*
   * regions.ts에서 자동으로 하위 지역 불러오기
   *
   * 서울 → 강남구, 강동구 ...
   * 경기 → 수원시, 고양시 ...
   * 인천 → 남동구, 부평구 ...
   */
  const childRegions = getChildren([
    city,
  ]);

  if (childRegions.length === 0) {
    notFound();
  }

  /* =======================================================
     서비스 목록
  ======================================================= */

  const services = [
    {
      number: "01",
      title: `${city} 철거업체`,
      description:
        "상가, 점포, 매장, 음식점, 카페, 사무실 등 공간의 구조와 철거 범위를 확인하여 필요한 작업 방향을 안내합니다.",
    },

    {
      number: "02",
      title: `${city} 점포철거업체`,
      description:
        "점포 이전이나 폐업을 준비할 때 천장, 바닥, 가벽, 집기 및 기존 시설물 가운데 필요한 철거 범위를 확인합니다.",
    },

    {
      number: "03",
      title: `${city} 매장철거업체`,
      description:
        "매장 내부 구조와 기존 마감 상태를 확인하여 전체철거 또는 부분철거에 필요한 작업 범위를 살펴봅니다.",
    },

    {
      number: "04",
      title: `${city} 상가철거업체`,
      description:
        "상가 내부 마감재와 시설물, 폐기물 반출 동선 및 장비 진입 조건 등을 확인하여 작업 범위를 정합니다.",
    },

    {
      number: "05",
      title: `${city} 폐업철거업체`,
      description:
        "폐업 일정과 임대차 계약 내용을 확인하고 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",
    },

    {
      number: "06",
      title: `${city} 원상복구업체`,
      description:
        "임대인 요청사항과 계약 조건을 기준으로 철거 후 필요한 원상복구 범위를 확인합니다.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-white/15 bg-black">
        <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between px-5 sm:px-6">

          <Link
            href="/"
            className="flex items-end gap-2 font-black"
          >
            <span className="text-sm text-[#ffd600]">
              THE
            </span>

            <span className="text-2xl text-white sm:text-3xl">
              SAVE
            </span>

            <span className="mb-1 hidden text-[10px] tracking-[0.25em] text-neutral-300 sm:inline">
              DEMOLITION
            </span>
          </Link>

          <Link
            href="/#contact"
            className="bg-[#ffd600] px-5 py-3 text-sm font-black text-black transition hover:bg-white sm:px-7 sm:py-4 sm:text-base"
          >
            무료 견적 신청
          </Link>

        </div>
      </header>


      {/* ===================================================
          BREADCRUMB
      =================================================== */}

      <section className="border-b border-white/15 bg-[#0c0c0c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center px-5 py-5 text-sm font-medium text-neutral-200 sm:px-6 sm:text-base">

          <Link
            href="/"
            className="transition hover:text-[#ffd600]"
          >
            HOME
          </Link>

          <span className="mx-3 text-neutral-600">
            /
          </span>

          <strong className="text-[#ffd600]">
            {city}
          </strong>

        </div>
      </section>


      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">

          {/* HERO LEFT */}

          <div>

            <p className="mb-6 text-sm font-black tracking-[0.25em] text-[#ffd600] sm:text-base">
              THE SAVE · LOCAL DEMOLITION
            </p>

            <h1 className="text-[44px] font-black leading-[1.07] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">

              {city} 철거업체

              <br />

              <span className="text-[#ffd600]">
                점포·매장·상가철거
              </span>

            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

              {city} 지역에서 상가철거, 점포철거,
              매장철거, 폐업철거, 부분철거 및
              원상복구가 필요하다면 현장 구조와
              필요한 철거 범위를 먼저 확인하는 것이
              중요합니다.

            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/#contact"
                className="bg-[#ffd600] px-8 py-5 text-center text-base font-black text-black transition hover:bg-white sm:text-lg"
              >
                무료 철거 견적 신청
              </Link>

              <a
                href="#region-list"
                className="border border-white/30 bg-white/5 px-8 py-5 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600] sm:text-lg"
              >
                지역별 철거업체 보기
              </a>

            </div>

          </div>


          {/* HERO RIGHT */}

          <div className="relative hidden min-h-[430px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              01
            </div>

            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                THE SAVE DEMOLITION
              </p>

              <strong className="mt-28 block text-3xl font-black leading-tight text-white">

                {city} 철거,

                <br />

                지역별로 확인하세요.

              </strong>

              <div className="mt-8 h-1 w-24 bg-[#ffd600]" />

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          SERVICE
      =================================================== */}

      <section className="bg-[#f4f4f1] py-20 text-black sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            DEMOLITION SERVICE
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {city} 철거 서비스

          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-700">

            철거 대상 공간과 현장 구조에 따라
            필요한 작업 범위와 철거 방식은
            달라질 수 있습니다.

          </p>

          <div className="mt-14 grid gap-px bg-neutral-300 md:grid-cols-2 lg:grid-cols-3">

            {services.map(
              (
                service,
                index
              ) => {

                const dark =
                  index === 1;

                const yellow =
                  index === 4;

                return (

                  <article
                    key={
                      service.title
                    }
                    className={`min-h-[330px] p-8 sm:p-9 ${
                      dark
                        ? "bg-[#111] text-white"
                        : yellow
                        ? "bg-[#ffd600] text-black"
                        : "bg-white text-black"
                    }`}
                  >

                    <span
                      className={`text-base font-black ${
                        dark
                          ? "text-[#ffd600]"
                          : yellow
                          ? "text-black/60"
                          : "text-neutral-500"
                      }`}
                    >
                      {
                        service.number
                      }
                    </span>

                    <h3 className="mt-14 text-2xl font-black leading-tight sm:text-3xl">
                      {
                        service.title
                      }
                    </h3>

                    <p
                      className={`mt-5 text-lg font-medium leading-8 ${
                        dark
                          ? "text-neutral-100"
                          : yellow
                          ? "text-black/80"
                          : "text-neutral-700"
                      }`}
                    >
                      {
                        service.description
                      }
                    </p>

                  </article>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          무료 방문 견적 전화 배너
      =================================================== */}

      <EstimateBanner />


      {/* ===================================================
          REGION LIST
      =================================================== */}

      <section
        id="region-list"
        className="bg-[#080808] py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL AREA
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">

            {city} 지역별

            <br />

            철거업체

          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

            아래 지역을 선택하면 해당 지역의
            철거업체, 점포철거업체, 매장철거업체,
            상가철거업체, 폐업철거 및 원상복구
            관련 정보를 확인할 수 있습니다.

          </p>


          {/* 지역 카드 */}

          <div className="mt-14 grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">

            {childRegions.map(
              (region) => (

                <Link
                  key={
                    region.name
                  }
                  href={makeRegionUrl([
                    city,
                    region.name,
                  ])}
                  className="group min-h-[220px] border-b border-r border-white/20 bg-[#101010] p-7 transition hover:bg-[#ffd600] sm:p-8"
                >

                  <p className="text-base font-bold text-neutral-400 transition group-hover:text-black/60">

                    {city}

                  </p>

                  <div className="mt-10 flex items-center justify-between gap-4">

                    <strong className="text-2xl font-black text-white transition group-hover:text-black sm:text-3xl">

                      {
                        region.name
                      }{" "}
                      철거업체

                    </strong>

                    <span className="text-2xl font-black text-[#ffd600] transition group-hover:text-black">

                      →

                    </span>

                  </div>

                  <p className="mt-5 text-base font-medium leading-7 text-neutral-300 transition group-hover:text-black/75">

                    {
                      region.name
                    }{" "}
                    점포철거 · 매장철거

                    <br />

                    상가철거 · 폐업철거 · 원상복구

                  </p>

                  {region.children &&
                    region.children
                      .length > 0 && (

                      <p className="mt-5 text-sm font-bold text-[#ffd600] transition group-hover:text-black">

                        하위 지역{" "}

                        {
                          region
                            .children
                            .length
                        }개 →

                      </p>

                    )}

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          SEO INFORMATION
      =================================================== */}

      <section className="bg-[#171717] py-20 sm:py-24">

        <div className="mx-auto max-w-5xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL DEMOLITION INFORMATION
          </p>

          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">

            {city} 철거업체를

            <br />

            알아보고 있다면

          </h2>

          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            <p>

              {city} 철거업체를 알아볼 때에는
              단순히 공간의 면적만 확인하기보다
              현재 내부 구조와 철거 대상,
              폐기물의 종류와 양,
              폐기물 반출 환경을 함께
              확인하는 것이 중요합니다.

            </p>

            <p>

              {city} 점포철거업체나{" "}
              {city} 매장철거업체를
              알아보는 경우 천장, 바닥,
              가벽, 집기, 간판,
              주방시설 등 기존 시설물
              가운데 어느 부분까지
              철거가 필요한지
              확인하는 것이 좋습니다.

            </p>

            <p>

              {city} 상가철거나{" "}
              {city} 폐업철거를
              준비하고 있다면
              임대차 계약상의
              원상복구 조건도
              함께 확인해야 합니다.

            </p>

            <p>

              철거비용과 철거견적은
              단순히 면적만으로
              결정되는 것이 아니라
              폐기물의 양,
              작업 난이도,
              엘리베이터 사용 여부,
              장비 진입 가능 여부,
              현장의 작업 환경 등에
              따라서도 달라질 수 있습니다.

            </p>

            <p>

              더세이브는 {city} 지역의
              점포철거, 매장철거,
              상가철거, 부분철거,
              폐업철거 및 원상복구를
              알아보는 경우 현장 조건과
              필요한 작업 범위를
              확인하여 진행 방향을
              안내합니다.

            </p>

          </div>

        </div>

      </section>


      {/* ===================================================
          PROCESS
      =================================================== */}

      <section className="bg-black py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            PROCESS
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">

            철거 진행 절차

          </h2>

          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">

            {[
              [
                "01",
                "상담 접수",
                "지역, 업종, 평수와 필요한 철거 내용을 확인합니다.",
              ],

              [
                "02",
                "현장 확인",
                "현장의 구조와 철거 범위 및 작업 조건을 확인합니다.",
              ],

              [
                "03",
                "견적 안내",
                "확인된 작업 범위를 기준으로 견적 내용을 안내합니다.",
              ],

              [
                "04",
                "철거 진행",
                "협의된 일정과 작업 범위에 따라 철거를 진행합니다.",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (

                <article
                  key={number}
                  className="min-h-[300px] bg-[#101010] p-7 sm:p-8"
                >

                  <span className="text-lg font-black text-[#ffd600]">
                    {number}
                  </span>

                  <h3 className="mt-16 text-2xl font-black text-white">
                    {title}
                  </h3>

                  <p className="mt-5 text-lg font-medium leading-8 text-neutral-200">
                    {
                      description
                    }
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          CTA
      =================================================== */}

      <section className="bg-[#ffd600] py-16 text-black sm:py-20">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-5 sm:px-6 md:flex-row md:items-center">

          <div>

            <p className="mb-4 text-sm font-black tracking-[0.2em]">
              FREE ESTIMATE
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

              {city} 철거 견적이

              <br className="sm:hidden" />

              {" "}필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              지역, 업종, 평수와
              필요한 철거 내용을
              알려주세요.

            </p>

          </div>

          <Link
            href="/#contact"
            style={{
              color: "#ffffff",
            }}
            className="shrink-0 bg-black px-9 py-5 text-center text-lg font-black !text-white transition hover:bg-[#222222]"
          >
            무료 견적 상담 →
          </Link>

        </div>

      </section>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-white/15 bg-black py-12">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 sm:flex-row sm:px-6">

          <div>

            <strong className="text-2xl font-black text-white">
              THE SAVE
            </strong>

            <p className="mt-2 text-sm font-medium tracking-[0.18em] text-neutral-300">
              DEMOLITION SERVICE
            </p>

          </div>

          <div className="flex flex-wrap items-center text-base font-medium text-neutral-200">

            <Link
              href="/"
              className="transition hover:text-[#ffd600]"
            >
              메인 홈페이지
            </Link>

            <span className="mx-4 text-neutral-600">
              ·
            </span>

            <strong className="text-white">
              {city}
            </strong>

            <span className="mx-4 text-neutral-600">
              ·
            </span>

            <Link
              href="/#contact"
              className="transition hover:text-[#ffd600]"
            >
              무료 견적
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}