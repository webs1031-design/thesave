import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import EstimateBanner from "../../../components/EstimateBanner";

import {
  decodeRegion,
  getChildren,
  isSupportedCity,
  isValidRegion,
  makeRegionUrl,
} from "../../../regions";

type PageProps = {
  params: Promise<{
    city: string;
    district: string;
  }>;
};

/* =========================================================
   SEO META
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const city = decodeRegion(resolvedParams.city);
  const district = decodeRegion(resolvedParams.district);

  const path = [city, district];

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    return {
      title: "지역 철거업체 | 더세이브",
    };
  }

  return {
    title: `${district} 철거업체 | 점포철거·매장철거·상가철거·폐업철거`,

    description: `${city} ${district} 철거업체 정보를 확인하세요. ${district} 점포철거업체, 매장철거업체, 상가철거업체, 폐업철거, 원상복구, 부분철거 및 지역별 철거 정보를 안내합니다.`,

    keywords: [
      `${district}철거`,
      `${district}철거업체`,
      `${district}철거전문업체`,
      `${district}철거전문`,
      `${district}철거공사`,
      `${district}철거비용`,
      `${district}철거견적`,

      `${district}점포철거`,
      `${district}점포철거업체`,

      `${district}매장철거`,
      `${district}매장철거업체`,

      `${district}상가철거`,
      `${district}상가철거업체`,

      `${district}폐업철거`,
      `${district}폐업철거업체`,

      `${district}원상복구`,
      `${district}원상복구업체`,

      `${district}부분철거`,
      `${district}사무실철거`,
      `${district}음식점철거`,
      `${district}카페철거`,

      `${city}철거`,
      `${city}철거업체`,
    ],

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${district} 철거업체 | 더세이브`,
      description: `${district} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 정보를 확인하세요.`,
      type: "website",
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function DistrictPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  const city = decodeRegion(
    resolvedParams.city
  );

  const district = decodeRegion(
    resolvedParams.district
  );

  const path = [
    city,
    district,
  ];

  /* 잘못된 지역이면 404 */
  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    notFound();
  }

  /*
   * regions.ts에서 해당 지역의
   * 하위 지역 자동 불러오기
   *
   * 서울 / 강남구
   * → 역삼동 / 대치동 / 청담동 ...
   *
   * 경기 / 고양시
   * → 덕양구 / 일산동구 / 일산서구
   *
   * 경기 / 김포시
   * → 북변동 / 고촌읍 / 양촌읍 ...
   *
   * 인천 / 남동구
   * → 구월동 / 간석동 / 논현동 ...
   */
  const childRegions =
    getChildren(path);

  if (
    childRegions.length === 0
  ) {
    notFound();
  }

  /*
   * 하위 지역에 또 children이 있으면
   * 시 → 구 → 동 구조
   *
   * 예:
   * 고양시 → 덕양구 → 주교동
   */
  const hasNestedRegions =
    childRegions.some(
      (region) =>
        region.children &&
        region.children.length > 0
    );

  /*
   * 페이지 제목용 지역 단계 이름
   */
  let localTitle =
    "지역별 철거업체";

  if (hasNestedRegions) {
    localTitle =
      "구별 철거업체";
  } else if (
    city === "서울"
  ) {
    localTitle =
      "동별 철거업체";
  } else if (
    district.endsWith("구")
  ) {
    localTitle =
      "동별 철거업체";
  } else {
    localTitle =
      "읍·면·동별 철거업체";
  }

  /* =======================================================
     SERVICE DATA
  ======================================================= */

  const services = [
    {
      number: "01",

      title:
        `${district} 철거업체`,

      description:
        "상가, 점포, 매장, 음식점, 카페, 사무실 등 다양한 공간의 구조와 철거 범위를 확인하여 필요한 작업 방향을 안내합니다.",
    },

    {
      number: "02",

      title:
        `${district} 점포철거업체`,

      description:
        "점포 이전이나 폐업을 준비할 때 내부 시설물과 집기, 가벽, 바닥 및 천장 등 필요한 철거 범위를 확인합니다.",
    },

    {
      number: "03",

      title:
        `${district} 매장철거업체`,

      description:
        "매장 내부 구조와 기존 마감 상태를 확인하여 전체철거 또는 필요한 부분철거 범위를 살펴봅니다.",
    },

    {
      number: "04",

      title:
        `${district} 상가철거업체`,

      description:
        "상가 내부 마감재와 시설물, 폐기물 반출 동선 및 장비 진입 조건 등을 확인하여 필요한 작업 범위를 정합니다.",
    },

    {
      number: "05",

      title:
        `${district} 폐업철거업체`,

      description:
        "폐업 일정과 임대차 계약 내용을 확인하고 내부 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",
    },

    {
      number: "06",

      title:
        `${district} 원상복구업체`,

      description:
        "임대차 계약과 임대인 요청사항을 기준으로 철거 후 필요한 원상복구 항목과 작업 범위를 확인합니다.",
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

        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-y-2 px-5 py-5 text-base font-medium text-neutral-200 sm:px-6">

          <Link
            href="/"
            className="transition hover:text-[#ffd600]"
          >
            HOME
          </Link>


          <span className="mx-3 text-neutral-500">
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


          <span className="mx-3 text-neutral-500">
            /
          </span>


          <strong className="text-[#ffd600]">
            {district}
          </strong>

        </div>

      </section>


      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:70px_70px]" />


        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">

          {/* HERO LEFT */}

          <div>

            <p className="mb-6 text-sm font-black tracking-[0.25em] text-[#ffd600] sm:text-base">

              {city}
              {" · "}
              {district}

            </p>


            <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">

              {district}
              {" "}
              철거업체

              <br />


              <span className="text-[#ffd600]">
                점포·매장·상가철거
              </span>

            </h1>


            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

              {city}
              {" "}
              {district}
              {" "}
              지역에서 점포철거,
              매장철거, 상가철거,
              폐업철거, 부분철거 및
              원상복구가 필요하다면
              현장 구조와 필요한 철거
              범위를 먼저 확인하는 것이
              중요합니다.

            </p>


            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/#contact"
                className="bg-[#ffd600] px-8 py-5 text-center text-lg font-black text-black transition hover:bg-white"
              >
                무료 철거 견적 신청
              </Link>


              <a
                href="#local"
                className="border border-white/30 bg-white/5 px-8 py-5 text-center text-lg font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600]"
              >
                지역 목록 보기
              </a>

            </div>

          </div>


          {/* HERO RIGHT */}

          <div className="relative hidden min-h-[420px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              02
            </div>


            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                LOCAL DEMOLITION
              </p>


              <strong className="mt-28 block text-3xl font-black leading-tight text-white">

                {district}
                {" "}
                철거,

                <br />

                지역별로 확인하세요.

              </strong>


              <div className="mt-8 h-1 w-24 bg-[#ffd600]" />

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          SERVICES
      =================================================== */}

      <section className="bg-[#f4f4f1] py-20 text-black sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            DEMOLITION SERVICE
          </p>


          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {district}
            {" "}
            철거 서비스

          </h2>


          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-700">

            철거 대상 공간과 현장 구조,
            기존 시설물과 폐기물의 양 등에
            따라 필요한 철거 범위와
            작업 방식은 달라질 수 있습니다.

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
          LOCAL CHILDREN
      =================================================== */}

      <section
        id="local"
        className="bg-[#080808] py-20 sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL AREA
          </p>


          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">

            {district}

            <br />

            {localTitle}

          </h2>


          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

            아래 지역을 선택하면
            해당 지역의 철거업체,
            점포철거업체, 매장철거업체,
            상가철거업체, 폐업철거 및
            원상복구 관련 정보를
            확인할 수 있습니다.

          </p>


          <div className="mt-14 grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">

            {childRegions.map(
              (child) => {

                const hasMore =
                  child.children &&
                  child.children.length > 0;


                return (

                  <Link
                    key={
                      child.name
                    }
                    href={makeRegionUrl([
                      city,
                      district,
                      child.name,
                    ])}
                    className="group min-h-[220px] border-b border-r border-white/20 bg-[#101010] p-7 transition hover:bg-[#ffd600] sm:p-8"
                  >

                    <p className="text-base font-bold text-neutral-300 transition group-hover:text-black/60">

                      {city}
                      {" · "}
                      {district}

                    </p>


                    <div className="mt-10 flex items-center justify-between gap-4">

                      <strong className="text-2xl font-black text-white transition group-hover:text-black sm:text-3xl">

                        {
                          child.name
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
                        child.name
                      }
                      {" "}
                      점포철거 · 매장철거

                      <br />

                      상가철거 · 폐업철거 · 원상복구

                    </p>


                    {hasMore && (

                      <p className="mt-5 text-sm font-black text-[#ffd600] transition group-hover:text-black">

                        하위 지역{" "}

                        {
                          child.children!
                            .length
                        }

                        개 →

                      </p>

                    )}

                  </Link>

                );
              }
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          SEO CONTENT
      =================================================== */}

      <section className="bg-[#171717] py-20 sm:py-24">

        <div className="mx-auto max-w-5xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL DEMOLITION GUIDE
          </p>


          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">

            {district}
            {" "}
            철거업체를

            <br />

            알아보고 있다면

          </h2>


          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            <p>

              {district}
              {" "}
              철거업체를 알아볼 때에는
              단순히 공간의 면적만
              확인하기보다 내부 구조와
              철거 대상, 폐기물의 종류와 양,
              반출 동선 및 작업 환경을
              함께 확인하는 것이 중요합니다.

            </p>


            <p>

              {district}
              {" "}
              점포철거업체나{" "}

              {district}
              {" "}
              매장철거업체를
              알아보는 경우 천장, 바닥,
              가벽, 집기, 주방시설,
              간판 등 기존 시설물 가운데
              어느 부분까지 철거해야 하는지
              확인하는 것이 좋습니다.

            </p>


            <p>

              {district}
              {" "}
              상가철거나{" "}

              {district}
              {" "}
              폐업철거를
              준비하고 있다면
              임대차 계약상의 원상복구
              범위도 함께 확인하는 것이
              좋습니다.

            </p>


            <p>

              철거가 필요한 부분과
              유지해야 하는 시설을
              미리 구분하면 불필요한
              작업을 줄이는 데 도움이
              될 수 있습니다.

            </p>


            <p>

              철거비용과 철거견적은
              면적뿐 아니라 내부 마감재,
              작업 난이도, 폐기물의 양,
              엘리베이터 사용 여부,
              장비 진입 조건과 폐기물
              반출 환경 등에 따라
              달라질 수 있습니다.

            </p>


            <p>

              더세이브는{" "}
              {city}
              {" "}
              {district}
              {" "}
              지역에서 점포철거,
              매장철거, 상가철거,
              폐업철거, 부분철거 및
              원상복구를 알아보는 경우
              현장 상황과 필요한 작업
              범위를 확인하여 진행
              방향을 안내합니다.

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

            {district}
            {" "}
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

              {district}
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

            ← {city} 철거업체

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


            <strong className="text-white">

              {district}

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