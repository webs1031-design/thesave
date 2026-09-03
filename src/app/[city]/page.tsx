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
   지역별 고유 콘텐츠 생성
========================================================= */

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function pick<T>(
  items: readonly T[],
  seed: number,
  offset = 0
): T {
  return items[
    (seed + offset * 7919) %
      items.length
  ];
}

function buildRegionalCopy(
  city: string
) {
  const seed =
    stableHash(
      `the-save-demolition-${city}`
    );

  const heroDescriptions = [
    `${city} 지역에서 철거를 준비하고 있다면 공간의 면적뿐 아니라 내부 구조와 기존 시설물, 폐기물 반출 조건을 함께 확인하는 것이 중요합니다. 점포와 매장, 상가, 사무실 등 현장에 필요한 철거 범위를 먼저 살펴보세요.`,

    `${city} 철거는 같은 규모의 공간이라도 업종과 기존 인테리어 상태에 따라 필요한 작업이 달라질 수 있습니다. 전체철거인지 부분철거인지, 폐업 후 원상복구까지 필요한지 현장 기준으로 확인하는 것이 좋습니다.`,

    `${city}에서 점포나 매장 철거를 계획하고 있다면 천장과 바닥, 벽체, 집기, 설비 가운데 실제 제거할 시설물을 먼저 구분해야 합니다. 건물의 작업 조건과 폐기물 이동 동선도 함께 살펴보는 것이 중요합니다.`,

    `${city} 상가철거와 폐업철거는 내부 구조뿐 아니라 임대차 계약 조건과 현장 환경에 따라서도 작업 범위가 달라질 수 있습니다. 철거와 함께 원상복구가 필요한지도 미리 확인하는 것이 좋습니다.`,

    `${city} 철거 현장은 층수와 출입 환경, 엘리베이터 사용 여부, 차량 접근성 등에 따라 필요한 작업 방식이 달라질 수 있습니다. 실제 공간의 조건을 기준으로 철거 범위를 확인하는 것이 중요합니다.`,
  ] as const;

  const heroSubTitles = [
    "점포·매장·상가철거",
    "철거부터 원상복구까지",
    "상가·사무실 철거 상담",
    "폐업철거와 원상복구",
    "현장에 맞는 철거 진행",
  ] as const;

  const serviceIntros = [
    `${city} 지역의 상가와 점포, 매장, 사무실은 공간의 구조와 기존 시설물이 서로 다르기 때문에 현장 상태를 기준으로 필요한 철거 범위를 확인하는 것이 중요합니다.`,

    `철거 대상 공간의 업종과 내부 구조, 마감재와 폐기물의 종류에 따라 필요한 작업 범위와 진행 방법은 달라질 수 있습니다.`,

    `철거는 단순히 공간의 평수만으로 작업 내용을 판단하기 어렵습니다. 천장과 바닥, 벽체, 집기와 설비 등 실제 철거 대상을 함께 확인해야 합니다.`,

    `전체철거와 부분철거, 폐업철거, 원상복구 가운데 어떤 작업이 필요한지에 따라 준비해야 할 내용도 달라질 수 있습니다.`,

    `${city} 철거를 계획한다면 현장 내부 시설물과 작업 환경을 먼저 확인하여 필요한 공정과 철거 범위를 구체적으로 정하는 것이 좋습니다.`,
  ] as const;

  const regionDescriptions = [
    `${city}의 세부 지역을 선택하면 해당 지역의 철거업체, 점포철거, 매장철거, 상가철거, 폐업철거 및 원상복구 관련 정보를 확인할 수 있습니다.`,

    `${city} 안에서도 지역과 건물 형태에 따라 철거 현장의 조건은 달라질 수 있습니다. 아래 지역을 선택하여 세부 철거 정보를 확인하세요.`,

    `철거가 필요한 ${city} 지역을 선택하면 점포와 매장, 상가, 사무실 철거 및 폐업 후 원상복구에 대한 지역별 정보를 확인할 수 있습니다.`,

    `아래 ${city} 세부 지역을 통해 각 지역의 철거업체와 점포철거, 매장철거, 상가철거, 폐업철거 정보를 확인할 수 있습니다.`,

    `${city} 지역별 철거 정보를 확인하려면 아래 지역을 선택하세요. 각 지역의 상가와 매장, 점포 철거 및 원상복구 관련 안내를 확인할 수 있습니다.`,
  ] as const;

  const seo1 = [
    `${city} 철거업체를 알아볼 때에는 단순히 공간의 면적만 확인하기보다 내부 구조와 철거 대상의 종류를 함께 살펴보는 것이 중요합니다. 같은 규모의 공간이라도 천장과 바닥, 가벽, 집기, 설비의 구성에 따라 필요한 철거 공정은 달라질 수 있습니다.`,

    `${city}에서 철거를 계획하고 있다면 현재 공간의 상태와 철거 목적을 먼저 확인하는 것이 좋습니다. 이전이나 리뉴얼을 위한 부분철거인지, 폐업 후 전체철거인지에 따라 필요한 작업 내용이 달라질 수 있기 때문입니다.`,

    `${city} 지역에서 철거업체를 찾는 경우 천장과 벽체, 바닥, 집기와 설비 가운데 어떤 시설물을 제거해야 하는지 먼저 구분하는 것이 중요합니다. 철거 대상이 명확할수록 작업 범위를 보다 구체적으로 확인할 수 있습니다.`,

    `${city} 철거는 공간의 평수만으로 작업 내용을 판단하기 어렵습니다. 기존 인테리어 상태와 시설물, 폐기물 발생량, 건물의 작업 환경을 함께 확인하는 것이 좋습니다.`,

    `${city}에서 점포나 매장 철거를 준비한다면 철거할 시설과 유지할 시설을 먼저 구분하는 것이 중요합니다. 현장 구조와 작업 범위를 함께 살펴보면 필요한 공정을 정하는 데 도움이 됩니다.`,
  ] as const;

  const seo2 = [
    `${city} 점포철거업체를 알아보는 경우에는 가벽과 바닥, 천장, 집기, 간판 등 기존 시설물 가운데 철거가 필요한 항목을 확인해야 합니다. 점포 이전이나 폐업 목적에 따라서도 필요한 철거 범위는 달라질 수 있습니다.`,

    `${city} 매장철거업체를 찾는다면 진열시설과 카운터, 바닥재, 벽면 마감, 천장 구조 등 기존 인테리어 상태를 먼저 확인하는 것이 좋습니다. 리뉴얼을 위한 부분철거라면 유지해야 할 시설도 함께 구분해야 합니다.`,

    `${city} 점포철거나 매장철거는 업종과 내부 시설물 구성에 따라 필요한 작업이 달라질 수 있습니다. 음식점과 카페, 소매점, 사무공간 등 공간의 용도를 기준으로 철거 대상을 확인하는 것이 중요합니다.`,

    `점포나 매장을 정리할 때에는 내부 마감재뿐 아니라 집기와 간판, 주방시설, 각종 설비의 철거 여부도 함께 확인해야 합니다. ${city} 현장의 현재 상태를 기준으로 필요한 범위를 정하는 것이 좋습니다.`,

    `${city}의 매장과 점포는 각 공간마다 기존 시설물과 인테리어 구성이 다릅니다. 전체철거인지 부분철거인지 확인한 뒤 실제 필요한 철거 항목을 살펴보는 것이 중요합니다.`,
  ] as const;

  const seo3 = [
    `${city} 상가철거를 준비한다면 건물의 출입 조건과 작업 가능 시간, 폐기물 이동 경로를 함께 확인해야 합니다. 상가마다 공용부 이용 기준이나 관리 규정이 다를 수 있으므로 작업 전에 확인하는 것이 좋습니다.`,

    `${city} 상가철거업체를 알아볼 때에는 내부 시설물뿐 아니라 엘리베이터, 주차 공간, 차량 접근성 등 건물의 작업 환경도 함께 살펴보는 것이 중요합니다.`,

    `상가 내부 철거는 기존 마감재와 설비의 종류에 따라 작업 내용이 달라질 수 있습니다. ${city} 현장의 바닥과 벽체, 천장 및 시설물 상태를 기준으로 철거 범위를 정하는 것이 좋습니다.`,

    `${city} 상가철거는 폐기물을 이동할 수 있는 동선과 장비 진입 조건에 따라서도 작업 방식이 달라질 수 있습니다. 실제 건물 환경을 확인하여 철거 계획을 세우는 것이 중요합니다.`,

    `상가철거를 진행할 때에는 철거 대상뿐 아니라 작업 시간과 공용 공간 사용 여부, 폐기물 적재 위치까지 함께 확인하는 것이 좋습니다. ${city} 지역에서도 현장별 조건은 서로 다를 수 있습니다.`,
  ] as const;

  const seo4 = [
    `${city} 폐업철거를 준비하고 있다면 임대차 계약상의 원상복구 조건도 함께 확인하는 것이 중요합니다. 내부 시설물을 철거하는 것과 별도로 바닥이나 벽면, 천장을 복구해야 하는 경우가 있을 수 있습니다.`,

    `폐업 후 임대 공간을 반환해야 한다면 철거 범위와 원상복구 범위를 구분하여 확인하는 것이 좋습니다. ${city} 현장의 계약 조건과 임대인 요청사항을 미리 확인하면 필요한 작업을 정하는 데 도움이 됩니다.`,

    `${city} 폐업철거에서는 영업 종료 일정과 건물 인도 일정을 함께 고려해야 합니다. 철거 이후 필요한 원상복구까지 확인하면 전체 일정을 계획하기 수월합니다.`,

    `폐업철거는 기존 인테리어를 제거하는 작업만으로 끝나지 않을 수 있습니다. ${city} 지역의 임대 공간이라면 계약 당시 반환 조건과 필요한 복구 항목을 함께 확인하는 것이 좋습니다.`,

    `${city}에서 폐업을 준비하는 점포나 매장은 내부 철거뿐 아니라 간판 제거, 시설물 철거, 마감 복구 등이 필요한지도 함께 살펴봐야 합니다.`,
  ] as const;

  const seo5 = [
    `${city} 철거비용과 철거견적은 단순히 면적으로 결정되는 것이 아니라 폐기물의 양과 종류, 건물 층수, 엘리베이터 사용 여부, 장비 진입 조건과 작업 난이도 등에 따라 달라질 수 있습니다.`,

    `철거견적을 확인할 때에는 평당 가격만 비교하기보다 어떤 작업이 견적 범위에 포함되는지 살펴보는 것이 좋습니다. ${city} 현장의 철거 대상과 폐기물 처리, 원상복구 여부를 함께 확인해야 합니다.`,

    `같은 규모의 공간이라도 시설물이 많거나 폐기물 반출이 어려운 경우 작업 방식과 필요한 인력이 달라질 수 있습니다. 따라서 ${city} 철거비용은 실제 현장 조건을 기준으로 확인하는 것이 좋습니다.`,

    `${city} 철거견적은 천장과 바닥, 벽체, 집기, 설비 등 철거 대상의 양과 폐기물 발생량에 따라 달라질 수 있습니다. 현장 사진이나 방문 확인을 통해 작업 범위를 구체화하는 것이 좋습니다.`,

    `철거비용을 알아볼 때에는 철거 공사뿐 아니라 폐기물 처리와 원상복구 같은 후속 작업이 필요한지도 함께 확인해야 합니다. ${city} 현장의 조건에 따라 전체 작업 범위는 달라질 수 있습니다.`,
  ] as const;

  const seo6 = [
    `더세이브는 ${city} 지역에서 점포철거, 매장철거, 상가철거, 사무실철거, 폐업철거와 원상복구를 알아보는 경우 현장 조건과 필요한 작업 범위를 확인하여 상담을 진행합니다.`,

    `${city}에서 철거를 준비하고 있다면 더세이브를 통해 공간의 업종과 면적, 철거 대상과 원상복구 필요 여부를 상담할 수 있습니다. 현장 상황에 필요한 작업 방향을 확인합니다.`,

    `더세이브는 ${city}의 상가와 점포, 매장, 사무실 등 다양한 공간에서 필요한 철거 범위를 확인합니다. 부분철거부터 폐업 후 원상복구까지 현장 조건을 기준으로 상담합니다.`,

    `${city}에서 상가나 매장 철거를 계획하고 있다면 현재 공간의 상태와 필요한 철거 내용을 알려주세요. 더세이브는 현장 조건을 살펴보고 필요한 작업 범위를 안내합니다.`,

    `${city} 점포철거와 매장철거, 상가철거, 폐업철거 또는 원상복구가 필요한 경우 현장 사진과 공간의 업종, 면적 등을 기준으로 상담할 수 있습니다.`,
  ] as const;

  const processConsult = [
    "지역과 업종, 공간의 면적과 필요한 철거 내용을 확인하여 기본 상담을 진행합니다.",
    "철거가 필요한 공간의 위치와 업종, 규모, 예상 작업 범위를 먼저 확인합니다.",
    "현장 주소와 공간 용도, 철거 목적과 원하는 작업 일정을 확인합니다.",
    "점포나 매장의 현재 상태와 필요한 철거 항목, 작업 시기를 확인합니다.",
    "철거할 공간의 기본 정보와 필요한 작업 내용을 확인하여 상담을 시작합니다.",
  ] as const;

  const processVisit = [
    "현장의 내부 구조와 시설물, 폐기물 반출 동선 및 작업 환경을 확인합니다.",
    "철거 대상과 유지해야 할 시설물, 장비 진입 가능 여부 등을 현장에서 살펴봅니다.",
    "천장과 바닥, 벽체, 집기 등 실제 철거 대상과 작업 조건을 확인합니다.",
    "출입 조건과 폐기물 이동 경로, 작업 공간 등을 확인하여 필요한 공정을 살펴봅니다.",
    "현장을 확인하면서 철거 범위와 작업 난이도, 원상복구 필요 여부를 함께 살펴봅니다.",
  ] as const;

  const processEstimate = [
    "확인된 철거 범위와 현장 조건을 기준으로 필요한 견적 내용을 안내합니다.",
    "현장에서 확인한 작업 항목과 폐기물 처리 범위를 기준으로 견적을 안내합니다.",
    "철거 대상과 작업 방식, 원상복구 여부를 기준으로 필요한 견적을 정리합니다.",
    "현장 환경과 필요한 철거 공정을 반영하여 작업 범위와 견적을 안내합니다.",
    "현장 확인 내용을 기준으로 필요한 작업 항목과 견적 내용을 안내합니다.",
  ] as const;

  const processWork = [
    "협의된 작업 범위와 일정에 맞춰 철거 및 필요한 후속 작업을 진행합니다.",
    "확정된 일정과 철거 대상에 따라 현장 작업을 순서대로 진행합니다.",
    "사전에 확인한 공정과 작업 범위를 기준으로 현장 철거를 진행합니다.",
    "협의된 철거 내용과 원상복구 범위에 맞춰 필요한 작업을 진행합니다.",
    "현장 상황과 협의된 일정에 따라 철거 공정을 진행합니다.",
  ] as const;

  return {
    seed,

    heroDescription: pick(
      heroDescriptions,
      seed,
      1
    ),

    heroSubTitle: pick(
      heroSubTitles,
      seed,
      2
    ),

    serviceIntro: pick(
      serviceIntros,
      seed,
      3
    ),

    regionDescription: pick(
      regionDescriptions,
      seed,
      4
    ),

    seo1: pick(
      seo1,
      seed,
      5
    ),

    seo2: pick(
      seo2,
      seed,
      6
    ),

    seo3: pick(
      seo3,
      seed,
      7
    ),

    seo4: pick(
      seo4,
      seed,
      8
    ),

    seo5: pick(
      seo5,
      seed,
      9
    ),

    seo6: pick(
      seo6,
      seed,
      10
    ),

    processConsult: pick(
      processConsult,
      seed,
      11
    ),

    processVisit: pick(
      processVisit,
      seed,
      12
    ),

    processEstimate: pick(
      processEstimate,
      seed,
      13
    ),

    processWork: pick(
      processWork,
      seed,
      14
    ),
  };
}

/* =========================================================
   SEO 메타데이터
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams =
    await params;

  const city =
    decodeRegion(
      resolvedParams.city
    );

  if (
    !isSupportedCity(city)
  ) {
    return {
      title:
        "지역 철거업체 | 더세이브",
    };
  }

  const copy =
    buildRegionalCopy(city);

  const metaTitles = [
    `${city} 철거업체 | 점포·매장·상가·폐업철거`,
    `${city} 철거 | 상가철거·점포철거·원상복구`,
    `${city} 철거업체 | 매장·사무실·폐업철거`,
    `${city} 철거업체 | 상가·점포 원상복구 상담`,
    `${city} 철거 | 점포철거·매장철거 상담`,
  ] as const;

  const metaDescriptions = [
    `${city} 철거업체를 알아보고 있다면 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거와 원상복구에 필요한 현장 조건을 확인하세요.`,

    `${city} 상가철거와 점포철거, 매장철거, 사무실철거 및 폐업 후 원상복구 관련 정보를 확인하세요. 현장 구조와 철거 범위에 따라 필요한 내용을 안내합니다.`,

    `${city}에서 철거를 준비할 때 필요한 작업 범위와 폐기물 반출 조건, 원상복구 여부를 확인해보세요.`,

    `${city} 점포·매장·상가 철거를 계획하고 있다면 내부 시설물과 현장 작업 조건을 먼저 살펴보는 것이 중요합니다. 폐업철거와 원상복구 정보도 확인하세요.`,

    `${city} 철거업체를 찾고 있다면 상가, 점포, 매장, 사무실의 철거 대상과 원상복구 범위를 확인하세요.`,
  ] as const;

  const title =
    pick(
      metaTitles,
      copy.seed,
      21
    );

  const description =
    pick(
      metaDescriptions,
      copy.seed,
      22
    );

  return {
    title,

    description,

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
      title,
      description,
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
  const resolvedParams =
    await params;

  const city =
    decodeRegion(
      resolvedParams.city
    );

  if (
    !isSupportedCity(city)
  ) {
    notFound();
  }

  const childRegions =
    getChildren([
      city,
    ]);

  if (
    childRegions.length === 0
  ) {
    notFound();
  }

  const copy =
    buildRegionalCopy(city);

  /* =======================================================
     서비스 설명
  ======================================================= */

  const serviceDescriptions = {
    demolition: [
      "상가와 점포, 매장, 사무실 등 공간의 구조와 기존 시설물을 확인하여 필요한 철거 범위를 살펴봅니다.",

      "천장과 벽체, 바닥, 가벽, 집기 등 내부 시설물의 상태를 확인하여 전체철거 또는 부분철거 범위를 정합니다.",

      "업종과 기존 인테리어 구성을 확인하고 실제 제거해야 하는 시설물을 기준으로 철거 작업 방향을 살펴봅니다.",

      "현장의 공간 구조와 철거 대상, 폐기물 발생 범위를 확인하여 필요한 공정을 검토합니다.",

      "철거 목적과 공간의 현재 상태를 확인하여 시설물 제거와 후속 작업에 필요한 범위를 살펴봅니다.",
    ],

    store: [
      "점포 이전이나 폐업을 준비하는 경우 천장, 바닥, 가벽, 집기와 기존 설비 가운데 필요한 철거 대상을 확인합니다.",

      "점포 내부 인테리어와 시설물을 살펴보고 영업 종료 또는 이전에 필요한 철거 범위를 정합니다.",

      "점포의 업종과 현재 내부 상태를 기준으로 제거할 시설과 유지해야 할 시설을 구분하여 확인합니다.",

      "임대 점포의 철거에서는 기존 시설물과 마감재 가운데 실제 철거해야 하는 부분을 먼저 살펴봅니다.",

      "점포 정리를 준비할 때에는 내부 시설물과 집기, 간판 등의 처리 여부를 함께 확인하는 것이 좋습니다.",
    ],

    shop: [
      "매장 내부의 진열시설과 카운터, 바닥, 벽면, 천장 등을 확인하여 필요한 철거 범위를 구분합니다.",

      "매장 리뉴얼이나 이전, 폐업 목적에 따라 전체철거 또는 부분철거에 필요한 공정을 살펴봅니다.",

      "매장의 기존 인테리어와 시설물 배치를 확인하여 철거할 부분과 유지할 부분을 구분합니다.",

      "업종과 내부 마감 상태를 기준으로 매장에 필요한 철거 항목과 작업 범위를 확인합니다.",

      "매장에 설치된 집기와 설비, 마감재 상태를 확인하고 실제 철거가 필요한 부분을 살펴봅니다.",
    ],

    commercial: [
      "상가 내부 시설물과 건물 출입 조건, 폐기물 반출 동선, 장비 진입 가능 여부를 함께 확인하여 철거 범위를 살펴봅니다.",

      "상가철거는 내부 공간뿐 아니라 작업 가능 시간과 공용부 이용 조건 등 건물 환경을 함께 확인하는 것이 중요합니다.",

      "상가의 기존 마감재와 설비를 확인하고 폐기물 이동 경로와 차량 접근성 등을 함께 살펴봅니다.",

      "상가 내부의 철거 대상과 건물 작업 환경을 기준으로 필요한 공정과 진행 방법을 확인합니다.",

      "상가 건물의 출입 환경과 내부 시설물, 폐기물 적재 조건 등을 확인하여 현장에 필요한 철거 방법을 검토합니다.",
    ],

    closing: [
      "폐업 일정과 임대차 종료 조건을 확인하여 매장 내부 철거와 필요한 원상복구 범위를 함께 살펴봅니다.",

      "영업 종료 후 공간 반환을 준비한다면 철거 대상 시설물과 임대인의 원상복구 요청사항을 확인해야 합니다.",

      "폐업철거에서는 집기와 시설물 제거, 간판 철거, 내부 마감 철거와 원상복구 여부를 함께 확인하는 것이 좋습니다.",

      "폐업 후 건물 인도 일정에 맞춰 필요한 철거 범위와 후속 복구 항목을 살펴봅니다.",

      "점포 폐업을 준비할 때에는 내부 철거와 함께 임대 공간 반환에 필요한 원상복구 범위를 확인해야 합니다.",
    ],

    restore: [
      "임대차 계약과 임대인 요청사항을 확인하여 철거 이후 필요한 바닥, 벽면, 천장 등의 원상복구 범위를 살펴봅니다.",

      "공간을 반환해야 하는 상태에 따라 기존 시설물 철거와 별도로 필요한 복구 항목을 확인합니다.",

      "원상복구는 철거 범위와 계약 내용을 함께 살펴보고 실제 복구가 필요한 부분을 정하는 것이 중요합니다.",

      "철거 후 공간을 어떤 상태로 인도해야 하는지 확인하고 필요한 마감 및 복구 항목을 살펴봅니다.",

      "계약 당시의 상태와 임대인 요청 내용을 기준으로 철거 이후 필요한 원상복구 작업을 확인합니다.",
    ],
  } as const;

  const services = [
    {
      number: "01",
      title:
        `${city} 철거업체`,
      description: pick(
        serviceDescriptions.demolition,
        copy.seed,
        31
      ),
    },

    {
      number: "02",
      title:
        `${city} 점포철거업체`,
      description: pick(
        serviceDescriptions.store,
        copy.seed,
        32
      ),
    },

    {
      number: "03",
      title:
        `${city} 매장철거업체`,
      description: pick(
        serviceDescriptions.shop,
        copy.seed,
        33
      ),
    },

    {
      number: "04",
      title:
        `${city} 상가철거업체`,
      description: pick(
        serviceDescriptions.commercial,
        copy.seed,
        34
      ),
    },

    {
      number: "05",
      title:
        `${city} 폐업철거업체`,
      description: pick(
        serviceDescriptions.closing,
        copy.seed,
        35
      ),
    },

    {
      number: "06",
      title:
        `${city} 원상복구업체`,
      description: pick(
        serviceDescriptions.restore,
        copy.seed,
        36
      ),
    },
  ];

  const process = [
    [
      "01",
      "상담 접수",
      copy.processConsult,
    ],

    [
      "02",
      "현장 확인",
      copy.processVisit,
    ],

    [
      "03",
      "견적 안내",
      copy.processEstimate,
    ],

    [
      "04",
      "철거 진행",
      copy.processWork,
    ],
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
                {copy.heroSubTitle}
              </span>

            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">
              {copy.heroDescription}
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
            {copy.serviceIntro}
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

      {/* ===================================================
          무료 방문 견적
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
            {copy.regionDescription}
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

                      {region.name}
                      {" "}
                      철거업체

                    </strong>

                    <span className="text-2xl font-black text-[#ffd600] transition group-hover:text-black">
                      →
                    </span>

                  </div>

                  <p className="mt-5 text-base font-medium leading-7 text-neutral-300 transition group-hover:text-black/75">

                    {region.name}
                    {" "}
                    점포철거 · 매장철거

                    <br />

                    상가철거 · 폐업철거 · 원상복구

                  </p>

                  {region.children &&
                    region.children.length > 0 && (

                      <p className="mt-5 text-sm font-bold text-[#ffd600] transition group-hover:text-black">

                        하위 지역{" "}
                        {region.children.length}
                        개 →

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
              {copy.seo1}
            </p>

            <p>
              {copy.seo2}
            </p>

            <p>
              {copy.seo3}
            </p>

            <p>
              {copy.seo4}
            </p>

            <p>
              {copy.seo5}
            </p>

            <p>
              {copy.seo6}
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

            {city} 철거 진행 절차

          </h2>

          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">

            {process.map(
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

              {city}
              {" "}
              철거 견적이

              <br className="sm:hidden" />

              {" "}
              필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              {city} 지역의 업종과
              공간 면적, 필요한 철거 내용을
              알려주시면 상담을 진행할 수 있습니다.

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