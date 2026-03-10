import Link from "next/link";
import { getBlogPosts } from "../lib/notion";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

export const revalidate = 60;

export default async function BlogPage() {
	const posts = await getBlogPosts();

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Blog
					</h2>
					<p className="mt-4 text-zinc-400">
						개발 경험과 학습 내용을 기록합니다.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => (
						<Card key={post.id}>
							<Link href={`/blog/${post.slug}`} className="block p-6">
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
									<div className="flex flex-wrap gap-1">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
											>
												{tag}
											</span>
										))}
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
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
