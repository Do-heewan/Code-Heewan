import { notFound } from "next/navigation";
import { getAlgorithmPost, getAlgorithmPosts } from "../../lib/notion";
import { Navigation } from "../../components/nav";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const difficultyColor: Record<string, string> = {
	Easy: "text-green-600 bg-green-100",
	Medium: "text-yellow-600 bg-yellow-100",
	Hard: "text-red-600 bg-red-100",
};

export default async function AlgorithmPostPage({ params }: Props) {
	const result = await getAlgorithmPost(params.slug);

	if (!result) {
		notFound();
	}

	const { post, markdown } = result;

	return (
		<div className="bg-zinc-50 min-h-screen">
			<Navigation />
			<div className="px-6 pt-24 pb-16 mx-auto max-w-3xl lg:px-8 md:pt-32">
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-2">
						{post.difficulty && (
							<span
								className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor[post.difficulty] ?? "text-zinc-600 bg-zinc-200"}`}
							>
								{post.difficulty}
							</span>
						)}
						{post.platform && (
							<span className="text-xs px-2 py-1 rounded-full bg-zinc-200 text-zinc-700">
								{post.platform}
							</span>
						)}
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
					</div>
					<h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl font-display">
						{post.title}
					</h1>
					{post.description && (
						<p className="mt-4 text-lg text-zinc-600">{post.description}</p>
					)}
					{post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-4">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="text-xs px-2 py-1 rounded-full bg-zinc-200 text-zinc-700"
								>
									{tag}
								</span>
							))}
						</div>
					)}<a
						className="inline-block mt-4 text-sm text-zinc-800"
					>
						🔗URL :
					</a>
					{post.url && (
						<a
							href={post.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block mt-4 text-sm text-zinc-500 hover:text-zinc-800 underline underline-offset-2 transition-colors duration-200"
						>
							{post.url}
						</a>
					)}
					<div className="mt-8 w-full h-px bg-zinc-200" />
				</div>

				<article className="prose prose-zinc max-w-none">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{markdown}
					</ReactMarkdown>
				</article>
			</div>
		</div>
	);
}
