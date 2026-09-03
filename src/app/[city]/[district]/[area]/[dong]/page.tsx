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
   지역별 고정 콘텐츠 생성
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

function buildDongContent(
  city: string,
  district: string,
  area: string,
  dong: string
) {
  const seed = stableHash(
    `${city}-${district}-${area}-${dong}`
  );

  /* =======================================================
     HERO
  ======================================================= */

  const heroStarts = [
    `${dong}에서 철거를 준비하고 있다면`,
    `${city} ${district} ${area} ${dong}에서 철거를 알아보고 있다면`,
    `${dong} 점포나 매장의 철거를 계획하고 있다면`,
    `${dong} 상가의 내부 철거를 준비하고 있다면`,
    `${dong}에서 폐업 또는 이전으로 철거가 필요하다면`,
    `${dong} 지역에서 원상복구를 포함한 철거를 준비한다면`,
    `${dong} 철거 현장을 계획할 때에는`,
  ] as const;

  const heroMiddles = [
    `면적만 확인하기보다 현재 내부 구조와 철거할 시설물을 함께 살펴보는 것이 중요합니다.`,
    `천장과 바닥, 벽체, 가벽, 집기 가운데 실제 제거해야 하는 항목을 먼저 확인하는 것이 좋습니다.`,
    `전체철거와 부분철거 가운데 어떤 작업이 필요한지 현장 상태를 기준으로 구분해야 합니다.`,
    `기존 인테리어 상태와 폐기물의 종류, 반출 환경까지 함께 확인하는 것이 좋습니다.`,
    `건물 출입 환경과 엘리베이터, 차량 접근 조건 등 실제 작업 여건도 함께 살펴봐야 합니다.`,
    `업종과 내부 시설 구성, 임대차 계약상의 복구 조건을 함께 확인하는 과정이 필요합니다.`,
    `철거 대상뿐 아니라 유지해야 할 시설과 철거 이후 필요한 복구 항목도 확인해야 합니다.`,
  ] as const;

  const heroEnds = [
    `현장을 기준으로 필요한 철거 범위를 구체적으로 확인해보세요.`,
    `사전에 작업 범위를 정리하면 철거 방향을 보다 명확하게 계획할 수 있습니다.`,
    `공간 상태를 확인한 뒤 실제 필요한 작업 내용을 정하는 것이 좋습니다.`,
    `현장 조건에 맞는 철거 방식과 원상복구 범위를 살펴보는 것이 중요합니다.`,
    `철거 전 조건을 확인하면 불필요한 작업을 줄이는 데 도움이 될 수 있습니다.`,
    `작업 환경과 철거 목적에 맞게 필요한 공정을 구분하는 것이 좋습니다.`,
    `철거와 후속 작업을 함께 확인하면 전체 진행 방향을 정하는 데 도움이 됩니다.`,
  ] as const;

  const heroDescription =
    `${pick(heroStarts, seed, 1)} ` +
    `${pick(heroMiddles, seed, 2)} ` +
    `${pick(heroEnds, seed, 3)}`;

  const heroTitles = [
    "현장에 맞는 철거 상담",
    "철거부터 원상복구까지",
    "점포·매장·상가철거",
    "폐업철거와 원상복구",
    "상가·사무실 철거 안내",
    "철거 범위부터 확인하세요",
    "공간에 맞는 철거 진행",
  ] as const;

  /* =======================================================
     CHECK POINT
  ======================================================= */

  const rangeTexts = [
    `천장과 벽체, 바닥, 가벽, 집기 등 철거할 시설과 남겨둘 시설을 먼저 구분하여 작업 범위를 확인합니다.`,
    `전체 내부를 철거해야 하는지 일부 시설만 제거하면 되는지 현재 공간 상태를 기준으로 살펴봅니다.`,
    `기존 인테리어 가운데 철거 대상과 존치 대상을 나누어 필요한 공정을 구체적으로 확인합니다.`,
    `바닥재와 천장 마감, 내부 벽체, 설비와 집기 등 실제 철거가 필요한 항목을 정리합니다.`,
    `업종과 공간 구조에 따라 전체철거와 부분철거 중 어떤 방식이 필요한지 확인합니다.`,
    `철거 대상 시설물의 종류와 현재 상태를 살펴보고 필요한 작업 범위를 정합니다.`,
  ] as const;

  const conditionTexts = [
    `엘리베이터와 계단, 주차 공간, 폐기물 반출 동선 등 건물의 작업 조건을 함께 확인합니다.`,
    `차량 접근성과 폐기물 적재 공간, 장비 진입 가능 여부를 살펴보고 현장에 맞는 작업 방법을 검토합니다.`,
    `건물의 작업 가능 시간과 공용부 이용 규정 등 실제 철거 과정에 영향을 줄 수 있는 조건을 확인합니다.`,
    `층수와 출입구 구조, 폐기물 이동 경로 및 작업 공간을 확인하여 필요한 공정을 살펴봅니다.`,
    `현장 접근성과 엘리베이터 사용 여부, 차량 진입 환경을 미리 확인하는 것이 좋습니다.`,
    `폐기물을 외부로 이동할 수 있는 경로와 차량 적재 위치를 확인하여 작업 조건을 살펴봅니다.`,
  ] as const;

  const restoreTexts = [
    `임대차 종료를 위한 철거라면 계약 내용과 임대인 요청사항을 확인하여 필요한 원상복구 범위를 정합니다.`,
    `폐업 후 공간을 반환해야 한다면 철거 이후 바닥과 벽면, 천장 등의 복구가 필요한지 확인합니다.`,
    `철거 범위와 원상복구 범위는 다를 수 있으므로 계약 조건을 기준으로 각각 필요한 항목을 구분합니다.`,
    `공간을 어떤 상태로 인도해야 하는지 확인하여 철거 후 필요한 복구 작업을 살펴봅니다.`,
    `임대인과 협의된 반환 조건을 확인하여 유지할 부분과 복구해야 할 부분을 함께 정리합니다.`,
    `철거 후 추가 마감이나 복구가 필요한지 계약 당시 공간 상태와 비교하여 확인합니다.`,
  ] as const;

  /* =======================================================
     SERVICE INTRO
  ======================================================= */

  const serviceIntroStarts = [
    `${dong} 지역의 점포와 매장, 상가, 사무실은`,
    `${dong} 철거 현장은`,
    `${area} ${dong}에서 철거를 준비할 때에는`,
    `${dong} 상업공간의 철거는`,
    `${dong} 점포와 매장의 내부 철거는`,
    `${dong}에서 진행하는 철거 작업은`,
  ] as const;

  const serviceIntroMiddles = [
    `업종과 내부 구조에 따라 필요한 작업이 서로 달라질 수 있습니다.`,
    `기존 인테리어와 시설물 상태에 따라 철거 범위가 달라집니다.`,
    `전체철거와 부분철거 여부에 따라 필요한 공정이 달라질 수 있습니다.`,
    `공간 구조와 폐기물 발생량에 따라 작업 방식이 달라질 수 있습니다.`,
    `폐업이나 리뉴얼 등 철거 목적에 따라 필요한 범위가 달라집니다.`,
    `현재 시설물과 원상복구 조건에 따라 작업 내용이 달라질 수 있습니다.`,
  ] as const;

  const serviceIntroEnds = [
    `현장 상태를 기준으로 필요한 철거 범위를 살펴보는 것이 중요합니다.`,
    `작업 전에 실제 철거 항목을 구체적으로 확인하는 것이 좋습니다.`,
    `시설물과 작업 환경을 함께 살펴본 뒤 진행 방향을 정하는 것이 필요합니다.`,
    `현장 조건에 맞는 작업 범위를 확인하는 것이 좋습니다.`,
    `철거와 후속 복구 작업을 함께 확인하는 것이 중요합니다.`,
    `현장의 현재 상태를 기준으로 필요한 공정을 정하는 것이 좋습니다.`,
  ] as const;

  const serviceIntro =
    `${pick(serviceIntroStarts, seed, 4)} ` +
    `${pick(serviceIntroMiddles, seed, 5)} ` +
    `${pick(serviceIntroEnds, seed, 6)}`;

  /* =======================================================
     SEO 1
  ======================================================= */

  const seo1Starts = [
    `${dong} 철거업체를 알아볼 때에는`,
    `${dong}에서 철거를 준비하고 있다면`,
    `${city} ${district} ${area} ${dong} 철거를 계획할 때에는`,
    `${dong} 점포나 상가 철거를 알아보는 경우`,
    `${dong} 지역에서 철거업체를 찾고 있다면`,
    `${dong}의 매장이나 사무실 철거를 준비한다면`,
  ] as const;

  const seo1Middles = [
    `단순한 공간 면적보다 내부 구조와 철거 대상 시설물을 먼저 확인하는 것이 중요합니다.`,
    `현재 인테리어 상태와 시설물의 종류를 함께 살펴보는 것이 좋습니다.`,
    `천장과 벽체, 바닥, 가벽 등 실제 제거할 부분을 구체적으로 구분해야 합니다.`,
    `전체철거가 필요한지 일부만 철거하면 되는지 먼저 판단하는 것이 좋습니다.`,
    `업종과 내부 설비, 기존 마감 상태를 확인해야 필요한 작업 범위를 정할 수 있습니다.`,
    `철거할 부분과 유지할 시설을 먼저 구분하면 작업 방향을 보다 명확하게 정할 수 있습니다.`,
  ] as const;

  const seo1Ends = [
    `같은 평수의 공간이라도 시설물 구성과 마감 상태에 따라 철거 공정은 달라질 수 있습니다.`,
    `철거 범위를 명확하게 정하면 이후 작업 내용을 구체적으로 계획하기가 수월합니다.`,
    `철거 대상이 많을수록 발생 폐기물과 작업 과정도 달라질 수 있습니다.`,
    `공간의 현재 상태를 기준으로 필요한 공정을 살펴보는 것이 좋습니다.`,
    `현장 확인을 통해 실제 필요한 철거 범위를 보다 구체적으로 확인할 수 있습니다.`,
    `단순 면적 비교보다 실제 철거 대상과 작업 환경을 함께 확인하는 것이 중요합니다.`,
  ] as const;

  const seo1 =
    `${pick(seo1Starts, seed, 10)} ` +
    `${pick(seo1Middles, seed, 11)} ` +
    `${pick(seo1Ends, seed, 12)}`;

  /* =======================================================
     SEO 2
  ======================================================= */

  const seo2Starts = [
    `${dong} 점포철거업체를 알아본다면`,
    `${dong} 매장철거업체를 찾는 경우`,
    `${dong}에서 점포나 매장을 정리한다면`,
    `${dong} 점포철거나 매장철거를 계획할 때에는`,
    `이전이나 폐업으로 ${dong} 매장 철거가 필요하다면`,
    `${dong}의 상업공간을 철거해야 하는 경우`,
  ] as const;

  const seo2Middles = [
    `가벽과 바닥, 천장, 집기, 간판 등 기존 시설 가운데 제거해야 할 항목을 확인하는 과정이 필요합니다.`,
    `진열시설과 카운터, 마감재, 설비 가운데 철거가 필요한 부분을 먼저 살펴보는 것이 좋습니다.`,
    `전체 공간을 비워야 하는지 일부 시설만 철거하면 되는지를 먼저 확인해야 합니다.`,
    `리뉴얼 목적이라면 다시 사용할 시설과 제거할 시설을 명확하게 구분하는 것이 중요합니다.`,
    `업종에 따라 주방설비나 집기, 간판 등 추가 철거 대상이 있는지도 함께 확인해야 합니다.`,
    `현재 내부 시설을 기준으로 전체철거와 부분철거 범위를 나누어 살펴보는 것이 좋습니다.`,
  ] as const;

  const seo2Ends = [
    `폐업이나 이전 목적에 따라 필요한 철거 범위가 달라질 수 있습니다.`,
    `유지할 시설을 미리 정하면 불필요한 철거를 줄이는 데 도움이 될 수 있습니다.`,
    `현장의 현재 상태를 기준으로 필요한 작업을 정하는 것이 좋습니다.`,
    `부분철거와 전체철거 여부에 따라 실제 공정도 달라질 수 있습니다.`,
    `철거 대상 시설물을 먼저 정리하면 필요한 작업 범위를 확인하기가 수월합니다.`,
    `공간의 향후 사용 계획까지 함께 고려하여 철거 범위를 정하는 것이 좋습니다.`,
  ] as const;

  const seo2 =
    `${pick(seo2Starts, seed, 20)} ` +
    `${pick(seo2Middles, seed, 21)} ` +
    `${pick(seo2Ends, seed, 22)}`;

  /* =======================================================
     SEO 3
  ======================================================= */

  const seo3Starts = [
    `${dong} 상가철거를 준비할 때에는`,
    `${dong} 상가철거업체를 알아보고 있다면`,
    `${dong} 지역에서 상가 내부 철거가 필요하다면`,
    `${dong}에서 상가 인테리어를 철거한다면`,
    `${dong} 상가의 내부 시설물을 정리해야 한다면`,
    `${dong} 상가 또는 근린생활시설 철거를 계획한다면`,
  ] as const;

  const seo3Middles = [
    `건물 구조뿐 아니라 폐기물 반출 동선과 차량 접근 조건까지 함께 확인해야 합니다.`,
    `엘리베이터 이용 여부와 작업 가능 시간, 공용부 이용 기준 등을 살펴보는 것이 좋습니다.`,
    `내부 시설 상태와 함께 철거 장비를 사용할 수 있는 환경인지 확인해야 합니다.`,
    `건물 관리 규정과 폐기물 적재 공간 등 실제 작업 환경을 사전에 확인할 필요가 있습니다.`,
    `상가 내부 시설물뿐 아니라 작업 공간과 폐기물 이동 경로도 함께 살펴보는 것이 중요합니다.`,
    `건물 층수와 공용 공간 이용 조건, 차량 진입 가능 여부를 함께 확인하는 것이 좋습니다.`,
  ] as const;

  const seo3Ends = [
    `현장 여건에 따라 필요한 장비와 인력, 작업 방식이 달라질 수 있습니다.`,
    `사전에 작업 환경을 확인하면 철거 일정과 진행 방식을 계획하는 데 도움이 됩니다.`,
    `비슷한 규모의 상가라도 건물 구조에 따라 철거 과정은 달라질 수 있습니다.`,
    `폐기물 반출이 어려운 현장은 별도의 작업 방법을 검토해야 할 수 있습니다.`,
    `현장의 조건을 기준으로 실제 필요한 작업 방식을 확인하는 것이 중요합니다.`,
    `상가 관리 조건까지 함께 살펴본 뒤 철거 계획을 정하는 것이 좋습니다.`,
  ] as const;

  const seo3 =
    `${pick(seo3Starts, seed, 30)} ` +
    `${pick(seo3Middles, seed, 31)} ` +
    `${pick(seo3Ends, seed, 32)}`;

  /* =======================================================
     SEO 4
  ======================================================= */

  const seo4Starts = [
    `${dong} 폐업철거를 준비하고 있다면`,
    `${dong}에서 폐업 후 철거가 필요한 경우`,
    `점포 폐업으로 ${dong} 철거를 진행한다면`,
    `${dong} 폐업철거업체를 알아볼 때에는`,
    `${dong} 매장을 정리하고 공간을 반환해야 한다면`,
    `${dong}에서 임대차 종료를 위한 철거를 준비한다면`,
  ] as const;

  const seo4Middles = [
    `임대차 계약에 기재된 원상복구 조건을 함께 확인해야 합니다.`,
    `임대인이 요구하는 반환 상태를 사전에 확인하는 것이 중요합니다.`,
    `철거할 시설과 복구해야 하는 시설을 각각 구분하는 것이 좋습니다.`,
    `계약 당시 상태와 현재 공간의 차이를 확인하여 필요한 작업을 정리해야 합니다.`,
    `영업 종료 일정뿐 아니라 원상복구가 필요한 범위도 함께 살펴보는 것이 좋습니다.`,
    `기존 시설물 제거 이후 추가적인 복구 작업이 필요한지도 확인해야 합니다.`,
  ] as const;

  const seo4Ends = [
    `철거와 복구 범위를 사전에 확인하면 전체 작업 계획을 보다 구체적으로 정할 수 있습니다.`,
    `단순 철거만 필요한지 추가 원상복구까지 필요한지에 따라 진행 과정이 달라질 수 있습니다.`,
    `임대인과 협의한 내용을 기준으로 필요한 공정을 정리하는 것이 좋습니다.`,
    `폐업철거는 내부 시설물을 제거하는 작업만으로 끝나지 않을 수 있습니다.`,
    `반환 조건을 확인한 뒤 철거와 복구를 함께 계획하는 것이 중요합니다.`,
    `계약 조건을 기준으로 철거 범위와 후속 작업을 구분하는 것이 좋습니다.`,
  ] as const;

  const seo4 =
    `${pick(seo4Starts, seed, 40)} ` +
    `${pick(seo4Middles, seed, 41)} ` +
    `${pick(seo4Ends, seed, 42)}`;

  /* =======================================================
     SEO 5
  ======================================================= */

  const seo5Starts = [
    `${dong} 철거비용은`,
    `${dong} 철거견적을 확인할 때에는`,
    `${dong}에서 철거 작업의 예상 비용을 알아볼 때에는`,
    `철거견적을 ${dong}에서 확인한다면`,
    `${dong} 철거에 필요한 비용을 살펴보려면`,
    `${dong} 점포나 매장 철거비용을 확인할 때에는`,
  ] as const;

  const seo5Middles = [
    `단순한 면적만으로 정하기 어렵고 폐기물의 양과 종류, 작업 난이도 등을 함께 살펴봐야 합니다.`,
    `평수뿐 아니라 철거 시설물의 종류와 폐기물 반출 조건을 함께 확인하는 것이 좋습니다.`,
    `내부 마감재의 종류와 작업 층수, 엘리베이터 사용 가능 여부 등에 영향을 받을 수 있습니다.`,
    `장비 진입 여부와 폐기물 이동 거리, 건물 접근성 등 여러 조건을 함께 살펴봐야 합니다.`,
    `공간 구조와 철거 범위, 폐기물 발생량 및 작업 환경에 따라 달라질 수 있습니다.`,
    `철거 대상과 작업 시간, 차량 접근 조건 등 현장 상황에 따라 필요한 작업이 달라질 수 있습니다.`,
  ] as const;

  const seo5Ends = [
    `따라서 실제 현장을 기준으로 필요한 작업을 확인하는 것이 좋습니다.`,
    `현장 사진이나 방문 확인을 통해 철거 범위를 구체적으로 파악하는 것이 도움이 됩니다.`,
    `견적 내용을 확인할 때 어떤 공정이 포함되는지도 함께 살펴보는 것이 중요합니다.`,
    `같은 면적이라도 현장 조건에 따라 필요한 작업 방식은 달라질 수 있습니다.`,
    `철거 범위와 작업 조건을 구체적으로 확인한 뒤 견적 내용을 살펴보는 것이 좋습니다.`,
    `면적만 비교하기보다 실제 철거 항목과 현장 환경을 함께 확인하는 것이 중요합니다.`,
  ] as const;

  const seo5 =
    `${pick(seo5Starts, seed, 50)} ` +
    `${pick(seo5Middles, seed, 51)} ` +
    `${pick(seo5Ends, seed, 52)}`;

  /* =======================================================
     SEO 6
  ======================================================= */

  const seo6Starts = [
    `더세이브는 ${dong} 지역에서`,
    `${city} ${district} ${area} ${dong}에서 철거를 준비하고 있다면`,
    `${dong} 철거 상담이 필요한 경우 더세이브는`,
    `더세이브는 ${area} ${dong} 현장의`,
    `${dong} 점포나 상가 철거를 알아보고 있다면 더세이브를 통해`,
    `${dong} 지역에서 철거와 원상복구를 알아본다면`,
  ] as const;

  const seo6Middles = [
    `점포철거, 매장철거, 상가철거, 사무실철거, 폐업철거 및 원상복구에 필요한 현장 조건을 확인합니다.`,
    `공간의 업종과 내부 구조, 필요한 철거 범위와 원상복구 여부를 함께 살펴봅니다.`,
    `철거 대상 시설과 폐기물 반출 환경, 작업 범위를 기준으로 상담을 진행합니다.`,
    `현재 공간 상태와 철거 목적을 확인하여 필요한 작업 방향을 살펴봅니다.`,
    `부분철거부터 폐업철거, 원상복구까지 현장 상황에 필요한 내용을 확인합니다.`,
    `철거가 필요한 시설과 유지할 시설, 후속 복구 여부를 함께 확인합니다.`,
  ] as const;

  const seo6Ends = [
    `현장에 필요한 철거 범위를 기준으로 진행 방향을 안내합니다.`,
    `실제 작업 조건을 확인하여 필요한 내용을 상담할 수 있습니다.`,
    `공간 상황을 기준으로 철거와 후속 작업 내용을 확인할 수 있습니다.`,
    `현장에 맞는 철거 범위를 살펴본 뒤 작업 방향을 정할 수 있습니다.`,
    `철거 전에 필요한 사항을 확인하여 상담을 진행합니다.`,
    `현장의 현재 상태를 기준으로 필요한 작업 내용을 안내합니다.`,
  ] as const;

  const seo6 =
    `${pick(seo6Starts, seed, 60)} ` +
    `${pick(seo6Middles, seed, 61)} ` +
    `${pick(seo6Ends, seed, 62)}`;

  /* =======================================================
     PROCESS
  ======================================================= */

  const consultTexts = [
    `${dong} 현장의 위치와 업종, 면적 및 필요한 철거 내용을 확인합니다.`,
    `철거가 필요한 공간의 주소와 현재 상태, 원하는 작업 범위를 확인합니다.`,
    `폐업이나 이전 일정과 공간 용도, 예상 철거 내용을 먼저 살펴봅니다.`,
    `점포나 매장의 기본 정보와 철거 목적, 작업 희망 시기를 확인합니다.`,
    `${area} ${dong} 현장의 업종과 규모, 철거가 필요한 항목을 확인합니다.`,
    `철거 상담 전 공간의 위치와 면적, 기존 시설물 정보를 확인합니다.`,
  ] as const;

  const visitTexts = [
    `내부 구조와 시설물, 실제 철거 대상 및 폐기물 반출 조건을 확인합니다.`,
    `천장과 바닥, 벽체, 집기 등 제거해야 하는 시설물을 현장에서 살펴봅니다.`,
    `전체철거와 부분철거 범위, 장비 진입 가능 여부와 작업 환경을 확인합니다.`,
    `출입 조건과 폐기물 이동 동선, 원상복구 필요 여부를 함께 확인합니다.`,
    `철거 대상과 유지해야 할 시설물, 건물의 작업 조건을 살펴봅니다.`,
    `현장 내부 구조와 작업 공간, 차량 및 폐기물 반출 조건을 확인합니다.`,
  ] as const;

  const estimateTexts = [
    `확인된 철거 범위와 현장 조건을 기준으로 필요한 견적 내용을 안내합니다.`,
    `철거 대상과 폐기물 처리 범위, 작업 환경을 기준으로 견적을 확인합니다.`,
    `현장에서 확인한 공정과 원상복구 여부를 반영하여 작업 내용을 정리합니다.`,
    `필요한 철거 공정과 현장 조건을 바탕으로 견적 범위를 안내합니다.`,
    `실제 철거 대상과 작업 방법을 기준으로 필요한 내용을 정리합니다.`,
    `철거 범위와 폐기물 처리, 후속 작업 여부를 바탕으로 견적을 안내합니다.`,
  ] as const;

  const workTexts = [
    `협의된 작업 범위와 일정에 맞춰 ${dong} 현장의 철거를 진행합니다.`,
    `확정된 일정과 철거 대상에 따라 필요한 작업을 순서대로 진행합니다.`,
    `사전에 확인한 철거 범위와 현장 조건을 기준으로 작업을 진행합니다.`,
    `협의된 철거 항목과 원상복구 범위에 맞춰 현장 작업을 진행합니다.`,
    `현장 상황과 정해진 작업 범위를 기준으로 철거 공정을 진행합니다.`,
    `확인된 작업 내용과 일정에 맞춰 철거와 필요한 후속 공정을 진행합니다.`,
  ] as const;

  return {
    seed,

    heroTitle: pick(
      heroTitles,
      seed,
      7
    ),

    heroDescription,

    rangeText: pick(
      rangeTexts,
      seed,
      8
    ),

    conditionText: pick(
      conditionTexts,
      seed,
      9
    ),

    restoreText: pick(
      restoreTexts,
      seed,
      10
    ),

    serviceIntro,

    seo: [
      seo1,
      seo2,
      seo3,
      seo4,
      seo5,
      seo6,
    ],

    process: [
      pick(
        consultTexts,
        seed,
        70
      ),

      pick(
        visitTexts,
        seed,
        71
      ),

      pick(
        estimateTexts,
        seed,
        72
      ),

      pick(
        workTexts,
        seed,
        73
      ),
    ],
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

  const content =
    buildDongContent(
      city,
      district,
      area,
      dong
    );

  const titleOptions = [
    `${dong} 철거업체 | 점포·매장·상가·폐업철거`,
    `${dong} 철거 | 매장철거·상가철거·원상복구`,
    `${dong} 철거업체 | 점포철거·폐업철거 상담`,
    `${dong} 철거업체 | 상가·사무실·점포 철거`,
    `${dong} 철거 | 매장·점포·폐업철거 안내`,
    `${dong} 철거업체 | 상가철거·원상복구`,
  ] as const;

  const descriptionOptions = [
    `${city} ${district} ${area} ${dong} 철거업체를 알아보고 있다면 점포철거, 매장철거, 상가철거, 폐업철거, 부분철거 및 원상복구 관련 정보를 확인하세요.`,

    `${dong} 철거를 준비할 때 필요한 현장 구조와 철거 범위, 폐기물 반출 조건, 원상복구 관련 내용을 확인하세요.`,

    `${area} ${dong} 점포와 매장, 상가, 사무실 철거 정보를 확인하세요. 폐업철거와 원상복구에 필요한 현장 조건도 안내합니다.`,

    `${dong} 철거업체 관련 정보를 확인하세요. 전체철거, 부분철거, 점포철거, 매장철거 및 폐업 후 원상복구에 필요한 내용을 안내합니다.`,

    `${city} ${district} ${dong}에서 상가와 점포 철거를 준비한다면 현장 조건과 철거 범위, 폐기물 반출 환경을 확인하세요.`,
  ] as const;

  const title = pick(
    titleOptions,
    content.seed,
    80
  );

  const description = pick(
    descriptionOptions,
    content.seed,
    81
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

  const content =
    buildDongContent(
      city,
      district,
      area,
      dong
    );

  /* =======================================================
     SERVICE
  ======================================================= */

  const demolitionTexts = [
    `${dong}의 상가, 점포, 매장, 음식점, 카페, 사무실 등 공간 구조와 기존 시설물을 확인하여 필요한 철거 범위를 살펴봅니다.`,
    `천장과 바닥, 벽체, 가벽, 집기 등 ${dong} 현장의 실제 철거 대상을 확인하여 전체철거 또는 부분철거 범위를 정합니다.`,
    `${dong} 철거 현장의 업종과 내부 마감 상태를 살펴보고 필요한 시설물 제거와 폐기물 처리 범위를 확인합니다.`,
    `공간의 현재 상태와 철거 목적을 기준으로 ${dong} 현장에 필요한 철거 공정과 작업 범위를 살펴봅니다.`,
    `${dong} 내부 시설물과 작업 조건을 확인하여 현장에 필요한 철거 방법과 범위를 검토합니다.`,
  ] as const;

  const storeTexts = [
    `${dong} 점포의 이전이나 폐업을 준비할 때 기존 인테리어와 집기, 설비 가운데 제거해야 할 항목을 확인합니다.`,
    `점포 내부의 천장과 바닥, 가벽, 집기 등을 살펴보고 ${dong} 현장에 필요한 철거 범위를 구분합니다.`,
    `${dong} 점포철거에서는 기존 시설 가운데 제거할 부분과 유지할 부분을 구분하는 것이 중요합니다.`,
    `폐업이나 이전을 준비하는 ${dong} 점포의 현재 상태를 확인하여 실제 필요한 철거 항목을 살펴봅니다.`,
    `${dong} 점포 내부의 마감재와 집기, 간판 등 철거 대상 시설물을 확인하여 작업 범위를 정합니다.`,
  ] as const;

  const shopTexts = [
    `${dong} 매장의 진열시설과 카운터, 바닥, 벽체, 천장 등의 상태를 확인하여 필요한 철거 범위를 살펴봅니다.`,
    `매장 리뉴얼이나 폐업 목적에 따라 ${dong} 현장의 전체철거 또는 부분철거 범위를 확인합니다.`,
    `${dong} 매장철거는 기존 인테리어와 설비, 집기 배치를 확인하여 제거할 시설과 유지할 시설을 구분합니다.`,
    `업종과 매장 구조를 기준으로 ${dong}에서 필요한 철거 대상과 작업 범위를 확인합니다.`,
    `${dong} 매장의 기존 시설물과 향후 사용 계획을 기준으로 필요한 철거 공정을 살펴봅니다.`,
  ] as const;

  const commercialTexts = [
    `${dong} 상가의 내부 시설물과 폐기물 반출 동선, 장비 진입 조건을 확인하여 필요한 철거 방법을 살펴봅니다.`,
    `상가 내부 구조뿐 아니라 건물의 작업 시간과 공용부 이용 조건을 확인하여 ${dong} 현장의 철거 범위를 정합니다.`,
    `${dong} 상가철거에서는 내부 마감 상태와 시설물, 차량 접근성 및 폐기물 이동 환경을 함께 확인합니다.`,
    `상가의 기존 인테리어와 건물 작업 환경을 기준으로 ${dong} 현장에 필요한 철거 공정을 살펴봅니다.`,
    `${dong} 상가의 층수와 출입 환경, 폐기물 반출 조건을 확인하여 현장에 맞는 작업 방향을 검토합니다.`,
  ] as const;

  const closingTexts = [
    `${dong} 폐업철거를 준비한다면 폐업 일정과 임대차 조건을 확인하여 내부 철거와 원상복구 범위를 함께 살펴봅니다.`,
    `영업 종료 후 공간 반환이 필요한 ${dong} 현장의 철거 대상과 임대인의 복구 요청사항을 확인합니다.`,
    `${dong} 폐업 현장의 집기와 시설물, 간판 및 기존 인테리어 철거 여부를 확인하여 작업 범위를 구분합니다.`,
    `폐업 이후 건물 인도 일정에 맞춰 ${dong} 현장의 철거와 원상복구 항목을 확인합니다.`,
    `${dong} 점포 폐업 시 내부 시설물 철거와 계약상 필요한 복구 범위를 함께 살펴봅니다.`,
  ] as const;

  const restoreTexts = [
    `${dong} 원상복구는 임대차 계약과 임대인의 요청을 기준으로 철거 후 필요한 바닥, 벽체, 천장 등의 복구 범위를 살펴봅니다.`,
    `공간 반환 조건을 확인하여 ${dong} 현장에서 철거 이후 필요한 원상복구 항목을 구분합니다.`,
    `${dong}의 기존 시설물을 철거한 뒤 계약상 복구해야 할 부분이 있는지 확인하여 원상복구 범위를 정합니다.`,
    `임대 당시 상태와 현재 공간을 비교하여 ${dong} 현장에서 필요한 철거와 복구 작업을 함께 살펴봅니다.`,
    `${dong} 임대 공간의 반환 기준을 확인하고 철거 이후 필요한 마감과 복구 항목을 검토합니다.`,
  ] as const;

  const services = [
    {
      number: "01",
      title: `${dong} 철거업체`,
      description: pick(
        demolitionTexts,
        content.seed,
        90
      ),
    },

    {
      number: "02",
      title: `${dong} 점포철거업체`,
      description: pick(
        storeTexts,
        content.seed,
        91
      ),
    },

    {
      number: "03",
      title: `${dong} 매장철거업체`,
      description: pick(
        shopTexts,
        content.seed,
        92
      ),
    },

    {
      number: "04",
      title: `${dong} 상가철거업체`,
      description: pick(
        commercialTexts,
        content.seed,
        93
      ),
    },

    {
      number: "05",
      title: `${dong} 폐업철거업체`,
      description: pick(
        closingTexts,
        content.seed,
        94
      ),
    },

    {
      number: "06",
      title: `${dong} 원상복구`,
      description: pick(
        restoreTexts,
        content.seed,
        95
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

      {/* HERO */}

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
                {content.heroTitle}
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

      {/* INFORMATION */}

      <section
        id="information"
        className="bg-[#f3f3f0] py-20 text-black sm:py-24"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.22em] text-neutral-600">
            LOCAL DEMOLITION GUIDE
          </p>

          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">

            {dong} 철거 전

            <br />

            확인할 핵심 사항

          </h2>

          <div className="mt-14 grid gap-px bg-neutral-300 md:grid-cols-3">

            <article className="min-h-[330px] bg-white p-7 sm:p-9">

              <span className="text-base font-black text-neutral-500">
                01
              </span>

              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                철거 대상
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-neutral-700">
                {content.rangeText}
              </p>

            </article>

            <article className="min-h-[330px] bg-[#111] p-7 text-white sm:p-9">

              <span className="text-base font-black text-[#ffd600]">
                02
              </span>

              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                작업 환경
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-neutral-100">
                {content.conditionText}
              </p>

            </article>

            <article className="min-h-[330px] bg-[#ffd600] p-7 sm:p-9">

              <span className="text-base font-black text-black/60">
                03
              </span>

              <h3 className="mt-16 text-2xl font-black sm:mt-20 sm:text-3xl">
                반환 조건
              </h3>

              <p className="mt-5 text-lg font-medium leading-8 text-black/80">
                {content.restoreText}
              </p>

            </article>

          </div>

        </div>

      </section>

      {/* SERVICES */}

      <section className="bg-[#080808] py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            DEMOLITION SERVICE
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {dong} 철거 서비스
          </h2>

          <p className="mt-6 max-w-3xl text-lg font-medium leading-9 text-neutral-100">
            {content.serviceIntro}
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

      {/* 무료 방문 견적 */}

      <EstimateBanner />

      {/* SEO CONTENT */}

      <section className="bg-[#171717] py-20 sm:py-24">

        <div className="mx-auto max-w-5xl px-5 sm:px-6">

          <p className="mb-5 text-sm font-black tracking-[0.25em] text-[#ffd600]">
            LOCAL DEMOLITION INFORMATION
          </p>

          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">

            {dong} 철거,

            <br />

            공간에 따라 달라집니다

          </h2>

          <div className="mt-10 space-y-8 text-lg font-medium leading-9 text-neutral-100 sm:text-xl sm:leading-10">

            {content.seo.map(
              (
                paragraph,
                index
              ) => (

                <p
                  key={
                    `${dong}-seo-${index}`
                  }
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
            {dong} 철거 진행 절차
          </h2>

          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">

            {[
              [
                "01",
                "기본 상담",
                content.process[0],
              ],

              [
                "02",
                "현장 확인",
                content.process[1],
              ],

              [
                "03",
                "견적 확인",
                content.process[2],
              ],

              [
                "04",
                "현장 작업",
                content.process[3],
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

              {dong}
              {" "}
              철거 견적이

              <br className="sm:hidden" />

              {" "}
              필요하신가요?

            </h2>

            <p className="mt-5 text-lg font-semibold leading-8 text-black/75">

              {dong} 현장의 업종과 면적,
              현재 내부 상태와 필요한
              철거 내용을 알려주세요.

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

      {/* BACK NAVIGATION */}

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