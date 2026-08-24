import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import EstimateBanner from "../../../../components/EstimateBanner";

import {
  decodeRegion,
  getChildren,
  isSupportedCity,
  isValidRegion,
  makeRegionUrl,
} from "../../../../regions";

type PageProps = {
  params: Promise<{
    city: string;
    district: string;
    area: string;
  }>;
};

/* =========================================================
   META
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const city = decodeRegion(resolvedParams.city);
  const district = decodeRegion(resolvedParams.district);
  const area = decodeRegion(resolvedParams.area);

  const path = [city, district, area];

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    return {
      title: "지역 철거업체 | 더세이브",
    };
  }

  const children = getChildren(path);
  const hasSubRegions = children.length > 0;

  return {
    title: `${area} 철거업체 | 점포철거·매장철거·상가철거·폐업철거`,

    description: hasSubRegions
      ? `${city} ${district} ${area} 철거업체 정보를 확인하세요. ${area} 점포철거업체, 매장철거업체, 상가철거업체, 폐업철거, 원상복구 및 동별 철거 정보를 안내합니다.`
      : `${city} ${district} ${area} 철거업체 정보를 확인하세요. ${area} 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거, 원상복구 및 철거견적 관련 정보를 안내합니다.`,

    keywords: [
      `${area}철거`,
      `${area}철거업체`,
      `${area}철거전문업체`,
      `${area}철거전문`,
      `${area}철거공사`,
      `${area}철거비용`,
      `${area}철거견적`,

      `${area}점포철거`,
      `${area}점포철거업체`,

      `${area}매장철거`,
      `${area}매장철거업체`,

      `${area}상가철거`,
      `${area}상가철거업체`,

      `${area}폐업철거`,
      `${area}폐업철거업체`,

      `${area}원상복구`,
      `${area}원상복구업체`,

      `${area}부분철거`,
      `${area}사무실철거`,
      `${area}음식점철거`,
      `${area}카페철거`,

      `${district}철거`,
      `${district}철거업체`,

      `${city}철거`,
      `${city}철거업체`,
    ],

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${area} 철거업체 | 더세이브`,
      description: `${area} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인하세요.`,
      type: "website",
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function AreaPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  const city = decodeRegion(
    resolvedParams.city
  );

  const district = decodeRegion(
    resolvedParams.district
  );

  const area = decodeRegion(
    resolvedParams.area
  );

  const path = [
    city,
    district,
    area,
  ];

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    notFound();
  }

  /*
   * 예:
   *
   * 경기 / 고양시 / 일산동구
   * → 백석동 / 마두동 / 장항동 ...
   *
   * 서울 / 강남구 / 역삼동
   * → 하위 지역 없음
   */
  const subRegions =
    getChildren(path);

  const hasSubRegions =
    subRegions.length > 0;

  /* =======================================================
     SERVICES
  ======================================================= */

  const services = [
    {
      number: "01",
      title: `${area} 철거업체`,
      description:
        "상가, 점포, 매장, 음식점, 카페, 사무실 등 공간의 내부 구조와 철거 범위를 확인하여 필요한 작업 방향을 안내합니다.",
    },

    {
      number: "02",
      title: `${area} 점포철거업체`,
      description:
        "점포 이전이나 폐업을 준비하는 경우 천장, 바닥, 가벽, 집기 및 기존 시설물 가운데 필요한 철거 범위를 확인합니다.",
    },

    {
      number: "03",
      title: `${area} 매장철거업체`,
      description:
        "매장 내부 구조와 기존 마감 상태를 확인하여 전체철거 또는 부분철거에 필요한 작업 범위를 살펴봅니다.",
    },

    {
      number: "04",
      title: `${area} 상가철거업체`,
      description:
        "상가 내부 마감재와 시설물, 폐기물 반출 동선 및 장비 진입 조건 등을 확인하여 필요한 철거 범위를 정합니다.",
    },

    {
      number: "05",
      title: `${area} 폐업철거업체`,
      description:
        "폐업 일정과 임대차 계약 내용을 확인하고 내부 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",
    },

    {
      number: "06",
      title: `${area} 원상복구업체`,
      description:
        "임대차 계약과 임대인 요청사항을 기준으로 철거 후 필요한 원상복구 항목을 확인합니다.",
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

        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-y-2 px-5 py-5 text-sm font-medium text-neutral-200 sm:px-6 sm:text-base">

          <Link
            href="/"
            className="transition hover:text-[#ffd600]"
          >
            HOME
          </Link>


          <span className="mx-3 text-neutral-600">
            /
          </span>


          <Link
            href={makeRegionUrl([
              city,
            ])}
            className="transition hover:text-[#ffd600]"
          >
            {city}
          </Link>


          <span className="mx-3 text-neutral-600">
            /
          </span>


          <Link
            href={makeRegionUrl([
              city,
              district,
            ])}
            className="transition hover:text-[#ffd600]"
          >
            {district}
          </Link>


          <span className="mx-3 text-neutral-600">
            /
          </span>


          <strong className="text-[#ffd600]">
            {area}
          </strong>

        </div>

      </section>


      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:70px_70px]" />


        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-16 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">

          {/* HERO LEFT */}

          <div>

            <p className="mb-6 text-sm font-black tracking-[0.2em] text-[#ffd600] sm:text-base sm:tracking-[0.28em]">

              {city}
              {" · "}
              {district}
              {" · "}
              {area}

            </p>


            <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">

              {area} 철거업체

              <br />


              <span className="text-[#ffd600]">

                {hasSubRegions
                  ? "점포·매장·상가철거"
                  : "철거부터 원상복구까지"}

              </span>

            </h1>


            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

              {city}
              {" "}
              {district}
              {" "}
              {area}에서
              상가철거, 점포철거,
              매장철거, 폐업철거,
              부분철거 및 원상복구가
              필요하다면 현장 구조와
              필요한 철거 범위를 먼저
              확인하는 것이 중요합니다.

            </p>


            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/#contact"
                className="bg-[#ffd600] px-8 py-5 text-center text-base font-black text-black transition hover:bg-white sm:text-lg"
              >
                무료 철거 견적 신청
              </Link>


              <a
                href={
                  hasSubRegions
                    ? "#sub-region-list"
                    : "#information"
                }
                className="border border-white/30 bg-white/5 px-8 py-5 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600] sm:text-lg"
              >

                {hasSubRegions
                  ? `${area} 지역 보기`
                  : "철거 정보 확인"}

              </a>

            </div>

          </div>


          {/* HERO RIGHT */}

          <div className="relative hidden min-h-[430px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              03
            </div>


            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                THE SAVE DEMOLITION
              </p>


              <strong className="mt-28 block text-3xl font-black leading-tight text-white">

                {area} 철거,

                <br />

                {hasSubRegions
                  ? "지역별로 확인하세요."
                  : "현장부터 확인합니다."}

              </strong>


              <div className="mt-8 h-1 w-24 bg-[#ffd600]" />

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          INFORMATION
      =================================================== */}

      <section
        id="information"
        className="bg-[#f3f3f0] py-20 text-black sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            LOCAL DEMOLITION GUIDE
          </p>


          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {area} 철거를 알아볼 때

            <br />

            먼저 확인해야 할 사항

          </h2>


          <div className="mt-14 grid gap-px bg-neutral-300 md:grid-cols-3">

            <article className="min-h-[330px] bg-white p-7 sm:p-9">

              <span className="text-base font-black text-neutral-500">
                01
              </span>


              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                철거 범위
              </h3>


              <p className="mt-5 text-lg font-medium leading-8 text-neutral-700">

                천장, 벽체, 바닥, 가벽,
                집기 등 어느 부분까지
                철거하는지 확인하여 필요한
                작업 범위를 정하는 것이
                중요합니다.

              </p>

            </article>


            <article className="min-h-[330px] bg-[#111] p-7 text-white sm:p-9">

              <span className="text-base font-black text-[#ffd600]">
                02
              </span>


              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                현장 조건
              </h3>


              <p className="mt-5 text-lg font-medium leading-8 text-neutral-100">

                엘리베이터, 주차 공간,
                폐기물 반출 동선 및 장비
                진입 여부 등에 따라 작업
                방식이 달라질 수 있습니다.

              </p>

            </article>


            <article className="min-h-[330px] bg-[#ffd600] p-7 sm:p-9">

              <span className="text-base font-black text-black/60">
                03
              </span>


              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                원상복구 범위
              </h3>


              <p className="mt-5 text-lg font-medium leading-8 text-black/80">

                임대차 계약과 임대인
                요청사항을 확인하여 철거 후
                필요한 원상복구 항목을 함께
                확인하는 것이 좋습니다.

              </p>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================
          SERVICE
      =================================================== */}

      <section className="bg-[#080808] py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            SERVICE
          </p>


          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">

            {area} 철거 서비스

          </h2>


          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

            공간의 구조와 업종,
            현장 상황에 따라 필요한
            철거 범위와 작업 방식은
            달라질 수 있습니다.

          </p>


          <div className="mt-14 divide-y divide-white/15 border-y border-white/15">

            {services.map(
              (
                service
              ) => (

                <div
                  key={
                    service.number
                  }
                  className="grid gap-4 py-8 sm:grid-cols-[70px_1fr_1.4fr] sm:gap-6 sm:py-10"
                >

                  <span className="text-base font-black text-[#ffd600]">

                    {
                      service.number
                    }

                  </span>


                  <h3 className="text-2xl font-black text-white">

                    {
                      service.title
                    }

                  </h3>


                  <p className="text-lg font-medium leading-8 text-neutral-200">

                    {
                      service.description
                    }

                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          무료방문견적 전화 배너
      =================================================== */}

      <EstimateBanner />


      {/* ===================================================
          하위 지역 목록

          경기 / 고양시 / 일산동구
          → 백석동 / 마두동 / 장항동 ...
      =================================================== */}

      {hasSubRegions && (

        <section
          id="sub-region-list"
          className="bg-[#0c0c0c] py-20 sm:py-24"
        >

          <div className="mx-auto max-w-7xl px-5 sm:px-6">

            <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
              LOCAL AREA
            </p>


            <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">

              {area} 동별

              <br />

              철거업체

            </h2>


            <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

              아래 지역을 선택하면 해당 지역의
              철거업체, 점포철거업체,
              매장철거업체, 상가철거업체,
              폐업철거 및 원상복구 관련
              정보를 확인할 수 있습니다.

            </p>


            <div className="mt-14 grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">

              {subRegions.map(
                (
                  region
                ) => (

                  <Link
                    key={
                      region.name
                    }
                    href={makeRegionUrl([
                      city,
                      district,
                      area,
                      region.name,
                    ])}
                    className="group min-h-[220px] border-b border-r border-white/20 bg-[#111] p-7 transition hover:bg-[#ffd600] sm:p-8"
                  >

                    <p className="text-sm font-bold text-neutral-400 transition group-hover:text-black/60 sm:text-base">

                      {city}
                      {" · "}
                      {district}
                      {" · "}
                      {area}

                    </p>


                    <div className="mt-9 flex items-center justify-between gap-4">

                      <strong className="text-2xl font-black text-white transition group-hover:text-black sm:text-3xl">

                        {
                          region.name
                        }
                        {" "}
                        철거업체

                      </strong>


                      <span className="text-2xl font-black text-[#ffd600] transition group-hover:text-black">

                        →

                      </span>

                    </div>


                    <p className="mt-5 text-base font-medium leading-7 text-neutral-300 transition group-hover:text-black/75">

                      {
                        region.name
                      }
                      {" "}
                      점포철거 · 매장철거

                      <br />

                      상가철거 · 폐업철거 · 원상복구

                    </p>

                  </Link>

                )
              )}

            </div>

          </div>

        </section>

      )}


      {/* ===================================================
          SEO TEXT
      =================================================== */}

      <section className="bg-[#171717] py-20 sm:py-24">

        <div className="mx-auto max-w-5xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL DEMOLITION INFORMATION
          </p>


          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">

            {city}
            {" "}
            {district}
            {" "}
            {area}

            <br />

            철거업체를 알아보고 있다면

          </h2>


          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            <p>

              {area} 철거업체를 알아볼 때에는
              단순히 공간의 평수만 확인하기보다
              현재 내부 구조와 철거 대상,
              폐기물의 종류와 양을 함께
              살펴보는 것이 중요합니다.

            </p>


            <p>

              {area} 점포철거업체나{" "}

              {area} 매장철거업체를
              알아보는 경우 천장, 바닥,
              가벽, 집기, 간판,
              주방시설 등 기존 시설물
              가운데 어느 부분까지 철거해야
              하는지 확인하는 것이 좋습니다.

            </p>


            <p>

              {area} 상가철거나{" "}

              {area} 폐업철거를
              준비하고 있다면 임대차 계약상의
              원상복구 조건도 함께
              확인해야 합니다.

            </p>


            <p>

              철거비용과 철거견적은 단순한
              면적만으로 결정되는 것이 아니라
              폐기물의 양, 작업 난이도,
              엘리베이터 사용 여부,
              장비 진입 가능 여부와
              현장 환경 등에 따라서도
              달라질 수 있습니다.

            </p>


            <p>

              더세이브는{" "}
              {city}
              {" "}
              {district}
              {" "}
              {area}
              {" "}
              지역에서 점포철거,
              매장철거, 상가철거,
              부분철거, 폐업철거 및
              원상복구를 알아보는 경우
              현장 조건과 필요한 작업 범위를
              확인하여 진행 방향을 안내합니다.

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

            {area} 철거 진행 절차

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
                  key={
                    number
                  }
                  className="min-h-[300px] bg-[#101010] p-7 sm:p-8"
                >

                  <span className="text-lg font-black text-[#ffd600]">

                    {
                      number
                    }

                  </span>


                  <h3 className="mt-16 text-2xl font-black text-white">

                    {
                      title
                    }

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

              {area}
              {" "}
              철거 견적이

              <br className="sm:hidden" />

              {" "}
              필요하신가요?

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
          BACK LINKS
      =================================================== */}

      <section className="border-b border-white/10 bg-[#101010] py-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:flex-row sm:flex-wrap sm:px-6">

          <Link
            href={makeRegionUrl([
              city,
            ])}
            className="border border-white/20 px-6 py-4 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600]"
          >
            ← {city} 철거업체
          </Link>


          <Link
            href={makeRegionUrl([
              city,
              district,
            ])}
            className="border border-white/20 px-6 py-4 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600]"
          >
            ← {district} 철거업체
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


          <div className="flex flex-wrap items-center gap-y-2 text-base font-medium text-neutral-200">

            <Link
              href="/"
              className="transition hover:text-[#ffd600]"
            >
              메인
            </Link>


            <span className="mx-3 text-neutral-600">
              ·
            </span>


            <Link
              href={makeRegionUrl([
                city,
              ])}
              className="transition hover:text-[#ffd600]"
            >
              {city}
            </Link>


            <span className="mx-3 text-neutral-600">
              ·
            </span>


            <Link
              href={makeRegionUrl([
                city,
                district,
              ])}
              className="transition hover:text-[#ffd600]"
            >
              {district}
            </Link>


            <span className="mx-3 text-neutral-600">
              ·
            </span>


            <strong className="text-white">
              {area}
            </strong>


            <span className="mx-3 text-neutral-600">
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