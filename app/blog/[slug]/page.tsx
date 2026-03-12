import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "../../lib/notion";
import { Navigation } from "../../components/nav";
import { BlogContent } from "../../components/BlogContent";

export const revalidate = 60;

type Props = {
	params: {
		slug: string;
	};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
	const posts = await getBlogPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
	const result = await getBlogPost(params.slug);

	if (!result) {
		notFound();
	}

	const { post, markdown } = result;

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto max-w-3xl lg:px-8 md:pt-24 lg:pt-32">
				<div className="mb-8">
					{post.date && (
						<time
							dateTime={post.date}
							className="text-sm text-zinc-500"
						>
							{Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(
								new Date(post.date),
							)}
						</time>
					)}
					<h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
						{post.title}
					</h1>
					{post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-4">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400"
								>
									{tag}
								</span>
							))}
						</div>
					)}
					<div className="mt-8 w-full h-px bg-zinc-800" />
				</div>

				<article className="prose prose-invert prose-zinc max-w-none">
					<BlogContent markdown={markdown} />
				</article>
			</div>
		</div>
	);
}
