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

    const pages = await queryAllPages(databaseId);
    return pages.find((page) => resolvePageSlug(page) === slug) ?? null;
}

function pageToPost(page: PageObjectResponse): BlogPost {
    const props = page.properties;

    const titleProp = props["Title"] as any;
    const dateProp = props["Date"] as any;
    const tagsProp = props["Algorithms"] as any;
    const descProp = props["Description"] as any;
    const publishedProp = props["Published"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: resolvePageSlug(page),
        date: dateProp?.date?.start ?? null,
        tags: tagsProp?.multi_select?.map((t: any) => t.name) ?? [],
        description: descProp?.rich_text?.[0]?.plain_text ?? "",
        published: publishedProp?.checkbox === true,
    };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID!,
        filter: {
            property: "Status",
            checkbox: { equals: true },
        },
        sorts: [{ property: "Date", direction: "descending" }],
    });

    return (response.results as PageObjectResponse[]).map(pageToPost);
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
    const markdown = n2m.toMarkdownString(mdBlocks).parent;

    return { post, markdown };
}

export async function getBlogPost(
    slug: string,
): Promise<{ post: BlogPost; markdown: string } | null> {
    const page = await findPageBySlug(process.env.NOTION_BLOG_DATABASE_ID!, slug);
    if (!page) return null;

    const post = pageToPost(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent;

    return { post, markdown };
}

export async function getAboutPage(): Promise<string> {
    const pageId = process.env.NOTION_ABOUT_PAGE_ID;
    if (!pageId) return "";

    const mdBlocks = await n2m.pageToMarkdown(pageId);
    return n2m.toMarkdownString(mdBlocks).parent;
}
