import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import EstimateBanner from "../../../../../components/EstimateBanner";

import {
  decodeRegion,
  isSupportedCity,
  isValidRegion,
  makeRegionUrl,
} from "../../../../../regions";

type PageProps = {
  params: Promise<{
    city: string;
    district: string;
    area: string;
    dong: string;
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
  const dong = decodeRegion(resolvedParams.dong);

  const path = [
    city,
    district,
    area,
    dong,
  ];

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    return {
      title: "지역 철거업체 | 더세이브",
    };
  }

  return {
    title: `${dong} 철거업체 | 점포철거·매장철거·상가철거·폐업철거`,

    description: `${city} ${district} ${area} ${dong} 철거업체 정보를 확인하세요. ${dong} 점포철거업체, 매장철거업체, 상가철거업체, 폐업철거, 부분철거, 원상복구 및 철거견적 관련 정보를 안내합니다.`,

    keywords: [
      `${dong}철거`,
      `${dong}철거업체`,
      `${dong}철거전문업체`,
      `${dong}철거전문`,
      `${dong}철거공사`,
      `${dong}철거비용`,
      `${dong}철거견적`,

      `${dong}점포철거`,
      `${dong}점포철거업체`,

      `${dong}매장철거`,
      `${dong}매장철거업체`,

      `${dong}상가철거`,
      `${dong}상가철거업체`,

      `${dong}폐업철거`,
      `${dong}폐업철거업체`,

      `${dong}원상복구`,
      `${dong}원상복구업체`,

      `${dong}부분철거`,
      `${dong}사무실철거`,
      `${dong}음식점철거`,
      `${dong}카페철거`,

      `${area}철거`,
      `${area}철거업체`,

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
      title: `${dong} 철거업체 | 더세이브`,
      description: `${dong} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인하세요.`,
      type: "website",
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function DongPage({
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

  const dong = decodeRegion(
    resolvedParams.dong
  );

  const path = [
    city,
    district,
    area,
    dong,
  ];

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    notFound();
  }

  const services = [
    {
      number: "01",
      title: `${dong} 철거업체`,
      description:
        "상가, 매장, 점포, 사무실 등 공간의 구조와 철거 범위를 확인하고 현장 상황에 필요한 작업 방향을 살펴봅니다.",
    },

    {
      number: "02",
      title: `${dong} 점포철거업체`,
      description:
        "점포 이전이나 폐업을 준비하는 경우 천장, 바닥, 가벽, 집기 및 내부 시설물의 철거 범위를 확인합니다.",
    },

    {
      number: "03",
      title: `${dong} 매장철거업체`,
      description:
        "매장 내부 구조와 기존 마감 상태를 확인하여 전체철거 또는 필요한 부분철거 범위를 살펴봅니다.",
    },

    {
      number: "04",
      title: `${dong} 상가철거업체`,
      description:
        "상가 내부 마감재와 시설물, 폐기물 반출 동선 및 작업 환경 등을 확인하여 필요한 철거 범위를 정합니다.",
    },

    {
      number: "05",
      title: `${dong} 폐업철거업체`,
      description:
        "폐업 일정과 임대차 계약 내용을 확인하고 내부 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",
    },

    {
      number: "06",
      title: `${dong} 원상복구`,
      description:
        "임대차 계약 및 임대인 요청사항에 따라 철거 후 필요한 원상복구 항목과 작업 범위를 확인합니다.",
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


          <span className="mx-2 text-neutral-600">
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


          <span className="mx-2 text-neutral-600">
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


          <span className="mx-2 text-neutral-600">
            /
          </span>


          <Link
            href={makeRegionUrl([
              city,
              district,
              area,
            ])}
            className="transition hover:text-[#ffd600]"
          >
            {area}
          </Link>


          <span className="mx-2 text-neutral-600">
            /
          </span>


          <strong className="text-[#ffd600]">
            {dong}
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
              {" · "}
              {dong}

            </p>


            <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">

              {dong} 철거업체

              <br />


              <span className="text-[#ffd600]">

                철거부터

                <br className="sm:hidden" />

                {" "}
                원상복구까지

              </span>

            </h1>


            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

              {city}
              {" "}
              {district}
              {" "}
              {area}
              {" "}
              {dong}에서 점포철거,
              매장철거, 상가철거,
              폐업철거, 부분철거 및
              원상복구가 필요하다면
              현장의 구조와 필요한
              작업 범위를 먼저 확인하는 것이
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
                href="#information"
                className="border border-white/30 bg-white/5 px-8 py-5 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600] sm:text-lg"
              >
                철거 정보 확인
              </a>

            </div>

          </div>


          {/* HERO RIGHT */}

          <div className="relative hidden min-h-[430px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              04
            </div>


            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                THE SAVE DEMOLITION
              </p>


              <strong className="mt-28 block text-3xl font-black leading-tight text-white">

                {dong} 철거,

                <br />

                현장부터 확인합니다.

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

            {dong} 철거를 알아볼 때

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
                집기 등 어떤 부분까지
                철거해야 하는지 확인하여
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

                엘리베이터와 주차 공간,
                폐기물 반출 동선,
                장비 진입 여부 등에 따라
                필요한 작업 방식이
                달라질 수 있습니다.

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
                요청사항을 확인하여
                철거 후 필요한 원상복구
                항목을 함께 살펴보는 것이
                좋습니다.

              </p>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================
          SERVICES
      =================================================== */}

      <section className="bg-[#080808] py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            SERVICE
          </p>


          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">

            {dong} 철거 서비스

          </h2>


          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

            {dong} 지역의 공간 구조와
            철거 유형에 따라 필요한
            작업 범위가 달라질 수 있습니다.

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
          SEO CONTENT
      =================================================== */}

      <section className="bg-[#171717] py-20 sm:py-24">

        <div className="mx-auto max-w-5xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL DEMOLITION INFORMATION
          </p>


          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">

            {dong} 철거업체를

            <br />

            알아보고 있다면

          </h2>


          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            <p>

              {dong} 철거업체를 알아볼 때에는
              단순히 공간의 평수만 확인하기보다
              현재 내부 구조와 철거 대상,
              폐기물의 종류와 양,
              반출 환경 등을 함께 살펴보는 것이
              중요합니다.

            </p>


            <p>

              {dong} 점포철거업체나{" "}

              {dong} 매장철거업체를
              알아보는 경우 천장, 바닥,
              가벽, 집기, 간판,
              주방시설 등 기존 시설 가운데
              어디까지 철거가 필요한지
              확인하는 것이 좋습니다.

            </p>


            <p>

              {dong} 상가철거의 경우에도
              공간의 업종과 내부 마감 상태에
              따라 작업 내용이 달라질 수
              있습니다. 부분철거가 가능한지
              또는 전체 철거가 필요한지
              현장을 기준으로 판단해야 합니다.

            </p>


            <p>

              {dong} 폐업철거를 준비하고 있다면
              임대차 계약서의 원상복구 조건도
              함께 확인하는 것이 중요합니다.
              유지해야 하는 시설과 철거가 필요한
              시설을 구분하면 불필요한 작업을
              줄이는 데 도움이 됩니다.

            </p>


            <p>

              {dong} 철거비용과 철거견적은
              면적 외에도 폐기물의 양,
              작업 난이도, 엘리베이터 사용
              가능 여부, 장비 진입 조건 및
              작업 시간 등에 따라
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
              {dong}에서
              점포철거, 매장철거,
              상가철거, 폐업철거,
              부분철거 및 원상복구를
              알아보는 경우 현장 조건과
              필요한 작업 범위를 확인하여
              진행 방향을 안내합니다.

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

            {dong} 철거 진행 절차

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

              {dong}
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
          BACK NAVIGATION
      =================================================== */}

      <section className="border-b border-white/10 bg-[#101010] py-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:flex-row sm:flex-wrap sm:px-6">

          <Link
            href={makeRegionUrl([
              city,
            ])}
            className="border border-white/20 px-6 py-4 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600]"
          >
            ← {city}
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


          <Link
            href={makeRegionUrl([
              city,
              district,
              area,
            ])}
            className="border border-white/20 px-6 py-4 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600]"
          >
            ← {area} 철거업체
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


            <Link
              href={makeRegionUrl([
                city,
                district,
                area,
              ])}
              className="transition hover:text-[#ffd600]"
            >
              {area}
            </Link>


            <span className="mx-3 text-neutral-600">
              ·
            </span>


            <strong className="text-white">
              {dong}
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