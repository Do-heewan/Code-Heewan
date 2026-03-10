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
    const tagsProp = props["Tags"] as any;
    const descProp = props["Description"] as any;
    const publishedProp = props["Status"] as any;

    return {
        id: page.id,
        title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
        slug: slugProp?.rich_text?.[0]?.plain_text ?? page.id,
        date: dateProp?.date?.start ?? null,
        tags: tagsProp?.multi_select?.map((t: any) => t.name) ?? [],
        description: descProp?.rich_text?.[0]?.plain_text ?? "",
        published: publishedProp?.status?.name === "Published",
    };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DATABASE_ID!,
        filter: {
            property: "Status",
            status: { equals: "Published" }
        },
        sorts: [{ property: "Date", direction: "descending" }],
    });

    return (response.results as PageObjectResponse[]).map(pageToPost);
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
