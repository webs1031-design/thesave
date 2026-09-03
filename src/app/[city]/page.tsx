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
   지역별 고정 콘텐츠 생성
   - 같은 지역은 항상 같은 문장
   - 지역이 달라지면 문장 조합도 달라짐
========================================================= */

function stableHash(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash =
      (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function pick<T>(
  items: readonly T[],
  seed: number,
  offset = 0
): T {
  return items[
    (seed + offset) % items.length
  ];
}

function buildCityContent(city: string) {
  const seed = stableHash(city);

  const heroDescriptions = [
    `${city}에서 점포나 매장의 철거를 준비하고 있다면 내부 구조와 기존 시설물, 폐기물 반출 조건을 먼저 살펴보는 것이 좋습니다. 철거 범위와 원상복구 항목을 구분하면 현장에 필요한 작업을 보다 구체적으로 확인할 수 있습니다.`,

    `${city} 지역의 상가, 매장, 사무실 철거는 공간의 크기뿐 아니라 천장과 바닥 마감, 가벽, 집기, 설비 상태에 따라 작업 내용이 달라질 수 있습니다. 현장을 기준으로 철거 대상과 유지할 시설을 구분하는 과정이 중요합니다.`,

    `${city}에서 폐업철거나 원상복구를 알아볼 때에는 임대차 계약 조건과 현재 매장 상태를 함께 확인해야 합니다. 철거해야 하는 시설과 남겨야 하는 시설을 미리 정리하면 작업 범위를 판단하는 데 도움이 됩니다.`,

    `${city} 철거 현장은 업종과 건물 구조에 따라 필요한 작업 방식이 달라질 수 있습니다. 점포철거부터 매장철거, 부분철거와 원상복구까지 현장 조건을 먼저 확인한 뒤 작업 범위를 정하는 것이 좋습니다.`,

    `${city} 지역에서 철거를 계획하고 있다면 단순히 평수만으로 판단하기보다 내부 마감재와 시설물, 작업 동선, 폐기물 반출 환경까지 함께 확인할 필요가 있습니다. 현장 조건에 맞는 철거 범위를 정하는 것이 우선입니다.`,
  ] as const;

  const guideTitles = [
    `${city} 철거 전 확인할 사항`,
    `${city} 철거 준비 가이드`,
    `${city} 철거 현장 체크사항`,
    `${city} 철거를 준비한다면`,
    `${city} 철거 범위 확인하기`,
  ] as const;

  const introTexts = [
    `철거는 같은 면적의 공간이라도 업종과 내부 시설에 따라 작업 범위가 달라집니다. ${city} 현장의 구조와 철거 대상부터 확인해보세요.`,

    `${city} 철거를 준비할 때에는 공간의 면적뿐 아니라 기존 시설과 마감 상태, 폐기물 반출 조건까지 함께 살펴보는 것이 중요합니다.`,

    `점포와 매장, 사무실은 각각 철거해야 하는 시설이 다를 수 있습니다. ${city} 현장의 현재 상태를 기준으로 필요한 작업을 구분해보세요.`,

    `${city}에서 철거를 알아보고 있다면 전체철거가 필요한지, 일부 시설만 철거하면 되는지부터 확인하는 것이 좋습니다.`,

    `철거 범위를 정확히 정하면 불필요한 작업을 줄이고 원상복구가 필요한 부분도 함께 확인할 수 있습니다.`,
  ] as const;

  const seoParagraph1 = [
    `${city} 철거업체를 알아볼 때 가장 먼저 확인할 부분은 실제 철거가 필요한 범위입니다. 같은 평수의 상가라도 천장 마감, 바닥재, 가벽, 전기시설, 집기와 주방설비 등의 상태에 따라 작업 내용은 달라질 수 있습니다. 따라서 면적만으로 철거 범위를 판단하기보다 현재 공간의 구조를 기준으로 확인하는 것이 좋습니다.`,

    `${city}에서 철거업체를 찾고 있다면 현장 내부에 어떤 시설이 남아 있는지부터 살펴볼 필요가 있습니다. 천장과 벽체, 바닥, 가벽, 간판, 집기처럼 철거 대상이 많을수록 작업 방식과 폐기물의 종류도 달라질 수 있기 때문에 실제 현장 조건을 함께 확인하는 것이 중요합니다.`,

    `${city} 철거는 건물의 용도와 기존 인테리어 상태에 따라 필요한 작업이 달라집니다. 음식점과 카페처럼 주방시설이 있는 공간과 일반 사무실, 판매점은 철거 대상 자체가 다르기 때문에 업종과 내부 구조를 기준으로 작업 범위를 구분하는 것이 좋습니다.`,
  ] as const;

  const seoParagraph2 = [
    `${city} 점포철거업체나 ${city} 매장철거업체를 알아보는 경우에는 영업 공간에 설치된 기존 시설 가운데 철거할 부분과 유지할 부분을 먼저 나누는 것이 좋습니다. 전체 내부를 철거해야 하는 현장도 있지만 바닥이나 가벽, 집기 등 일부 시설만 제거하는 부분철거가 필요한 경우도 있습니다.`,

    `${city} 점포철거와 매장철거는 폐업, 이전, 리모델링 등 철거 목적에 따라 범위가 달라질 수 있습니다. 기존 시설을 모두 철거해야 하는지 또는 새로운 인테리어를 위해 일부만 제거하면 되는지를 확인하면 필요한 작업 방향을 정하는 데 도움이 됩니다.`,

    `${city} 매장철거를 준비한다면 간판과 집기뿐 아니라 천장, 바닥, 가벽 및 내부 설비의 처리 여부도 확인해야 합니다. 점포의 현재 상태와 이후 공간 사용 계획에 따라 전체철거와 부분철거 가운데 필요한 범위를 판단할 수 있습니다.`,
  ] as const;

  const seoParagraph3 = [
    `${city} 상가철거나 ${city} 폐업철거에서는 원상복구 조건도 중요한 확인 항목입니다. 임대차 계약에 따라 기존 인테리어를 어느 수준까지 철거해야 하는지가 달라질 수 있으므로 임대인과 협의된 내용을 기준으로 작업 범위를 확인하는 것이 좋습니다.`,

    `${city}에서 폐업철거를 진행하는 경우에는 영업 종료 일정과 함께 임대차 계약상의 원상복구 범위를 확인할 필요가 있습니다. 계약 당시의 공간 상태와 임대인이 요구하는 복구 기준을 살펴보면 철거가 필요한 부분을 보다 명확하게 구분할 수 있습니다.`,

    `${city} 상가의 원상복구는 모든 시설을 무조건 철거하는 방식으로 진행되는 것은 아닙니다. 계약 조건이나 임대인의 요청에 따라 유지해야 하는 시설이 있을 수 있으므로 철거 전 복구 범위를 확인하는 과정이 필요합니다.`,
  ] as const;

  const seoParagraph4 = [
    `${city} 철거비용은 공간의 면적만으로 동일하게 정해지기 어렵습니다. 내부 마감재의 종류와 철거량, 폐기물의 양, 작업 층수, 엘리베이터 사용 여부, 차량과 장비의 접근 조건 등 여러 현장 요소가 작업 난이도에 영향을 줄 수 있습니다.`,

    `${city} 철거견적을 확인할 때에는 평수와 함께 실제 작업 환경을 살펴봐야 합니다. 폐기물을 건물 밖으로 이동하는 거리, 엘리베이터 이용 가능 여부, 차량 진입 조건과 철거 대상 시설의 종류 등에 따라 필요한 작업 인력과 방식이 달라질 수 있습니다.`,

    `${city} 철거 현장은 건물마다 작업 조건이 다르기 때문에 단순 면적만으로 비용을 판단하기에는 한계가 있습니다. 철거 대상의 양과 종류, 폐기물 반출 동선, 장비 사용 가능 여부와 작업 시간 등의 조건을 함께 확인하는 것이 좋습니다.`,
  ] as const;

  const seoParagraph5 = [
    `더세이브는 ${city} 지역에서 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거 및 원상복구를 알아보는 경우 현장의 현재 상태와 필요한 철거 범위를 확인하여 진행 방향을 안내합니다.`,

    `${city} 지역에서 철거가 필요한 경우 더세이브는 공간의 업종과 구조, 기존 시설물 및 원상복구 조건을 확인하고 현장에 필요한 철거 범위를 기준으로 상담을 진행합니다.`,

    `더세이브는 ${city} 철거 상담 시 공간의 크기만 확인하는 것이 아니라 철거 대상 시설과 작업 환경, 폐기물 반출 조건 등을 함께 살펴보고 필요한 작업 방향을 안내합니다.`,
  ] as const;

  return {
    heroDescription: pick(
      heroDescriptions,
      seed,
      0
    ),

    guideTitle: pick(
      guideTitles,
      seed,
      1
    ),

    introText: pick(
      introTexts,
      seed,
      2
    ),

    seoParagraphs: [
      pick(seoParagraph1, seed, 3),
      pick(seoParagraph2, seed, 5),
      pick(seoParagraph3, seed, 7),
      pick(seoParagraph4, seed, 9),
      pick(seoParagraph5, seed, 11),
    ],
  };
}

/* =========================================================
   SEO 메타데이터
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const city = decodeRegion(
    resolvedParams.city
  );

  if (!isSupportedCity(city)) {
    return {
      title:
        "지역 철거업체 | 더세이브",
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
      title:
        `${city} 철거업체 | 더세이브`,

      description:
        `${city} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인하세요.`,

      type: "website",
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function CityPage({
  params,
}: PageProps) {
  const resolvedParams = await params;

  const city = decodeRegion(
    resolvedParams.city
  );

  if (!isSupportedCity(city)) {
    notFound();
  }

  const childRegions = getChildren([
    city,
  ]);

  if (childRegions.length === 0) {
    notFound();
  }

  const content =
    buildCityContent(city);

  /* =======================================================
     지역별 서비스 설명
  ======================================================= */

  const seed =
    stableHash(`${city}-services`);

  const serviceDescriptions = {
    demolition: [
      `${city} 지역의 상가, 점포, 매장과 사무실 등 철거 대상 공간의 내부 구조를 확인하고 필요한 작업 범위를 살펴봅니다.`,

      `${city} 현장의 업종과 내부 마감 상태, 기존 시설물을 확인하여 전체철거 또는 부분철거에 필요한 범위를 구분합니다.`,

      `${city} 철거 현장의 공간 구조와 시설물 상태, 폐기물 반출 조건 등을 확인하여 필요한 작업 방향을 안내합니다.`,
    ],

    store: [
      `폐업이나 이전을 준비하는 ${city} 점포의 천장, 바닥, 가벽, 집기와 기존 시설 가운데 철거가 필요한 부분을 확인합니다.`,

      `${city} 점포의 현재 인테리어와 향후 사용 계획을 기준으로 유지할 시설과 철거할 시설을 구분합니다.`,

      `${city} 점포철거 시 내부 집기와 마감재, 간판 및 시설물 상태를 확인하여 필요한 철거 범위를 살펴봅니다.`,
    ],

    shop: [
      `${city} 매장의 내부 구조와 마감 상태를 살펴보고 전체철거 또는 일부 시설만 제거하는 부분철거 여부를 확인합니다.`,

      `판매점과 음식점, 카페 등 ${city} 매장의 업종에 따라 다른 내부 시설을 확인하고 필요한 철거 범위를 구분합니다.`,

      `${city} 매장철거는 기존 시설물과 집기, 천장 및 바닥 상태를 확인하여 현장에 맞는 작업 범위를 살펴봅니다.`,
    ],

    commercial: [
      `${city} 상가 내부의 마감재와 시설물뿐 아니라 폐기물 반출 동선과 장비 접근 조건까지 함께 확인합니다.`,

      `${city} 상가철거 시 건물의 작업 조건과 내부 시설, 폐기물 이동 환경 등을 살펴보고 필요한 철거 범위를 정합니다.`,

      `상가마다 구조와 작업 환경이 다르기 때문에 ${city} 현장의 시설물과 반출 조건을 기준으로 작업 내용을 확인합니다.`,
    ],

    closing: [
      `${city} 폐업철거를 준비할 경우 영업 종료 일정과 임대차 계약을 확인하고 철거와 원상복구가 필요한 범위를 살펴봅니다.`,

      `폐업을 앞둔 ${city} 점포는 내부 철거뿐 아니라 임대인과 협의한 원상복구 조건까지 함께 확인하는 것이 중요합니다.`,

      `${city} 폐업 현장의 기존 시설을 확인하고 계약 조건에 따라 철거할 부분과 복구할 부분을 구분합니다.`,
    ],

    restoration: [
      `${city} 원상복구는 임대차 계약과 임대인의 요청 내용을 기준으로 철거 후 필요한 복구 항목을 확인합니다.`,

      `${city} 상가의 계약 당시 상태와 현재 내부 구조를 비교하여 원상복구가 필요한 시설과 마감 범위를 살펴봅니다.`,

      `임대차 계약 종료를 준비하는 ${city} 현장의 철거 대상과 유지 시설을 확인하여 필요한 원상복구 범위를 구분합니다.`,
    ],
  };

  const services = [
    {
      number: "01",
      title: `${city} 철거업체`,
      description: pick(
        serviceDescriptions.demolition,
        seed,
        0
      ),
    },
    {
      number: "02",
      title: `${city} 점포철거업체`,
      description: pick(
        serviceDescriptions.store,
        seed,
        2
      ),
    },
    {
      number: "03",
      title: `${city} 매장철거업체`,
      description: pick(
        serviceDescriptions.shop,
        seed,
        4
      ),
    },
    {
      number: "04",
      title: `${city} 상가철거업체`,
      description: pick(
        serviceDescriptions.commercial,
        seed,
        6
      ),
    },
    {
      number: "05",
      title: `${city} 폐업철거업체`,
      description: pick(
        serviceDescriptions.closing,
        seed,
        8
      ),
    },
    {
      number: "06",
      title: `${city} 원상복구업체`,
      description: pick(
        serviceDescriptions.restoration,
        seed,
        10
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}

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


      {/* BREADCRUMB */}

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


      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">

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
              {content.heroDescription}
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


          <div className="relative hidden min-h-[430px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              01
            </div>

            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                THE SAVE DEMOLITION
              </p>

              <strong className="mt-28 block text-3xl font-black leading-tight text-white">
                {content.guideTitle}
              </strong>

              <div className="mt-8 h-1 w-24 bg-[#ffd600]" />

            </div>

          </div>

        </div>

      </section>


      {/* SERVICE */}

      <section className="bg-[#f4f4f1] py-20 text-black sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            DEMOLITION SERVICE
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
            {city} 철거 서비스
          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-700">
            {content.introText}
          </p>

          <div className="mt-14 grid gap-px bg-neutral-300 md:grid-cols-2 lg:grid-cols-3">

            {services.map(
              (service, index) => {
                const dark =
                  index === 1;

                const yellow =
                  index === 4;

                return (
                  <article
                    key={service.title}
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
                      {service.number}
                    </span>

                    <h3 className="mt-14 text-2xl font-black leading-tight sm:text-3xl">
                      {service.title}
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
                      {service.description}
                    </p>

                  </article>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* 무료 방문 견적 */}

      <EstimateBanner />


      {/* REGION LIST */}

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

            {city}의 세부 지역을 선택하면
            해당 지역의 점포철거, 매장철거,
            상가철거, 폐업철거 및 원상복구
            관련 내용을 확인할 수 있습니다.

          </p>


          <div className="mt-14 grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">

            {childRegions.map(
              (region) => (

                <Link
                  key={region.name}
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
                      {region.name} 철거업체
                    </strong>

                    <span className="text-2xl font-black text-[#ffd600] transition group-hover:text-black">
                      →
                    </span>

                  </div>

                  <p className="mt-5 text-base font-medium leading-7 text-neutral-300 transition group-hover:text-black/75">

                    {region.name} 점포철거 · 매장철거

                    <br />

                    상가철거 · 폐업철거 · 원상복구

                  </p>

                  {region.children &&
                    region.children.length > 0 && (

                      <p className="mt-5 text-sm font-bold text-[#ffd600] transition group-hover:text-black">

                        하위 지역{" "}
                        {region.children.length}개 →

                      </p>

                    )}

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* SEO INFORMATION */}

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

            {content.seoParagraphs.map(
              (paragraph, index) => (

                <p
                  key={`${city}-seo-${index}`}
                >
                  {paragraph}
                </p>

              )
            )}

          </div>

        </div>

      </section>


      {/* PROCESS */}

      <section className="bg-black py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            PROCESS
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {city} 철거 진행 절차
          </h2>

          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">

            {[
              [
                "01",
                "상담 내용 확인",
                `${city} 현장의 위치와 업종, 공간 크기 및 필요한 철거 내용을 먼저 확인합니다.`,
              ],

              [
                "02",
                "작업 범위 확인",
                "내부 구조와 기존 시설물을 살펴보고 철거할 부분과 유지할 부분을 구분합니다.",
              ],

              [
                "03",
                "현장 조건 검토",
                "폐기물 반출 동선과 장비 접근 여부, 원상복구 항목 등 실제 작업 조건을 확인합니다.",
              ],

              [
                "04",
                "일정 협의 및 진행",
                "확인된 작업 범위와 현장 조건을 기준으로 일정을 협의한 뒤 철거를 진행합니다.",
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
                    {description}
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      {/* CTA */}

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

              현장 위치와 업종,
              철거가 필요한 범위를
              알려주시면 상담을 도와드립니다.

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


      {/* FOOTER */}

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