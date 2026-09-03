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
    (seed + offset * 7919) % items.length
  ];
}

function buildRegionalCopy(
  city: string,
  district: string,
  area: string,
  hasSubRegions: boolean
) {
  const key = `${city}-${district}-${area}`;
  const seed = stableHash(key);

  const heroDescriptions = [
    `${area}에서 철거를 준비하고 있다면 공간의 크기만 보는 것보다 내부 구조와 철거 대상, 폐기물 반출 조건까지 함께 확인해야 합니다. 상가철거부터 폐업 후 원상복구까지 현장에 필요한 범위를 먼저 살펴보세요.`,

    `${city} ${district} ${area} 지역의 철거는 업종과 내부 마감 상태에 따라 작업 범위가 달라질 수 있습니다. 점포와 매장, 사무실 등 현장의 구조를 확인한 뒤 철거와 원상복구 범위를 정하는 것이 중요합니다.`,

    `${area} 철거를 계획할 때에는 천장과 바닥, 가벽, 집기처럼 철거할 부분을 먼저 구분해야 합니다. 현장 접근 조건과 폐기물 반출 동선까지 확인하면 보다 구체적인 작업 방향을 정할 수 있습니다.`,

    `${area}에서 매장이나 점포를 정리하는 경우 철거 대상과 남겨야 할 시설물을 명확하게 구분하는 과정이 필요합니다. 폐업철거와 원상복구를 함께 준비한다면 임대차 조건도 미리 확인하는 것이 좋습니다.`,

    `${area} 철거 현장은 같은 평수라도 내부 시설과 작업 환경에 따라 필요한 공정이 달라집니다. 상가, 매장, 음식점, 사무실 등 공간별 조건을 확인하여 필요한 철거 범위를 결정하는 것이 중요합니다.`,
  ] as const;

  const infoRange = [
    `철거를 시작하기 전에는 천장, 벽체, 바닥, 가벽, 집기와 설비 가운데 제거할 항목과 유지할 항목을 구분하는 것이 좋습니다.`,

    `현장 내부의 마감재와 시설물 상태를 확인하고 전체철거인지 부분철거인지 먼저 구분하면 이후 작업 범위를 정하기 수월합니다.`,

    `점포와 매장마다 기존 인테리어 구성이 다르기 때문에 철거 대상 시설물을 현장에서 확인한 뒤 공사 범위를 결정하는 것이 중요합니다.`,

    `철거 범위가 명확하지 않은 상태에서 작업을 시작하기보다 제거 대상과 존치 대상을 먼저 구분하면 불필요한 작업을 줄이는 데 도움이 됩니다.`,
  ] as const;

  const infoCondition = [
    `엘리베이터 사용 가능 여부, 계단 구조, 차량 접근성, 주차 공간과 폐기물 반출 위치에 따라 현장의 작업 방법이 달라질 수 있습니다.`,

    `장비가 들어갈 수 있는 위치와 폐기물을 이동할 동선을 사전에 확인해야 실제 현장에 적합한 철거 방법을 검토할 수 있습니다.`,

    `건물의 층수와 출입구 폭, 주차 및 적재 공간 등 현장 여건은 철거 진행 방식에 영향을 줄 수 있어 미리 확인하는 것이 좋습니다.`,

    `상가 건물이나 복합시설은 작업 가능 시간과 공용부 사용 조건이 다를 수 있으므로 현장 조건을 함께 살펴봐야 합니다.`,
  ] as const;

  const infoRestore = [
    `임대차 종료를 위한 철거라면 계약 당시의 원상복구 조건과 임대인의 요청사항을 확인하여 복구 범위를 정하는 것이 중요합니다.`,

    `폐업과 함께 철거를 진행하는 경우 임대차 계약서에 기재된 반환 조건을 확인하고 필요한 원상복구 항목을 정하는 것이 좋습니다.`,

    `철거 후 공간을 어떤 상태로 인도해야 하는지에 따라 원상복구 범위가 달라질 수 있으므로 임대인과의 협의 내용을 먼저 확인해야 합니다.`,

    `바닥, 벽면, 천장, 전기설비 등 철거 이후 남겨야 하는 상태가 있는지 확인한 뒤 원상복구 범위를 함께 계획하는 것이 좋습니다.`,
  ] as const;

  const serviceIntro = [
    `업종과 공간 구조, 기존 인테리어 상태에 따라 필요한 철거 공정은 달라집니다. 현장별 조건을 확인하여 작업 범위를 구체적으로 정하는 과정이 필요합니다.`,

    `${area}의 점포와 매장마다 내부 구조와 시설물이 다르기 때문에 동일한 방식으로 철거가 진행되는 것은 아닙니다. 현장을 기준으로 필요한 공정을 확인합니다.`,

    `철거는 면적만으로 작업 내용을 판단하기 어렵습니다. 천장과 바닥, 벽체, 집기, 설비 등 철거 대상과 현장 여건을 함께 살펴보는 것이 중요합니다.`,

    `전체철거인지 부분철거인지, 폐업 후 원상복구까지 필요한지에 따라 작업 내용이 달라질 수 있습니다. 필요한 범위를 먼저 확인하는 것이 좋습니다.`,
  ] as const;

  const seoParagraph1 = [
    `${area} 철거업체를 알아보고 있다면 단순히 공간의 면적만 확인하기보다 내부에 설치된 시설물과 철거 대상의 종류를 함께 살펴보는 것이 중요합니다. 같은 규모의 공간이라도 천장과 바닥 마감, 가벽, 집기, 설비의 상태에 따라 실제 필요한 작업은 달라질 수 있습니다.`,

    `${area}에서 철거를 준비할 때 가장 먼저 살펴볼 부분은 현장의 현재 상태입니다. 점포나 매장의 크기가 비슷하더라도 기존 인테리어와 시설물 구성이 다르면 철거 공정과 폐기물의 종류 역시 달라질 수 있기 때문입니다.`,

    `${area} 철거는 현장마다 조건이 다르기 때문에 평수만으로 필요한 작업을 정하기 어렵습니다. 내부 벽체와 바닥, 천장, 집기류, 전기 및 기타 시설물 가운데 어떤 부분을 철거할지 구분한 뒤 작업 범위를 계획하는 것이 좋습니다.`,

    `${city} ${district} ${area}에서 철거업체를 찾는 경우에는 철거 대상과 현장 접근 조건을 함께 확인하는 것이 좋습니다. 전체철거와 부분철거 가운데 어떤 작업이 필요한지에 따라 준비 과정도 달라질 수 있습니다.`,
  ] as const;

  const seoParagraph2 = [
    `${area} 점포철거업체를 알아보는 경우에는 영업에 사용했던 집기와 가벽, 바닥재, 천장 마감재 등 가운데 철거 대상이 무엇인지 확인해야 합니다. 특히 임대 공간이라면 계약 종료 시 필요한 반환 상태까지 함께 확인하는 것이 좋습니다.`,

    `${area} 매장철거업체를 찾는다면 기존 인테리어 가운데 제거해야 할 부분과 유지해야 할 부분을 명확히 구분해야 합니다. 매장 형태에 따라 간판, 진열시설, 카운터, 주방시설 등 추가적인 철거 대상이 있을 수 있습니다.`,

    `${area} 점포철거 또는 매장철거를 진행할 때에는 내부 시설물을 일괄적으로 제거하는 것보다 실제 필요한 범위를 먼저 정하는 것이 중요합니다. 이전이나 리뉴얼을 위한 부분철거라면 남겨야 할 시설물도 함께 확인해야 합니다.`,

    `매장이나 점포를 정리하는 과정에서는 천장, 바닥, 벽체뿐 아니라 간판과 집기, 설비 등의 처리 여부도 확인해야 합니다. ${area} 현장의 현재 상태를 기준으로 필요한 철거 범위를 살펴보는 것이 좋습니다.`,
  ] as const;

  const seoParagraph3 = [
    `${area} 상가철거 또는 폐업철거를 준비한다면 철거 작업과 별도로 원상복구 조건을 확인할 필요가 있습니다. 임대차 계약 내용이나 임대인의 요청에 따라 바닥, 벽면, 천장 및 설비의 복구 범위가 달라질 수 있습니다.`,

    `${area} 폐업철거에서는 영업 종료 일정과 건물 인도 일정을 함께 고려하는 것이 좋습니다. 임대 공간이라면 철거가 끝난 뒤 어느 수준까지 원상복구가 필요한지 미리 확인하면 이후 일정을 정하는 데 도움이 됩니다.`,

    `${area} 상가철거의 경우 건물 관리 규정과 작업 가능 시간도 확인할 필요가 있습니다. 폐기물 이동과 장비 사용에 제한이 있는 현장이라면 이러한 조건을 작업 전에 확인하는 것이 중요합니다.`,

    `폐업 후 공간을 반환하는 철거라면 단순히 내부 시설물을 제거하는 것만으로 끝나지 않을 수 있습니다. ${area} 현장의 임대차 조건을 확인하여 철거 이후 필요한 원상복구 항목까지 함께 살펴보는 것이 좋습니다.`,
  ] as const;

  const seoParagraph4 = [
    `철거비용과 견적은 면적뿐 아니라 폐기물의 양과 종류, 현장의 층수, 장비 진입 가능 여부, 엘리베이터 사용 조건, 작업 난이도 등에 따라 달라질 수 있습니다. 따라서 실제 현장 조건을 기준으로 필요한 공정을 확인하는 것이 중요합니다.`,

    `철거견적을 확인할 때에는 단순한 평당 비용만 비교하기보다 어떤 작업이 견적 범위에 포함되어 있는지를 살펴보는 것이 좋습니다. 폐기물 처리와 시설물 철거, 원상복구 등 필요한 항목을 구분하여 확인해야 합니다.`,

    `현장마다 폐기물 반출 방식과 작업 조건이 다르기 때문에 동일한 면적이라도 철거비용에는 차이가 생길 수 있습니다. 정확한 범위를 확인하려면 공간의 구조와 철거 대상을 함께 살펴봐야 합니다.`,

    `철거 작업의 범위가 넓거나 시설물이 많은 현장이라면 공정과 폐기물 처리량도 달라집니다. 견적을 알아볼 때에는 현장 사진이나 방문 확인을 통해 필요한 작업 내용을 구체화하는 것이 좋습니다.`,
  ] as const;

  const seoParagraph5 = [
    `더세이브는 ${city} ${district} ${area} 지역에서 상가철거, 점포철거, 매장철거, 사무실철거, 폐업철거와 원상복구를 알아보는 경우 현장 상황과 필요한 작업 범위를 확인하여 상담을 진행합니다.`,

    `${city} ${district} ${area}에서 점포나 매장 철거를 준비하고 있다면 더세이브를 통해 철거 대상과 현장 조건을 상담할 수 있습니다. 부분철거부터 폐업 후 원상복구까지 필요한 범위를 기준으로 진행 방향을 확인합니다.`,

    `더세이브는 ${area} 지역의 상가와 매장, 점포, 사무실 등 다양한 공간에서 필요한 철거 범위를 확인하고 있습니다. 철거와 폐기물 처리, 원상복구가 필요한 경우 현장 조건을 바탕으로 상담을 진행합니다.`,

    `${area}에서 철거를 계획하고 있다면 현재 공간의 사진이나 업종, 면적, 필요한 철거 내용을 바탕으로 상담할 수 있습니다. 더세이브는 현장을 확인하여 필요한 철거 범위와 진행 방향을 안내합니다.`,
  ] as const;

  const processConsult = [
    "지역과 업종, 면적 및 필요한 철거 내용을 확인하여 기본적인 상담을 진행합니다.",
    "철거가 필요한 공간의 위치와 업종, 규모, 희망 작업 내용을 먼저 확인합니다.",
    "현장 주소와 공간 용도, 예상 철거 범위 등을 확인하여 상담을 시작합니다.",
    "점포와 매장의 상태, 필요한 철거 항목 및 일정에 대한 내용을 확인합니다.",
  ] as const;

  const processVisit = [
    "공간의 내부 구조와 시설물, 폐기물 반출 동선 등 실제 작업 조건을 확인합니다.",
    "현장을 살펴보며 철거 대상과 존치 시설, 장비 사용 가능 여부 등을 확인합니다.",
    "천장과 바닥, 벽체, 집기 등 철거 대상과 현장의 작업 환경을 살펴봅니다.",
    "출입 조건과 작업 동선, 철거 대상 시설물을 확인하여 필요한 공정을 정리합니다.",
  ] as const;

  const processEstimate = [
    "확인된 철거 범위와 작업 조건을 기준으로 필요한 견적 내용을 안내합니다.",
    "현장에서 확인한 공정과 철거 대상을 바탕으로 작업 범위와 견적을 안내합니다.",
    "철거 대상과 폐기물 처리, 원상복구 여부 등을 기준으로 견적 내용을 정리합니다.",
    "필요한 철거 공정과 현장 조건을 반영하여 상담한 견적 내용을 안내합니다.",
  ] as const;

  const processWork = [
    "협의된 작업 범위와 일정에 맞춰 철거 및 필요한 후속 작업을 진행합니다.",
    "확정된 일정과 작업 내용을 기준으로 현장 철거를 순서대로 진행합니다.",
    "사전에 협의한 철거 대상과 작업 계획에 따라 현장 공정을 진행합니다.",
    "확인된 철거 범위를 기준으로 현장 상황에 맞게 작업을 진행합니다.",
  ] as const;

  return {
    seed,

    heroDescription: pick(
      heroDescriptions,
      seed,
      1
    ),

    infoRange: pick(
      infoRange,
      seed,
      2
    ),

    infoCondition: pick(
      infoCondition,
      seed,
      3
    ),

    infoRestore: pick(
      infoRestore,
      seed,
      4
    ),

    serviceIntro: pick(
      serviceIntro,
      seed,
      5
    ),

    seo1: pick(
      seoParagraph1,
      seed,
      6
    ),

    seo2: pick(
      seoParagraph2,
      seed,
      7
    ),

    seo3: pick(
      seoParagraph3,
      seed,
      8
    ),

    seo4: pick(
      seoParagraph4,
      seed,
      9
    ),

    seo5: pick(
      seoParagraph5,
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

    heroSubTitle: hasSubRegions
      ? pick(
          [
            "점포·매장·상가철거",
            "지역별 철거 안내",
            "상가철거부터 원상복구",
          ] as const,
          seed,
          15
        )
      : pick(
          [
            "철거부터 원상복구까지",
            "현장에 맞는 철거 상담",
            "점포·매장·폐업철거",
            "상가철거와 원상복구",
          ] as const,
          seed,
          15
        ),
  };
}

/* =========================================================
   META
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
    return {
      title:
        "지역 철거업체 | 더세이브",
    };
  }

  const children =
    getChildren(path);

  const hasSubRegions =
    children.length > 0;

  const copy =
    buildRegionalCopy(
      city,
      district,
      area,
      hasSubRegions
    );

  const metaTitles = [
    `${area} 철거업체 | 점포·매장·상가·폐업철거`,
    `${area} 철거업체 | 상가철거·원상복구 전문 상담`,
    `${area} 철거 | 점포철거·매장철거·폐업철거 업체`,
    `${area} 철거업체 | 상가·사무실·점포 원상복구`,
  ] as const;

  const metaDescriptions = [
    `${city} ${district} ${area} 철거업체를 알아보고 있다면 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거와 원상복구에 필요한 현장 조건을 확인해보세요.`,

    `${area} 상가철거와 점포철거, 매장철거, 사무실철거 및 폐업 후 원상복구 정보를 안내합니다. ${city} ${district} 지역의 철거 범위와 현장 조건을 확인하세요.`,

    `${city} ${district} ${area}에서 철거를 준비할 때 필요한 작업 범위와 현장 조건을 확인하세요. 점포·매장·상가·폐업철거와 원상복구 상담을 안내합니다.`,

    `${area} 철거를 계획하고 있다면 내부 구조와 폐기물 반출 조건, 원상복구 범위를 먼저 확인하는 것이 중요합니다. 점포와 매장, 상가 철거 정보를 확인하세요.`,
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
      title,
      description,
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

  const subRegions =
    getChildren(path);

  const hasSubRegions =
    subRegions.length > 0;

  const copy =
    buildRegionalCopy(
      city,
      district,
      area,
      hasSubRegions
    );

  /* =======================================================
     SERVICES
  ======================================================= */

  const serviceDescriptions = {
    demolition: [
      "상가, 점포, 매장, 음식점, 카페, 사무실 등 공간의 현재 구조를 확인하고 필요한 철거 범위를 구분하여 작업 방향을 살펴봅니다.",

      "현장 내부의 천장, 벽체, 바닥, 집기와 기존 시설물을 확인하여 전체철거 또는 부분철거에 필요한 범위를 정리합니다.",

      "업종과 공간의 구조, 기존 인테리어 상태를 살펴보고 실제 제거해야 하는 시설물을 기준으로 철거 범위를 확인합니다.",

      "현장의 용도와 내부 상태를 확인하여 필요한 철거 공정과 폐기물 처리 범위를 함께 살펴봅니다.",
    ],

    store: [
      "점포 이전이나 폐업을 준비하는 경우 기존 시설물과 인테리어 가운데 제거해야 할 부분과 남겨야 할 부분을 구분합니다.",

      "영업 종료 또는 이전을 위한 점포철거에서는 천장, 바닥, 가벽, 집기와 설비 등 필요한 철거 대상을 확인합니다.",

      "점포 내부에 설치된 마감재와 시설물을 살펴보고 임대 공간 반환에 필요한 철거 범위를 확인합니다.",

      "점포의 업종과 기존 인테리어 구성에 따라 필요한 철거 항목을 구분하고 작업 범위를 살펴봅니다.",
    ],

    shop: [
      "매장 내부의 진열시설, 카운터, 바닥, 벽면과 천장 등 기존 시설물을 확인하여 필요한 철거 항목을 구분합니다.",

      "리뉴얼이나 이전, 폐업 등 철거 목적에 따라 매장 전체철거 또는 부분철거에 필요한 범위를 살펴봅니다.",

      "매장에 설치된 집기와 마감재, 설비의 상태를 확인하고 실제 철거해야 하는 범위를 기준으로 작업을 검토합니다.",

      "매장의 내부 구조와 시설물 배치를 확인하여 철거 대상과 존치 대상을 구분하는 것이 중요합니다.",
    ],

    commercial: [
      "상가 건물의 출입 조건과 내부 마감재, 장비 진입 가능 여부, 폐기물 반출 동선 등을 확인하여 철거 방법을 살펴봅니다.",

      "상가 내부 시설물뿐 아니라 건물의 작업 가능 시간과 공용부 사용 조건 등을 함께 확인하여 철거 범위를 검토합니다.",

      "상가철거는 공간 내부의 구조뿐 아니라 폐기물 이동 경로와 차량 접근성 등 현장 조건을 함께 확인해야 합니다.",

      "기존 상가 인테리어의 구조와 철거 대상을 확인하고 현장의 작업 여건에 따라 필요한 공정을 살펴봅니다.",
    ],

    closing: [
      "폐업 일정과 임대차 종료 조건을 확인하여 내부 철거와 함께 필요한 원상복구 범위를 살펴봅니다.",

      "영업 종료 후 공간 반환을 준비한다면 철거 대상 시설물과 임대인의 원상복구 요청사항을 함께 확인해야 합니다.",

      "폐업철거는 매장 내부 철거뿐 아니라 집기 처리와 시설물 제거, 원상복구 여부 등을 종합적으로 확인하는 것이 좋습니다.",

      "폐업 후 인도 일정에 맞춰 철거가 필요한 범위와 원상복구 항목을 확인하여 작업 방향을 정합니다.",
    ],

    restore: [
      "임대차 계약과 임대인 요청사항을 기준으로 철거 이후 필요한 바닥, 벽면, 천장 등의 원상복구 항목을 확인합니다.",

      "공간을 반환해야 하는 상태에 따라 철거 후 필요한 원상복구 범위를 구분하여 확인합니다.",

      "원상복구는 기존 시설물을 제거하는 범위와 임대차 계약상 복구해야 하는 항목을 함께 살펴보는 것이 중요합니다.",

      "철거 작업이 끝난 뒤 임대 공간을 어떤 상태로 인도해야 하는지 확인하여 필요한 복구 항목을 검토합니다.",
    ],
  } as const;

  const services = [
    {
      number: "01",
      title: `${area} 철거업체`,
      description: pick(
        serviceDescriptions.demolition,
        copy.seed,
        31
      ),
    },

    {
      number: "02",
      title: `${area} 점포철거업체`,
      description: pick(
        serviceDescriptions.store,
        copy.seed,
        32
      ),
    },

    {
      number: "03",
      title: `${area} 매장철거업체`,
      description: pick(
        serviceDescriptions.shop,
        copy.seed,
        33
      ),
    },

    {
      number: "04",
      title: `${area} 상가철거업체`,
      description: pick(
        serviceDescriptions.commercial,
        copy.seed,
        34
      ),
    },

    {
      number: "05",
      title: `${area} 폐업철거업체`,
      description: pick(
        serviceDescriptions.closing,
        copy.seed,
        35
      ),
    },

    {
      number: "06",
      title: `${area} 원상복구업체`,
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
                  : "현장 조건부터 확인합니다."}

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
                {copy.infoRange}
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
                {copy.infoCondition}
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
                {copy.infoRestore}
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
            {copy.serviceIntro}
          </p>

          <div className="mt-14 divide-y divide-white/15 border-y border-white/15">

            {services.map(
              (service) => (

                <div
                  key={service.number}
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
          무료방문견적 전화 배너
      =================================================== */}

      <EstimateBanner />

      {/* ===================================================
          하위 지역 목록
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

              {area}의 세부 지역별
              철거 정보를 확인할 수 있습니다.
              아래 지역을 선택하면 점포철거,
              매장철거, 상가철거, 폐업철거와
              원상복구 관련 내용을 확인할 수 있습니다.

            </p>

            <div className="mt-14 grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">

              {subRegions.map(
                (region) => (

                  <Link
                    key={region.name}
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

              {area}
              {" "}
              철거 견적이

              <br className="sm:hidden" />

              {" "}
              필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              {city} {district} {area}의
              업종과 면적, 필요한 철거 내용을
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