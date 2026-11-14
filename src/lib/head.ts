interface PageHeadOptions {
  title: string;
  description: string;
}

/** Standard head() payload for a leaf route: unique title, description and social tags. */
export function pageHead({ title, description }: PageHeadOptions) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
}
