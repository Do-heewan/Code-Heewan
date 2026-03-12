import { notFound } from "next/navigation";
import { getAlgorithmPost, getAlgorithmPosts } from "../../lib/notion";
import { Navigation } from "../../components/nav";
import { PlatformBadge, DifficultyBadge } from "../../components/algorithmBadge";
import { BlogContent } from "../../components/BlogContent";

export const revalidate = 60;

type Props = {
	params: {
		slug: string;
	};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
	const posts = await getAlgorithmPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function AlgorithmPostPage({ params }: Props) {
	const result = await getAlgorithmPost(params.slug);

	if (!result) {
		notFound();
	}

	const { post, markdown } = result;

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto max-w-3xl lg:px-8 md:pt-24 lg:pt-32">
				<div className="mb-8">
					<h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
						{post.title}
					</h1>
					<div className="flex items-center gap-2 mt-3">
						<PlatformBadge platform={post.platform} />
						<DifficultyBadge difficulty={post.difficulty} />
					</div>
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
					<div className="flex items-center justify-between mt-4">
						<div className="flex items-center gap-1 text-sm">
							<span className="text-zinc-400">🔗URL :</span>
							{post.url && (
								<a
									href={post.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-zinc-500 hover:text-zinc-200 underline underline-offset-2 transition-colors duration-200"
								>
									{post.url}
								</a>
							)}
						</div>
						{post.date && (
							<time dateTime={post.date} className="text-sm text-zinc-500 shrink-0">
								{Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(
									new Date(post.date),
								)}
							</time>
						)}
					</div>
					<div className="mt-8 w-full h-px bg-zinc-800" />
				</div>

				<article className="prose prose-invert prose-zinc max-w-none">
					<BlogContent markdown={markdown} />
				</article>
			</div>
		</div>
	);
}
