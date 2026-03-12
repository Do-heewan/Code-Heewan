import Link from "next/link";
import { getAlgorithmPosts } from "../lib/notion";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

export const revalidate = 60;

const difficultyColor: Record<string, string> = {
	Easy: "text-green-400 bg-green-400/10",
	Medium: "text-yellow-400 bg-yellow-400/10",
	Hard: "text-red-400 bg-red-400/10",
};

export default async function AlgorithmPage() {
	const posts = await getAlgorithmPosts();

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Algorithm
					</h2>
					<p className="mt-4 text-zinc-400">
						알고리즘 문제 풀이를 기록합니다.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<Card key={post.id}>
							<Link href={`/algorithm/${post.slug}`} className="block p-6">
								<div className="flex items-center justify-between gap-2 mb-3">
									{post.date ? (
										<time
											dateTime={post.date}
											className="text-xs text-zinc-500"
										>
											{Intl.DateTimeFormat("ko-KR", {
												dateStyle: "medium",
											}).format(new Date(post.date))}
										</time>
									) : (
										<span className="text-xs text-zinc-500">SOON</span>
									)}
									<div className="flex items-center gap-2">
										{post.difficulty && (
											<span
												className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[post.difficulty] ?? "text-zinc-400 bg-zinc-800"}`}
											>
												{post.difficulty}
											</span>
										)}
										{post.platform && (
											<span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
												{post.platform}
											</span>
										)}
									</div>
								</div>
								<h2 className="z-20 text-xl font-medium duration-1000 text-zinc-200 group-hover:text-white font-display">
									{post.title}
								</h2>
								{post.description && (
									<p className="z-20 mt-3 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200 line-clamp-2">
										{post.description}
									</p>
								)}
								{post.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mt-3">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
