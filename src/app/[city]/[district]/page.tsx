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
   지역별 문구 자동 분산 함수
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

/* =========================================================
   SEO META
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    return {
      title:
        "지역 철거업체 | 더세이브",
    };
  }

  const seed = stableHash(
    `${city}-${district}`
  );

  const descriptions = [
    `${city} ${district} 철거업체를 알아보고 있다면 현장 구조와 철거 범위를 먼저 확인하세요. 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거와 원상복구 관련 정보를 안내합니다.`,

    `${city} ${district}에서 철거를 준비하고 있다면 공간의 상태와 작업 범위를 확인하는 것이 중요합니다. 점포철거업체, 매장철거업체, 상가철거업체 및 폐업철거 정보를 확인하세요.`,

    `${district} 철거업체 관련 정보를 확인하세요. 상가, 점포, 매장, 사무실 철거부터 폐업철거, 부분철거, 원상복구까지 현장 확인에 필요한 내용을 안내합니다.`,

    `${city} ${district} 점포철거와 매장철거를 준비할 때 확인해야 할 철거 범위와 현장 조건을 안내합니다. 상가철거, 폐업철거, 원상복구 관련 정보도 함께 확인할 수 있습니다.`,
  ] as const;

  return {
    title: `${district} 철거업체 | 점포철거·매장철거·상가철거·폐업철거`,

    description: pick(
      descriptions,
      seed
    ),

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
      title:
        `${district} 철거업체 | 더세이브`,

      description:
        `${district} 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인하세요.`,

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

  if (
    !isSupportedCity(city) ||
    !isValidRegion(path)
  ) {
    notFound();
  }

  const childRegions =
    getChildren(path);

  if (
    childRegions.length === 0
  ) {
    notFound();
  }

  const hasNestedRegions =
    childRegions.some(
      (region) =>
        region.children &&
        region.children.length > 0
    );

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
     지역별 문구 생성
  ======================================================= */

  const seed = stableHash(
    `${city}-${district}`
  );

  const heroTitles = [
    "현장 조건부터 확인하는 철거",
    "공간에 맞는 철거 범위 확인",
    "철거부터 원상복구까지",
    "매장부터 상가까지 철거 상담",
    "폐업과 이전을 위한 철거 안내",
  ] as const;

  const heroDescriptions = [
    `${city} ${district}에서 철거를 계획하고 있다면 공간의 면적뿐 아니라 내부 구조와 철거 대상, 폐기물 반출 환경을 함께 확인해야 합니다. 현장 상황을 기준으로 필요한 작업 범위를 살펴보세요.`,

    `${district} 점포나 매장, 상가의 철거는 공간마다 필요한 작업이 다를 수 있습니다. 천장과 바닥, 가벽, 집기 및 기존 시설물의 상태를 확인한 뒤 적절한 철거 범위를 정하는 것이 중요합니다.`,

    `${city} ${district} 지역에서 폐업이나 매장 이전을 준비하고 있다면 철거 범위와 원상복구 조건을 함께 살펴보는 것이 좋습니다. 현장 조건에 따라 필요한 작업 내용을 확인할 수 있습니다.`,

    `${district} 철거를 준비할 때에는 작업 공간과 폐기물 반출 동선, 장비 진입 조건, 유지해야 할 시설물을 함께 확인하는 과정이 필요합니다.`,

    `${city} ${district} 상가와 점포는 업종과 내부 마감 상태에 따라 철거 방식이 달라질 수 있습니다. 전체철거와 부분철거 여부를 현장 상황에 맞게 확인하는 것이 중요합니다.`,
  ] as const;

  const guideTitles = [
    "철거 전에 확인할 핵심 사항",
    "현장을 확인해야 하는 이유",
    "철거 범위를 정하는 기준",
    "철거 견적 전 확인할 내용",
    "원활한 철거를 위한 체크포인트",
  ] as const;

  const guideSets = [
    [
      {
        title: "내부 철거 범위",
        description:
          "천장, 벽체, 바닥, 가벽, 집기와 기존 시설물 가운데 철거해야 할 부분과 유지해야 할 부분을 먼저 구분합니다.",
      },
      {
        title: "폐기물 반출 환경",
        description:
          "철거 과정에서 발생하는 폐기물의 종류와 양, 건물 출입구와 엘리베이터 사용 여부 등 반출 환경을 확인합니다.",
      },
      {
        title: "원상복구 조건",
        description:
          "임대차 계약과 임대인 요청사항을 확인하여 철거 이후 필요한 원상복구 항목을 함께 살펴봅니다.",
      },
    ],

    [
      {
        title: "공간 구조 확인",
        description:
          "매장과 점포의 구조, 내부 마감재와 기존 설비를 확인하여 전체철거와 부분철거 범위를 구분합니다.",
      },
      {
        title: "작업 동선 확인",
        description:
          "작업자가 이동할 수 있는 공간과 폐기물 반출 경로, 주차 및 차량 접근 조건 등을 미리 확인합니다.",
      },
      {
        title: "철거 일정 확인",
        description:
          "폐업일이나 이전 일정, 건물의 작업 가능 시간 등을 고려하여 철거 진행 시기를 확인하는 것이 좋습니다.",
      },
    ],

    [
      {
        title: "철거 대상 확인",
        description:
          "바닥, 천장, 가벽, 간판, 주방시설, 집기 등 실제 철거가 필요한 항목을 구체적으로 확인합니다.",
      },
      {
        title: "현장 접근 조건",
        description:
          "엘리베이터와 계단, 차량 진입 여부 및 폐기물 적재 공간 등 현장의 작업 조건을 살펴봅니다.",
      },
      {
        title: "복구 범위 확인",
        description:
          "철거만 필요한지 또는 바닥과 벽체 등 추가적인 원상복구가 필요한지 계약 조건을 기준으로 확인합니다.",
      },
    ],
  ] as const;

  const selectedGuide =
    pick(
      guideSets,
      seed,
      2
    );

  /* =======================================================
     서비스 설명도 지역별 분산
  ======================================================= */

  const serviceDescriptions = {
    demolition: [
      "상가, 점포, 매장, 음식점, 카페, 사무실 등 공간의 구조와 기존 시설물을 확인하고 필요한 철거 범위를 살펴봅니다.",

      "철거 대상 공간의 내부 구조와 마감 상태, 작업 환경을 확인하여 전체철거 또는 부분철거 방향을 검토합니다.",

      "현장의 구조와 철거 대상 시설물을 확인하고 폐기물 반출 조건까지 고려하여 필요한 작업 내용을 살펴봅니다.",
    ],

    store: [
      "점포 이전이나 폐업을 준비할 때 천장, 바닥, 가벽, 집기 및 내부 시설물 가운데 필요한 철거 범위를 확인합니다.",

      "점포 내부의 기존 인테리어와 시설물을 살펴보고 유지할 부분과 철거할 부분을 구분하여 작업 범위를 확인합니다.",

      "폐업 또는 업종 변경을 준비하는 점포의 구조와 기존 설비를 확인하여 필요한 철거 항목을 살펴봅니다.",
    ],

    shop: [
      "매장 내부 구조와 기존 마감 상태를 확인하여 전체철거 또는 필요한 부분철거 범위를 살펴봅니다.",

      "매장의 천장과 바닥, 벽체, 진열시설 등 기존 인테리어 상태를 확인하여 철거 범위를 정합니다.",

      "매장 이전이나 리뉴얼을 준비할 때 기존 시설물과 인테리어 가운데 제거해야 할 부분을 확인합니다.",
    ],

    commercial: [
      "상가 내부 마감재와 시설물, 폐기물 반출 동선 및 장비 진입 조건 등을 확인하여 필요한 작업 범위를 정합니다.",

      "상가의 업종과 공간 구조를 기준으로 내부 시설물과 마감재의 철거 범위를 확인하고 현장 조건을 살펴봅니다.",

      "상가 건물의 작업 가능 조건과 폐기물 반출 환경을 확인하여 철거에 필요한 범위를 검토합니다.",
    ],

    closure: [
      "폐업 일정과 임대차 계약 내용을 확인하고 내부 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",

      "매장 폐업을 준비하는 경우 계약 종료 일정과 원상복구 조건을 확인하여 필요한 철거 항목을 구분합니다.",

      "폐업 시 남아 있는 시설물과 인테리어의 철거 여부를 확인하고 임대차 계약에 따른 복구 범위를 살펴봅니다.",
    ],

    restoration: [
      "임대차 계약과 임대인 요청사항을 기준으로 철거 후 필요한 원상복구 항목과 작업 범위를 확인합니다.",

      "철거가 끝난 뒤 필요한 바닥, 벽체 등 복구 항목을 확인하여 계약 조건에 맞는 원상복구 범위를 살펴봅니다.",

      "기존 공간을 임대 전 상태로 돌려놓아야 하는 경우 계약 내용과 현장 상태를 기준으로 필요한 복구 범위를 확인합니다.",
    ],
  } as const;

  const services = [
    {
      number: "01",
      title:
        `${district} 철거업체`,
      description: pick(
        serviceDescriptions.demolition,
        seed,
        1
      ),
    },

    {
      number: "02",
      title:
        `${district} 점포철거업체`,
      description: pick(
        serviceDescriptions.store,
        seed,
        2
      ),
    },

    {
      number: "03",
      title:
        `${district} 매장철거업체`,
      description: pick(
        serviceDescriptions.shop,
        seed,
        3
      ),
    },

    {
      number: "04",
      title:
        `${district} 상가철거업체`,
      description: pick(
        serviceDescriptions.commercial,
        seed,
        4
      ),
    },

    {
      number: "05",
      title:
        `${district} 폐업철거업체`,
      description: pick(
        serviceDescriptions.closure,
        seed,
        5
      ),
    },

    {
      number: "06",
      title:
        `${district} 원상복구업체`,
      description: pick(
        serviceDescriptions.restoration,
        seed,
        6
      ),
    },
  ];

  const seoIntro = [
    `${district}에서 철거업체를 알아볼 때에는 업체명이나 단순한 평수만 확인하기보다 실제 철거가 필요한 공간의 구조를 먼저 살펴보는 것이 중요합니다. 같은 면적의 매장이라도 내부 마감재와 시설물, 가벽의 수, 주방 설비 여부 등에 따라 필요한 작업 내용은 달라질 수 있습니다.`,

    `${district} 철거를 준비하는 경우 가장 먼저 확인해야 할 부분은 실제 작업 범위입니다. 천장과 벽체, 바닥을 모두 철거해야 하는 현장도 있지만 기존 시설 일부를 유지하면서 필요한 부분만 철거하는 경우도 있기 때문에 현장 상태를 기준으로 판단하는 것이 좋습니다.`,

    `${city} ${district} 지역에서 점포나 상가 철거를 계획하고 있다면 공간의 크기와 함께 내부 구조, 기존 인테리어, 폐기물 반출 조건을 확인해야 합니다. 철거 대상이 명확해야 필요한 작업과 원상복구 범위를 구분하기가 수월합니다.`,
  ] as const;

  const seoStore = [
    `${district} 점포철거업체나 ${district} 매장철거업체를 알아보는 경우에는 천장, 바닥, 가벽, 집기, 간판, 주방시설 등 기존 시설물 가운데 실제 철거가 필요한 항목을 구분하는 과정이 필요합니다. 매장 이전이나 업종 변경이라면 재사용할 시설물이 있는지도 함께 확인하는 것이 좋습니다.`,

    `${district} 점포철거와 매장철거는 기존 인테리어 상태에 따라 작업 내용이 달라질 수 있습니다. 바닥 마감재만 제거하는 부분철거부터 천장과 벽체, 내부 시설물을 모두 정리하는 전체철거까지 현장에 따라 필요한 범위가 달라집니다.`,

    `${district} 매장을 정리할 때에는 내부 집기와 시설물을 모두 철거해야 하는지, 일부 시설은 남겨두어야 하는지 먼저 확인하는 것이 좋습니다. 불필요한 철거를 줄이기 위해서는 작업 전 철거 대상과 유지 대상을 구분하는 과정이 중요합니다.`,
  ] as const;

  const seoCommercial = [
    `${district} 상가철거를 진행할 때에는 작업 공간뿐 아니라 건물의 이용 조건도 함께 확인할 필요가 있습니다. 엘리베이터 사용 가능 여부와 주차 공간, 폐기물 반출 동선, 차량 접근 조건 등에 따라 작업 방법이 달라질 수 있습니다.`,

    `${district} 상가의 경우 건물마다 작업 가능 시간과 폐기물 반출 방식이 다를 수 있습니다. 상가 관리 규정과 현장 접근 조건을 미리 확인하면 철거 일정과 작업 계획을 세우는 데 도움이 됩니다.`,

    `${district} 상가철거는 내부 시설물의 양과 구조뿐 아니라 폐기물을 외부로 이동시키는 환경도 중요합니다. 계단이나 엘리베이터 이용 조건, 출입구의 폭, 차량 접근 여부 등을 현장 확인 과정에서 함께 살펴보는 것이 좋습니다.`,
  ] as const;

  const seoClosure = [
    `${district} 폐업철거를 준비하고 있다면 임대차 계약서에 기재된 원상복구 조건을 함께 확인하는 것이 중요합니다. 철거해야 하는 시설과 유지해야 하는 시설을 구분하고 임대인과 복구 범위를 확인하면 작업 범위를 보다 명확하게 정할 수 있습니다.`,

    `${district}에서 폐업을 준비하는 점포라면 영업 종료 일정과 철거 일정뿐 아니라 임대차 계약의 원상복구 내용을 확인해야 합니다. 기존 인테리어를 어느 범위까지 제거해야 하는지 확인한 후 철거 계획을 세우는 것이 좋습니다.`,

    `${district} 폐업철거는 단순히 내부를 비우는 작업과는 차이가 있습니다. 임대인이 요구하는 원상복구 상태와 기존 시설물의 처리 여부를 확인해야 하며, 계약 조건에 따라 필요한 철거 범위가 달라질 수 있습니다.`,
  ] as const;

  const seoCost = [
    `${district} 철거비용과 철거견적은 면적만으로 결정하기 어렵습니다. 폐기물의 종류와 양, 내부 마감 상태, 작업 난이도, 엘리베이터 이용 여부, 장비 진입 조건과 작업 가능 시간 등 여러 현장 조건이 함께 영향을 줄 수 있습니다.`,

    `${district} 철거견적을 확인할 때에는 평수와 함께 철거할 시설물의 종류와 폐기물 발생량을 살펴보는 것이 좋습니다. 같은 크기의 공간이라도 업종과 인테리어 상태에 따라 작업 내용이 달라질 수 있기 때문입니다.`,

    `${district} 철거비용을 확인하려면 현장의 크기 외에도 철거 범위와 작업 환경을 함께 확인해야 합니다. 폐기물 반출이 어려운 현장이나 철거 대상 시설물이 많은 공간은 필요한 작업 과정이 달라질 수 있습니다.`,
  ] as const;

  const seoFinish = [
    `더세이브는 ${city} ${district} 지역에서 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거 및 원상복구를 알아보는 경우 현장 상황과 필요한 작업 범위를 확인하여 진행 방향을 안내합니다.`,

    `${city} ${district}에서 철거를 계획하고 있다면 현장의 구조와 필요한 철거 항목을 먼저 확인해 보세요. 더세이브는 점포, 매장, 상가, 사무실 등 공간의 상황을 확인하고 철거와 원상복구에 필요한 내용을 안내합니다.`,

    `더세이브는 ${district} 철거를 알아보는 고객이 현장 조건과 작업 범위를 확인할 수 있도록 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 상담을 진행합니다.`,
  ] as const;

  const processDescriptions = [
    [
      "지역과 업종, 평수 및 현재 공간 상태를 확인합니다.",
      "철거 대상과 현장 구조, 폐기물 반출 조건을 살펴봅니다.",
      "확인된 철거 범위와 현장 조건을 기준으로 견적 내용을 안내합니다.",
      "협의된 일정과 작업 범위에 맞춰 철거를 진행합니다.",
    ],

    [
      "폐업이나 이전 일정과 필요한 철거 내용을 확인합니다.",
      "내부 시설물과 유지할 부분, 철거할 부분을 구분합니다.",
      "현장 확인 내용을 바탕으로 필요한 작업 범위를 안내합니다.",
      "정해진 작업 범위와 일정에 따라 현장 철거를 진행합니다.",
    ],

    [
      "철거가 필요한 공간의 위치와 업종, 규모를 확인합니다.",
      "천장, 바닥, 가벽, 집기 등 실제 철거 대상을 확인합니다.",
      "폐기물과 작업 조건을 포함하여 견적에 필요한 내용을 확인합니다.",
      "현장 상황과 협의된 내용에 따라 철거 작업을 진행합니다.",
    ],
  ] as const;

  const selectedProcess =
    pick(
      processDescriptions,
      seed,
      4
    );

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

          <div>

            <p className="mb-6 text-sm font-black tracking-[0.25em] text-[#ffd600] sm:text-base">
              {city} · {district}
            </p>

            <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">

              {district} 철거업체

              <br />

              <span className="text-[#ffd600]">
                {pick(
                  heroTitles,
                  seed
                )}
              </span>

            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

              {pick(
                heroDescriptions,
                seed,
                1
              )}

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


          <div className="relative hidden min-h-[420px] lg:block">

            <div className="absolute right-0 top-0 text-[210px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,214,0,.18)]">
              02
            </div>

            <div className="absolute bottom-4 right-4 w-[390px] border border-white/20 bg-[#111] p-10">

              <p className="text-sm font-semibold tracking-[0.22em] text-neutral-300">
                LOCAL DEMOLITION
              </p>

              <strong className="mt-28 block text-3xl font-black leading-tight text-white">

                {district} 철거,

                <br />

                현장 조건부터 확인하세요.

              </strong>

              <div className="mt-8 h-1 w-24 bg-[#ffd600]" />

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          지역별 체크 포인트
      =================================================== */}

      <section className="bg-[#f4f4f1] py-20 text-black sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            DEMOLITION CHECK POINT
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {district}

            <br />

            {pick(
              guideTitles,
              seed,
              3
            )}

          </h2>

          <div className="mt-14 grid gap-px bg-neutral-300 md:grid-cols-3">

            {selectedGuide.map(
              (
                guide,
                index
              ) => (

                <article
                  key={
                    guide.title
                  }
                  className={
                    index === 1
                      ? "min-h-[340px] bg-[#111] p-8 text-white sm:p-9"
                      : index === 2
                      ? "min-h-[340px] bg-[#ffd600] p-8 text-black sm:p-9"
                      : "min-h-[340px] bg-white p-8 text-black sm:p-9"
                  }
                >

                  <span
                    className={
                      index === 1
                        ? "text-base font-black text-[#ffd600]"
                        : "text-base font-black text-neutral-500"
                    }
                  >
                    0{index + 1}
                  </span>

                  <h3 className="mt-16 text-2xl font-black sm:text-3xl">
                    {guide.title}
                  </h3>

                  <p
                    className={
                      index === 1
                        ? "mt-5 text-lg font-medium leading-8 text-neutral-100"
                        : "mt-5 text-lg font-medium leading-8 text-black/75"
                    }
                  >
                    {guide.description}
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          SERVICES
      =================================================== */}

      <section className="bg-[#080808] py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            DEMOLITION SERVICE
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] text-white sm:text-5xl">
            {district} 철거 서비스
          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">

            {district} 지역의 공간 구조와
            철거 대상에 따라 필요한 작업
            범위가 달라질 수 있습니다.

          </p>

          <div className="mt-14 divide-y divide-white/15 border-y border-white/15">

            {services.map(
              (service) => (

                <div
                  key={
                    service.number
                  }
                  className="grid gap-4 py-8 sm:grid-cols-[70px_1fr_1.4fr] sm:gap-6 sm:py-10"
                >

                  <span className="text-base font-black text-[#ffd600]">
                    {service.number}
                  </span>

                  <h3 className="text-2xl font-black text-white">
                    {service.title}
                  </h3>

                  <p className="text-lg font-medium leading-8 text-neutral-200">
                    {service.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ===================================================
          무료 방문 견적
      =================================================== */}

      <EstimateBanner />


      {/* ===================================================
          LOCAL CHILDREN
      =================================================== */}

      <section
        id="local"
        className="bg-[#f4f4f1] py-20 text-black sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-neutral-600">
            LOCAL AREA
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {district}

            <br />

            {localTitle}

          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-700">

            아래 지역을 선택하면
            해당 지역의 점포철거,
            매장철거, 상가철거,
            폐업철거 및 원상복구
            관련 정보를 확인할 수 있습니다.

          </p>

          <div className="mt-14 grid border-l border-t border-neutral-300 sm:grid-cols-2 lg:grid-cols-3">

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
                    className="group min-h-[220px] border-b border-r border-neutral-300 bg-white p-7 transition hover:bg-[#ffd600] sm:p-8"
                  >

                    <p className="text-base font-bold text-neutral-500">
                      {city} · {district}
                    </p>

                    <div className="mt-10 flex items-center justify-between gap-4">

                      <strong className="text-2xl font-black text-black sm:text-3xl">

                        {child.name} 철거업체

                      </strong>

                      <span className="text-2xl font-black text-black">
                        →
                      </span>

                    </div>

                    <p className="mt-5 text-base font-medium leading-7 text-neutral-700">

                      {child.name} 점포철거 · 매장철거

                      <br />

                      상가철거 · 폐업철거 · 원상복구

                    </p>

                    {hasMore && (

                      <p className="mt-5 text-sm font-black text-black">

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

            {district} 철거,

            <br />

            현장에 따라 달라집니다

          </h2>

          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            <p>
              {pick(
                seoIntro,
                seed
              )}
            </p>

            <p>
              {pick(
                seoStore,
                seed,
                1
              )}
            </p>

            <p>
              {pick(
                seoCommercial,
                seed,
                2
              )}
            </p>

            <p>
              {pick(
                seoClosure,
                seed,
                3
              )}
            </p>

            <p>
              {pick(
                seoCost,
                seed,
                4
              )}
            </p>

            <p>
              {pick(
                seoFinish,
                seed,
                5
              )}
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

            {district} 철거 진행 절차

          </h2>

          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">

            {[
              [
                "01",
                "상담 접수",
                selectedProcess[0],
              ],

              [
                "02",
                "현장 확인",
                selectedProcess[1],
              ],

              [
                "03",
                "견적 안내",
                selectedProcess[2],
              ],

              [
                "04",
                "철거 진행",
                selectedProcess[3],
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

              {district} 철거 견적이

              <br className="sm:hidden" />

              {" "}필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              지역, 업종, 평수와
              필요한 철거 내용을 알려주세요.

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