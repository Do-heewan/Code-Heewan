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

function pageToPost(page: PageObjectResponse): BlogPost {
    const props = page.properties;

    const titleProp = props["Title"] as any;
    const slugProp = props["Slug"] as any;
    const dateProp = props["Date"] as any;
    const tagsProp = props["Algorithms"] as any;
    const descProp = props["Description"] as any;
    const publishedProp = props["Published"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: slugProp?.rich_text?.[0]?.plain_text ?? page.id,
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
    const slugProp = props["Slug"] as any;
    const dateProp = props["Date"] as any;
    const tagsProp = props["Algorithm"] as any;
    const descProp = props["Description"] as any;
    const difficultyProp = props["Difficulty"] as any;
    const platformProp = props["Platform"] as any;
    const publishedProp = props["Published"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: slugProp?.rich_text?.[0]?.plain_text ?? page.id,
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
    const response = await notion.databases.query({
        database_id: process.env.NOTION_ALGORITHMS_DATABASE_ID!,
        filter: {
            property: "Slug",
            rich_text: { equals: slug },
        },
    });

    if (!response.results.length) return null;

    const page = response.results[0] as PageObjectResponse;
    const post = pageToAlgorithmPost(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent;

    return { post, markdown };
}

export async function getBlogPost(
    slug: string,
): Promise<{ post: BlogPost; markdown: string } | null> {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID!,
        filter: {
            property: "Slug",
            rich_text: { equals: slug },
        },
    });

    if (!response.results.length) return null;

    const page = response.results[0] as PageObjectResponse;
    const post = pageToPost(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent;

    return { post, markdown };
}