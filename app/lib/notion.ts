import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export type BlogPost = {
    id: string;
    slug: string;
    title: string;
    date: string | null;
    tags: string[];
    description: string;
    published: boolean;
    coverImage: string | null;
};

function resolvePageSlug(page: PageObjectResponse): string {
    const props = page.properties as any;
    const dateValue = props["Date"]?.date?.start ?? page.created_time ?? "";
    const datePart = dateValue.slice(0, 10).replace(/-/g, "") || "undated";
    const idPart = page.id.replace(/-/g, "");

    return `${datePart}-${idPart}`;
}

function isPageObjectResponse(result: any): result is PageObjectResponse {
    return result?.object === "page" && result?.properties;
}

async function queryAllPages(databaseId: string): Promise<PageObjectResponse[]> {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
        const response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
            page_size: 100,
        });

        pages.push(...response.results.filter(isPageObjectResponse));
        cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return pages;
}

async function findPageBySlug(
    databaseId: string,
    slug: string,
): Promise<PageObjectResponse | null> {
    try {
        const directMatch = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "Slug",
                rich_text: { equals: slug },
            },
            page_size: 1,
        });

        const directPage = directMatch.results.find(isPageObjectResponse);
        if (directPage) return directPage;
    } catch {
        // "Slug" 속성이 DB에 없는 경우 무시하고 자동 생성 slug로 탐색
    }

    const pages = await queryAllPages(databaseId);
    return pages.find((page) => resolvePageSlug(page) === slug) ?? null;
}

const TEXT_BLOCK_TYPES = ["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "quote", "callout"];

async function getPagePreview(pageId: string): Promise<{ coverImage: string | null; preview: string }> {
    const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
    });

    let coverImage: string | null = null;
    let preview = "";

    for (const block of response.results) {
        const b = block as any;
        if (!coverImage && b.type === "image") {
            if (b.image?.type === "external") coverImage = b.image.external.url;
            else if (b.image?.type === "file") coverImage = b.image.file.url;
        }
        if (!preview && TEXT_BLOCK_TYPES.includes(b.type)) {
            const richText = b[b.type]?.rich_text ?? [];
            const text = richText.map((t: any) => t.plain_text).join("").trim();
            if (text) preview = text;
        }
        if (coverImage && preview) break;
    }

    return { coverImage, preview };
}

function pageToPost(page: PageObjectResponse, coverImage: string | null, preview: string): BlogPost {
    const props = page.properties;

    const titleProp = props["Title"] as any;
    const dateProp = props["Date"] as any;
    const tagsProp = props["Algorithms"] as any;
    const publishedProp = props["Published"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: resolvePageSlug(page),
        date: dateProp?.date?.start ?? null,
        tags: tagsProp?.multi_select?.map((t: any) => t.name) ?? [],
        description: preview,
        published: publishedProp?.status === "Published",
        coverImage,
    };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID!,
        filter: {
            property: "Status",
            status: { equals: "Published" },
        },
        sorts: [{ property: "Date", direction: "descending" }],
    });

    const pages = response.results as PageObjectResponse[];
    return Promise.all(
        pages.map(async (page) => {
            const { coverImage, preview } = await getPagePreview(page.id);
            return pageToPost(page, coverImage, preview);
        })
    );
}

export type AlgorithmPost = {
    id: string;
    slug: string;
    title: string;
    date: string | null;
    tags: string[];
    description: string;
    difficulty: string;
    platform: string;
    url: string | null;
    published: boolean;
};

function pageToAlgorithmPost(page: PageObjectResponse): AlgorithmPost {
    const props = page.properties;

    const titleProp = props["Title"] as any;
    const dateProp = props["Date"] as any;
    const tagsProp = props["Algorithm"] as any;
    const descProp = props["Description"] as any;
    const difficultyProp = props["Difficulty"] as any;
    const platformProp = props["Platform"] as any;
    const urlProp = props["URL"] as any;
    const publishedProp = props["Published"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: resolvePageSlug(page),
        date: dateProp?.date?.start ?? null,
        tags: tagsProp?.multi_select?.map((t: any) => t.name) ?? [],
        description: descProp?.rich_text?.[0]?.plain_text ?? "",
        difficulty: difficultyProp?.select?.name ?? "",
        platform: platformProp?.select?.name ?? "",
        url: urlProp?.url ?? null,
        published: publishedProp?.checkbox === true,
    };
}

export async function getAlgorithmPosts(): Promise<AlgorithmPost[]> {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_ALGORITHMS_DATABASE_ID!,
        filter: {
            property: "Published",
            checkbox: { equals: true }
        },
        sorts: [{ property: "Date", direction: "descending" }],
    });

    return (response.results as PageObjectResponse[]).map(pageToAlgorithmPost);
}

export async function getAlgorithmPost(
    slug: string,
): Promise<{ post: AlgorithmPost; markdown: string } | null> {
    const page = await findPageBySlug(
        process.env.NOTION_ALGORITHMS_DATABASE_ID!,
        slug,
    );
    if (!page) return null;

    const post = pageToAlgorithmPost(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent
        .replace(/\\([*_~`])/g, "$1");

    return { post, markdown };
}

export async function getBlogPost(
    slug: string,
): Promise<{ post: BlogPost; markdown: string } | null> {
    const page = await findPageBySlug(process.env.NOTION_BLOG_DATABASE_ID!, slug);
    if (!page) return null;

    const { coverImage, preview } = await getPagePreview(page.id);
    const post = pageToPost(page, coverImage, preview);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent
        .replace(/\\([*_~`])/g, "$1");

    return { post, markdown };
}

export async function getAboutPage(): Promise<string> {
    const pageId = process.env.NOTION_ABOUT_PAGE_ID;
    if (!pageId) return "";

    const mdBlocks = await n2m.pageToMarkdown(pageId);
    return n2m.toMarkdownString(mdBlocks).parent;
}
