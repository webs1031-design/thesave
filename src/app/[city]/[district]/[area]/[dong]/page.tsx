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
  dong: string
) {
  const key =
    `${city}-${district}-${area}-${dong}`;

  const seed = stableHash(key);

  const heroDescriptions = [
    `${city} ${district} ${area} ${dong}에서 철거를 준비하고 있다면 공간의 면적뿐 아니라 내부 구조와 철거 대상, 폐기물 반출 여건을 함께 확인하는 것이 중요합니다. 점포와 매장, 상가의 현재 상태를 기준으로 필요한 철거 범위를 살펴보세요.`,

    `${dong} 철거는 같은 규모의 공간이라도 기존 인테리어와 시설물의 상태에 따라 필요한 공정이 달라질 수 있습니다. 전체철거인지 부분철거인지, 원상복구까지 필요한지 먼저 확인하는 것이 좋습니다.`,

    `${dong}에서 매장이나 점포를 정리하는 경우 천장과 바닥, 벽체, 집기, 설비 가운데 어떤 부분을 철거해야 하는지 구분하는 과정이 필요합니다. 현장 조건을 확인한 뒤 작업 범위를 정하는 것이 중요합니다.`,

    `${dong} 상가철거나 폐업철거를 계획하고 있다면 철거 대상 시설물뿐 아니라 건물 출입 조건과 폐기물 이동 동선까지 함께 살펴봐야 합니다. 임대 공간이라면 원상복구 조건도 확인하는 것이 좋습니다.`,

    `${area} ${dong} 지역의 철거 현장은 업종과 기존 마감 상태, 시설물 구성에 따라 작업 방식이 달라질 수 있습니다. 현장에 맞는 철거 범위와 필요한 후속 작업을 먼저 확인하세요.`,
  ] as const;

  const heroSubTitles = [
    "철거부터 원상복구까지",
    "점포·매장·상가철거",
    "폐업철거와 원상복구",
    "현장에 맞는 철거 상담",
    "상가부터 사무실까지",
  ] as const;

  const infoRange = [
    `천장, 벽체, 바닥, 가벽, 집기와 각종 시설물 가운데 제거해야 할 부분과 유지해야 할 부분을 먼저 구분하는 것이 좋습니다.`,

    `현재 인테리어 상태를 확인하고 전체철거인지 부분철거인지 구분한 뒤 실제 필요한 작업 범위를 결정하는 것이 중요합니다.`,

    `점포와 매장마다 내부 구조가 다르기 때문에 철거 대상 시설물을 현장에서 확인하고 필요한 공정을 정하는 과정이 필요합니다.`,

    `철거를 시작하기 전에 제거할 시설물과 남겨둘 시설물을 명확하게 구분하면 작업 범위를 보다 구체적으로 정할 수 있습니다.`,

    `바닥과 천장, 벽체, 가벽, 주방시설, 집기 등 공간에 설치된 시설물을 확인하여 실제 철거가 필요한 항목을 정해야 합니다.`,
  ] as const;

  const infoCondition = [
    `엘리베이터 사용 가능 여부와 주차 공간, 차량 접근성, 폐기물 반출 동선 등에 따라 현장의 작업 방법이 달라질 수 있습니다.`,

    `건물의 층수와 출입구 위치, 장비 진입 가능 여부, 폐기물을 이동할 수 있는 경로를 작업 전에 확인하는 것이 좋습니다.`,

    `상가나 복합건물은 관리 규정과 작업 가능 시간이 정해져 있을 수 있어 철거 일정과 반출 조건을 함께 살펴봐야 합니다.`,

    `폐기물 적재 위치와 차량이 접근할 수 있는 공간, 계단이나 엘리베이터 사용 조건 등은 실제 작업 방식에 영향을 줄 수 있습니다.`,

    `철거 현장의 접근성과 작업 공간, 건물 내부 이동 동선을 확인하면 필요한 인력과 작업 방법을 계획하는 데 도움이 됩니다.`,
  ] as const;

  const infoRestore = [
    `임대차 종료를 위한 철거라면 계약서와 임대인 요청사항을 확인하여 철거 후 필요한 원상복구 범위를 결정해야 합니다.`,

    `폐업 후 공간을 반환하는 경우 철거 작업과 별도로 바닥, 벽면, 천장 등 복구가 필요한 항목을 확인하는 것이 좋습니다.`,

    `철거 이후 어떤 상태로 공간을 인도해야 하는지에 따라 원상복구 범위가 달라질 수 있으므로 계약 조건을 먼저 살펴봐야 합니다.`,

    `임대 공간은 최초 계약 당시의 상태와 반환 조건을 확인하여 철거와 원상복구가 각각 어느 범위까지 필요한지 정하는 것이 중요합니다.`,

    `원상복구는 단순 철거와 별개의 작업이 포함될 수 있어 임대인의 요청 내용과 건물 관리 기준을 함께 확인하는 것이 좋습니다.`,
  ] as const;

  const serviceIntros = [
    `${dong} 지역의 공간 구조와 업종, 기존 시설물의 상태에 따라 필요한 철거 범위와 작업 방법은 달라질 수 있습니다.`,

    `점포와 매장, 상가, 사무실 등 공간의 용도와 현재 인테리어 상태를 확인하여 실제 필요한 철거 범위를 살펴보는 것이 중요합니다.`,

    `철거는 단순히 면적만으로 작업 내용을 정하기 어렵습니다. 현장의 구조와 시설물, 폐기물의 종류까지 함께 확인해야 합니다.`,

    `${dong} 철거를 준비한다면 전체철거와 부분철거, 폐업철거, 원상복구 가운데 어떤 작업이 필요한지 먼저 구분하는 것이 좋습니다.`,

    `업종과 공간의 구조가 다르면 철거 대상도 달라집니다. 현장 상태를 기준으로 필요한 공정을 확인하고 작업 범위를 정해야 합니다.`,
  ] as const;

  const seo1 = [
    `${dong} 철거업체를 알아볼 때에는 공간의 크기만 확인하기보다 내부 구조와 시설물의 종류, 철거 대상의 범위를 함께 살펴보는 것이 중요합니다. 같은 평수라도 천장과 바닥, 가벽, 집기, 설비의 구성에 따라 필요한 작업은 달라질 수 있습니다.`,

    `${dong}에서 철거를 준비하고 있다면 우선 현재 공간의 상태를 확인하는 것이 좋습니다. 기존 인테리어가 어떻게 구성되어 있는지와 제거해야 할 시설물이 무엇인지에 따라 철거 공정과 폐기물 발생량이 달라질 수 있기 때문입니다.`,

    `${area} ${dong} 지역에서 철거업체를 찾는 경우에는 전체철거인지 부분철거인지 먼저 구분하는 것이 좋습니다. 천장, 벽체, 바닥, 집기 등 실제 철거 대상에 따라 작업 범위와 준비 과정이 달라집니다.`,

    `${dong} 철거는 단순히 면적만으로 판단하기 어렵습니다. 공간 내부의 마감재와 설비, 집기 상태를 확인하고 현장 접근 조건까지 함께 살펴봐야 실제 필요한 공정을 정할 수 있습니다.`,

    `${city} ${district} ${area} ${dong}에서 철거를 계획한다면 작업 전에 철거 대상과 존치 대상을 명확히 구분하는 것이 중요합니다. 이를 통해 불필요한 작업을 줄이고 현장에 필요한 범위를 보다 정확하게 확인할 수 있습니다.`,
  ] as const;

  const seo2 = [
    `${dong} 점포철거업체를 알아보는 경우 점포 내부의 가벽, 바닥, 천장, 집기, 간판과 기존 설비 가운데 어느 부분까지 제거해야 하는지 확인해야 합니다. 점포 이전이나 폐업 목적에 따라 필요한 철거 범위도 달라질 수 있습니다.`,

    `${dong} 매장철거업체를 찾는다면 진열시설과 카운터, 벽면 마감, 바닥재, 천장 구조 등 매장 내부의 기존 시설물을 먼저 확인하는 것이 좋습니다. 리뉴얼을 위한 철거라면 남겨야 할 시설도 함께 구분해야 합니다.`,

    `${dong} 점포철거나 매장철거를 진행할 때에는 모든 시설물을 일괄적으로 제거하기보다 실제 필요한 범위를 정하는 것이 중요합니다. 폐업인지 이전인지, 새로운 인테리어를 위한 철거인지에 따라 작업 내용도 달라질 수 있습니다.`,

    `매장과 점포에는 업종에 따라 주방설비, 진열대, 카운터, 간판 등 다양한 시설물이 설치되어 있을 수 있습니다. ${dong} 현장의 현재 상태를 확인하여 필요한 철거 범위를 정하는 것이 좋습니다.`,

    `${dong} 지역에서 점포나 매장의 철거를 준비한다면 내부 시설물뿐 아니라 출입구와 폐기물 반출 동선도 확인해야 합니다. 철거 대상과 현장 조건을 함께 살펴보면 작업 방향을 보다 구체적으로 정할 수 있습니다.`,
  ] as const;

  const seo3 = [
    `${dong} 상가철거는 상가 내부 구조와 시설물 상태뿐 아니라 건물의 작업 가능 시간, 공용부 이용 규정, 폐기물 반출 조건 등을 함께 확인하는 것이 중요합니다.`,

    `${dong} 상가철거를 계획한다면 기존 마감재와 시설물의 종류를 살펴보고 철거 장비와 폐기물 이동이 가능한 환경인지 확인하는 것이 좋습니다.`,

    `상가 내부 철거는 업종과 기존 인테리어에 따라 작업 내용이 달라질 수 있습니다. ${dong} 현장의 벽체, 바닥, 천장과 각종 설비 가운데 필요한 부분을 기준으로 범위를 정해야 합니다.`,

    `${dong} 상가철거업체를 알아볼 때에는 건물 구조와 작업 환경도 함께 확인하는 것이 좋습니다. 엘리베이터와 주차 공간, 장비 진입 가능 여부 등에 따라 작업 방식이 달라질 수 있습니다.`,

    `상가철거의 경우 폐기물을 외부로 이동하는 과정도 중요합니다. ${dong} 현장의 건물 출입 조건과 적재 공간, 차량 접근 가능 여부를 사전에 확인하는 것이 좋습니다.`,
  ] as const;

  const seo4 = [
    `${dong} 폐업철거를 준비하고 있다면 임대차 계약의 원상복구 조건을 함께 확인해야 합니다. 내부 시설물을 철거하는 것과 별도로 바닥이나 벽면, 천장 등을 복구해야 하는 경우가 있을 수 있습니다.`,

    `폐업 후 임대 공간을 반환해야 한다면 철거 범위와 원상복구 범위를 구분하는 것이 중요합니다. ${dong} 현장의 계약 조건과 임대인 요청사항을 미리 확인하면 작업 내용을 정하는 데 도움이 됩니다.`,

    `${dong} 폐업철거에서는 영업 종료 일정과 건물 인도 일정을 함께 고려하는 것이 좋습니다. 철거가 끝난 뒤 필요한 원상복구 작업까지 확인하면 전체 일정을 계획하기 수월합니다.`,

    `폐업철거는 단순히 기존 시설물을 제거하는 것만으로 끝나지 않을 수 있습니다. ${dong}의 임대 공간이라면 계약서상의 반환 조건을 확인하여 필요한 원상복구 항목을 살펴보는 것이 좋습니다.`,

    `${dong}에서 폐업을 준비하는 점포나 매장은 집기와 내부 시설물 철거뿐 아니라 간판 제거와 마감 복구 등이 필요한지 함께 확인하는 것이 중요합니다.`,
  ] as const;

  const seo5 = [
    `${dong} 철거비용과 철거견적은 면적뿐 아니라 폐기물의 종류와 양, 작업 난이도, 건물 층수, 엘리베이터 사용 여부와 장비 진입 조건 등에 따라 달라질 수 있습니다.`,

    `철거견적을 알아볼 때에는 단순한 평당 가격만 비교하기보다 실제 어떤 작업이 포함되는지 확인하는 것이 중요합니다. ${dong} 현장의 철거 대상과 폐기물 처리, 원상복구 여부를 함께 살펴보는 것이 좋습니다.`,

    `같은 면적이라도 내부 시설물이 많거나 폐기물 반출이 어려운 현장은 작업 방법이 달라질 수 있습니다. 따라서 ${dong} 철거비용은 실제 현장 조건을 기준으로 확인하는 것이 좋습니다.`,

    `${dong} 철거견적은 천장과 바닥, 벽체, 집기 등 철거 대상의 양과 작업 환경에 따라 달라질 수 있습니다. 현장 사진이나 방문 확인을 통해 필요한 범위를 구체적으로 파악하는 것이 좋습니다.`,

    `철거비용을 확인할 때에는 철거 공정뿐 아니라 폐기물 처리와 필요한 후속 작업까지 함께 살펴봐야 합니다. ${dong} 현장의 조건에 따라 작업 방식과 필요한 인력이 달라질 수 있습니다.`,
  ] as const;

  const seo6 = [
    `더세이브는 ${city} ${district} ${area} ${dong} 지역에서 점포철거, 매장철거, 상가철거, 사무실철거, 폐업철거와 원상복구를 알아보는 경우 현장 조건과 필요한 작업 범위를 확인하여 상담을 진행합니다.`,

    `${dong}에서 철거를 준비하고 있다면 더세이브를 통해 공간의 업종과 면적, 철거 대상과 원상복구 여부를 상담할 수 있습니다. 현장에 필요한 작업 내용을 확인하여 진행 방향을 안내합니다.`,

    `더세이브는 ${area} ${dong} 지역의 점포와 매장, 상가, 사무실 등 다양한 공간에서 필요한 철거 범위를 확인합니다. 부분철거부터 폐업 후 원상복구까지 현장 조건을 바탕으로 상담합니다.`,

    `${city} ${district} ${area} ${dong}에서 상가나 매장 철거를 계획하고 있다면 현재 공간의 상태와 필요한 철거 내용을 알려주세요. 더세이브는 현장 조건을 확인하여 작업 범위와 진행 방향을 안내합니다.`,

    `${dong} 점포철거와 매장철거, 폐업철거 또는 원상복구가 필요한 경우 현장 사진과 업종, 면적 등을 바탕으로 상담할 수 있습니다. 더세이브는 필요한 철거 범위를 확인하여 안내합니다.`,
  ] as const;

  const processConsult = [
    "지역과 업종, 면적 및 필요한 철거 내용을 확인하여 기본 상담을 진행합니다.",
    "철거가 필요한 공간의 위치와 업종, 규모, 예상 작업 범위를 먼저 확인합니다.",
    "현장 주소와 공간 용도, 철거 목적과 희망 일정을 확인하여 상담을 시작합니다.",
    "점포나 매장의 현재 상태와 필요한 철거 항목, 작업 일정을 확인합니다.",
    "철거를 원하는 공간의 기본 정보와 작업 범위를 확인하여 상담 내용을 정리합니다.",
  ] as const;

  const processVisit = [
    "현장의 내부 구조와 시설물, 폐기물 반출 동선 및 작업 조건을 확인합니다.",
    "철거 대상과 유지해야 할 시설, 장비 진입 가능 여부 등을 현장에서 살펴봅니다.",
    "천장과 바닥, 벽체, 집기 등 실제 철거 대상과 현장 환경을 확인합니다.",
    "출입 조건과 작업 공간, 폐기물 이동 경로 등을 확인하여 필요한 공정을 살펴봅니다.",
    "현장을 확인하며 철거 범위와 작업 난이도, 원상복구 필요 여부를 함께 살펴봅니다.",
  ] as const;

  const processEstimate = [
    "확인한 철거 범위와 현장 조건을 기준으로 필요한 견적 내용을 안내합니다.",
    "현장에서 확인한 작업 항목과 폐기물 처리 범위를 기준으로 견적을 안내합니다.",
    "철거 대상과 작업 방식, 원상복구 여부 등을 기준으로 견적 내용을 정리합니다.",
    "필요한 철거 공정과 현장 환경을 반영하여 작업 범위와 견적을 안내합니다.",
    "현장 확인 내용을 바탕으로 필요한 작업 항목과 예상 견적 범위를 안내합니다.",
  ] as const;

  const processWork = [
    "협의된 작업 범위와 일정에 맞춰 철거 및 필요한 후속 작업을 진행합니다.",
    "확정된 일정과 철거 대상에 따라 현장 작업을 순서대로 진행합니다.",
    "사전에 확인한 공정과 작업 범위를 기준으로 현장 철거를 진행합니다.",
    "협의된 철거 내용과 원상복구 범위에 맞춰 필요한 작업을 진행합니다.",
    "현장 상황과 협의된 일정에 따라 철거 공정을 진행하고 작업 내용을 확인합니다.",
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

    infoRange: pick(
      infoRange,
      seed,
      3
    ),

    infoCondition: pick(
      infoCondition,
      seed,
      4
    ),

    infoRestore: pick(
      infoRestore,
      seed,
      5
    ),

    serviceIntro: pick(
      serviceIntros,
      seed,
      6
    ),

    seo1: pick(
      seo1,
      seed,
      7
    ),

    seo2: pick(
      seo2,
      seed,
      8
    ),

    seo3: pick(
      seo3,
      seed,
      9
    ),

    seo4: pick(
      seo4,
      seed,
      10
    ),

    seo5: pick(
      seo5,
      seed,
      11
    ),

    seo6: pick(
      seo6,
      seed,
      12
    ),

    processConsult: pick(
      processConsult,
      seed,
      13
    ),

    processVisit: pick(
      processVisit,
      seed,
      14
    ),

    processEstimate: pick(
      processEstimate,
      seed,
      15
    ),

    processWork: pick(
      processWork,
      seed,
      16
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
    return {
      title:
        "지역 철거업체 | 더세이브",
    };
  }

  const copy =
    buildRegionalCopy(
      city,
      district,
      area,
      dong
    );

  const metaTitles = [
    `${dong} 철거업체 | 점포·매장·상가·폐업철거`,
    `${dong} 철거 | 상가철거·점포철거·원상복구`,
    `${dong} 철거업체 | 매장·사무실·폐업철거`,
    `${dong} 철거업체 | 상가·점포 원상복구 상담`,
    `${dong} 철거 | 점포철거·매장철거 전문 상담`,
  ] as const;

  const metaDescriptions = [
    `${city} ${district} ${area} ${dong} 철거업체를 알아보고 있다면 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거와 원상복구에 필요한 현장 조건을 확인하세요.`,

    `${dong} 상가철거와 점포철거, 매장철거, 사무실철거 및 폐업 후 원상복구 정보를 안내합니다. 현장 구조와 철거 범위를 기준으로 필요한 내용을 확인하세요.`,

    `${city} ${district} ${area} ${dong}에서 철거를 준비할 때 필요한 작업 범위와 폐기물 반출 조건, 원상복구 여부를 확인해보세요.`,

    `${dong} 점포·매장·상가 철거를 계획하고 있다면 내부 시설물과 현장 작업 조건을 먼저 살펴보는 것이 중요합니다. 폐업철거와 원상복구 정보도 확인하세요.`,

    `${dong} 철거업체를 찾고 있다면 상가, 점포, 매장, 사무실의 철거 대상과 원상복구 범위를 확인하세요. 현장 상황에 따라 필요한 작업을 안내합니다.`,
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
      title,
      description,
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

  const copy =
    buildRegionalCopy(
      city,
      district,
      area,
      dong
    );

  /* =======================================================
     SERVICES
  ======================================================= */

  const serviceDescriptions = {
    demolition: [
      "상가와 점포, 매장, 사무실 등 공간의 내부 구조를 확인하고 철거 대상과 존치 시설을 구분하여 작업 범위를 살펴봅니다.",

      "천장, 벽체, 바닥, 가벽과 기존 시설물의 상태를 확인하여 전체철거 또는 부분철거에 필요한 범위를 정합니다.",

      "업종과 내부 인테리어 구성을 확인하고 실제 제거해야 하는 시설물을 기준으로 필요한 철거 공정을 살펴봅니다.",

      "현장의 공간 구조와 시설물, 폐기물 발생 범위를 확인하여 필요한 철거 작업 방향을 검토합니다.",

      "현재 공간의 상태와 철거 목적을 확인하여 필요한 시설물 제거 범위와 작업 방법을 살펴봅니다.",
    ],

    store: [
      "점포 이전이나 폐업을 준비하는 경우 기존 인테리어와 집기, 설비 가운데 철거가 필요한 항목을 구분하여 확인합니다.",

      "점포 내부의 천장, 바닥, 가벽, 집기와 시설물을 살펴보고 영업 종료 후 필요한 철거 범위를 정합니다.",

      "점포의 업종과 현재 내부 상태를 기준으로 제거할 시설과 유지할 시설을 구분하여 철거 범위를 확인합니다.",

      "이전이나 폐업을 위한 점포철거에서는 내부 마감재와 설비, 집기 등 실제 철거 대상을 먼저 확인합니다.",

      "임대 점포를 정리하는 경우 계약 종료 조건과 현장 상태를 확인하여 필요한 철거 항목을 살펴봅니다.",
    ],

    shop: [
      "매장 내부의 진열대와 카운터, 바닥, 벽면, 천장 등 기존 시설물을 확인하여 필요한 철거 범위를 구분합니다.",

      "매장 리뉴얼이나 이전, 폐업 목적에 따라 전체철거와 부분철거 가운데 필요한 작업 범위를 확인합니다.",

      "기존 매장의 인테리어와 시설물 배치를 살펴보고 철거해야 할 부분과 남겨야 할 부분을 구분합니다.",

      "매장의 업종과 내부 마감 상태를 기준으로 필요한 철거 항목과 작업 범위를 확인합니다.",

      "매장에 설치된 집기와 설비, 마감재를 확인하여 실제 철거가 필요한 부분을 중심으로 작업을 검토합니다.",
    ],

    commercial: [
      "상가 내부 시설물과 건물 출입 조건, 폐기물 반출 동선, 장비 진입 가능 여부를 함께 확인하여 철거 범위를 살펴봅니다.",

      "상가철거는 공간 구조뿐 아니라 건물의 작업 가능 시간과 공용부 이용 조건도 함께 확인하는 것이 중요합니다.",

      "상가의 기존 마감재와 설비 상태를 살펴보고 차량 접근성과 폐기물 이동 경로 등을 함께 확인합니다.",

      "상가 내부 철거 대상과 건물의 작업 환경을 기준으로 필요한 공정과 철거 범위를 검토합니다.",

      "상가 건물의 내부 구조와 출입 환경, 폐기물 적재 조건을 확인하여 현장에 필요한 철거 방법을 살펴봅니다.",
    ],

    closing: [
      "폐업 일정과 임대차 종료 조건을 확인하여 매장 내부 철거와 필요한 원상복구 범위를 함께 살펴봅니다.",

      "영업 종료 후 공간 반환을 준비하는 경우 철거 대상 시설물과 임대인의 원상복구 요청사항을 확인합니다.",

      "폐업철거에서는 집기와 시설물 제거, 간판 철거, 내부 마감 철거와 원상복구 여부를 함께 확인하는 것이 좋습니다.",

      "폐업 이후 건물 인도 일정에 맞춰 철거가 필요한 범위와 후속 복구 항목을 확인합니다.",

      "점포 폐업을 준비할 때에는 내부 철거뿐 아니라 임대 공간 반환에 필요한 원상복구 범위를 함께 살펴봐야 합니다.",
    ],

    restore: [
      "임대차 계약과 임대인 요청사항을 확인하여 철거 이후 필요한 바닥, 벽면, 천장 등의 원상복구 범위를 살펴봅니다.",

      "공간을 반환해야 하는 상태에 따라 기존 시설물 철거와 별도로 필요한 복구 항목을 확인합니다.",

      "원상복구는 철거 범위와 임대차 계약 내용을 함께 확인하여 실제 복구가 필요한 부분을 정하는 것이 중요합니다.",

      "철거 후 공간을 어떤 상태로 인도해야 하는지 확인하고 필요한 마감 및 복구 항목을 검토합니다.",

      "계약 당시의 상태와 임대인의 요청 내용을 확인하여 철거 이후 필요한 원상복구 작업을 살펴봅니다.",
    ],
  } as const;

  const services = [
    {
      number: "01",
      title: `${dong} 철거업체`,
      description: pick(
        serviceDescriptions.demolition,
        copy.seed,
        31
      ),
    },

    {
      number: "02",
      title: `${dong} 점포철거업체`,
      description: pick(
        serviceDescriptions.store,
        copy.seed,
        32
      ),
    },

    {
      number: "03",
      title: `${dong} 매장철거업체`,
      description: pick(
        serviceDescriptions.shop,
        copy.seed,
        33
      ),
    },

    {
      number: "04",
      title: `${dong} 상가철거업체`,
      description: pick(
        serviceDescriptions.commercial,
        copy.seed,
        34
      ),
    },

    {
      number: "05",
      title: `${dong} 폐업철거업체`,
      description: pick(
        serviceDescriptions.closing,
        copy.seed,
        35
      ),
    },

    {
      number: "06",
      title: `${dong} 원상복구`,
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
                href="#information"
                className="border border-white/30 bg-white/5 px-8 py-5 text-center text-base font-bold text-white transition hover:border-[#ffd600] hover:text-[#ffd600] sm:text-lg"
              >
                철거 정보 확인
              </a>

            </div>

          </div>

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

                현장 조건부터 확인합니다.

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
            {dong} 철거 진행 절차
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

              {dong}
              {" "}
              철거 견적이

              <br className="sm:hidden" />

              {" "}
              필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              {area} {dong} 현장의
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