import { NextResponse } from "next/server";

const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";

export const dynamic = "force-dynamic";

type HashnodePinnedResponse = {
  data?: {
    publication?: {
      pinnedPost?: {
        id: string;
        title: string;
        brief?: string | null;
        slug: string;
        url?: string | null;
        coverImage?: { url?: string | null } | null;
        publishedAt?: string | null;
      } | null;
      posts?: {
        edges?: Array<{
          node?: {
            id: string;
            title: string;
            brief?: string | null;
            slug: string;
            url?: string | null;
            coverImage?: { url?: string | null } | null;
            publishedAt?: string | null;
          } | null;
        } | null> | null;
      } | null;
    } | null;
  };
  errors?: unknown;
};

export async function GET() {
  try {
    const rawHost =
      process.env.HASHNODE_PUBLICATION_HOST ||
      process.env.HASHNODE_HOST ||
      process.env.NEXT_PUBLIC_HASHNODE_HOST;

    if (!rawHost) {
      return NextResponse.json([], { status: 200 });
    }

    // Normalize host: remove protocol and trailing slash if provided
    const host = String(rawHost)
      .replace(/^https?:\/\//i, "")
      .replace(/\/$/, "");

    const query = /* GraphQL */ `
      query Articles($host: String!, $first: Int!) {
        publication(host: $host) {
          pinnedPost {
            id
            title
            brief
            slug
            url
            publishedAt
            coverImage { url }
          }
          posts(first: $first) {
            edges {
              node {
                id
                title
                brief
                slug
                url
                publishedAt
                coverImage { url }
              }
            }
          }
        }
      }
    `;

    const gqlRes = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ query, variables: { host, first: 5 } }),
      // Avoid caching to reflect pin changes quickly
      cache: "no-store",
    });

    if (!gqlRes.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const json = (await gqlRes.json()) as HashnodePinnedResponse;

    const pub = json?.data?.publication;
    const pinned = pub?.pinnedPost || null;
    const list = pub?.posts?.edges?.map((e: any) => e?.node).filter(Boolean) || [];

    // Start with pinned (if present), then fill with latest posts, dedup by id, keep max 3
    const combined: Array<any> = [pinned, ...list].filter(Boolean);
    const seen = new Set<string>();
    const top3 = combined.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).slice(0, 3);

    const articles = top3.map((post) => ({
      id: post.id,
      title: post.title,
      brief: post.brief ?? "",
      slug: post.slug,
      url: post.url || `https://${host}/${post.slug}`,
      publishedAt: post.publishedAt ?? null,
      coverImageUrl: post.coverImage?.url ?? null,
    }));

    const res = NextResponse.json(articles);
    res.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=300");
    return res;
  } catch (error) {
    console.error("Error fetching Hashnode pinned articles:", error);
    return NextResponse.json([], { status: 200 });
  }
}
