import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "../lib/notion";
import { Navigation } from "../components/nav";

export const revalidate = 60;

export default async function BlogPage() {
	const posts = await getBlogPosts();

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto max-w-7xl lg:px-8 md:pt-24 lg:pt-32">
				<div className="mb-8">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Blog
					</h2>
					<p className="mt-4 text-zinc-400">
						{/* 개발 경험과 학습 내용을 기록합니다. */}
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800 mb-8" />

				<div className="flex flex-col divide-y divide-zinc-800">
					{posts.map((post) => (
						<Link
							key={post.id}
							href={`/blog/${post.slug}`}
							className="group flex items-center gap-6 py-6 hover:bg-zinc-800/20 -mx-4 px-4 rounded-lg transition-colors duration-200"
						>
							{/* 썸네일 */}
							<div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-zinc-800/50">
								{post.coverImage ? (
									<Image
										src={post.coverImage}
										alt={post.title}
										width={96}
										height={96}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<span className="text-zinc-600 text-xs">No Image</span>
									</div>
								)}
							</div>

							{/* 텍스트 */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									{post.date ? (
										<time dateTime={post.date} className="text-xs text-zinc-500">
											{Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
												new Date(post.date)
											)}
										</time>
									) : (
										<span className="text-xs text-zinc-500">SOON</span>
									)}
									{post.tags.length > 0 && (
										<>
											<span className="text-zinc-700">·</span>
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
										</>
									)}
								</div>
								<h2 className="text-base font-semibold text-zinc-200 group-hover:text-white truncate transition-colors duration-200">
									{post.title}
								</h2>
								{post.description && (
									<p className="mt-1 text-sm text-zinc-500 group-hover:text-zinc-400 line-clamp-2 transition-colors duration-200">
										{post.description}
									</p>
								)}
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
