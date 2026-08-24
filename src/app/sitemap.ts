import type { MetadataRoute } from "next";
import {
  regions,
  makeRegionUrl,
  type RegionNode,
  type RegionData,
} from "../regions";

const BASE_URL = "https://www.thesavecompany.com";

function collectRegionPaths(
  nodes: RegionNode[],
  parentPath: string[]
): string[][] {
  const paths: string[][] = [];

  for (const node of nodes) {
    const currentPath = [...parentPath, node.name];

    paths.push(currentPath);

    if (node.children && node.children.length > 0) {
      paths.push(
        ...collectRegionPaths(
          node.children,
          currentPath
        )
      );
    }
  }

  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const cities = Object.keys(
    regions
  ) as Array<keyof RegionData>;

  for (const city of cities) {
    const cityPath = [city];

    sitemapEntries.push({
      url: `${BASE_URL}${makeRegionUrl(
        cityPath
      )}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    const childPaths =
      collectRegionPaths(
        regions[city],
        cityPath
      );

    for (const path of childPaths) {
      let priority = 0.7;

      if (path.length === 2) {
        priority = 0.85;
      } else if (path.length === 3) {
        priority = 0.75;
      } else if (path.length >= 4) {
        priority = 0.65;
      }

      sitemapEntries.push({
        url: `${BASE_URL}${makeRegionUrl(
          path
        )}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority,
      });
    }
  }

  return sitemapEntries;
}