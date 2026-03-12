import Link from "next/link";
import { getAlgorithmPosts } from "../lib/notion";
import { Navigation } from "../components/nav";
import { PlatformBadge, DifficultyBadge } from "../components/algorithmBadge";

export const revalidate = 60;

const PAGE_SIZE = 20;


export default async function AlgorithmPage({
	searchParams,
}: {
	searchParams: { page?: string };
}) {
	const allPosts = await getAlgorithmPosts();
	const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
	const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
	const posts = allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto max-w-7xl lg:px-8 md:pt-24 lg:pt-32">
				<div className="mb-8">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Algorithm
					</h2>
					<p className="mt-4 text-zinc-400">
						{/* 알고리즘 문제 풀이를 기록합니다. */}
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800 mb-8" />

				<div className="flex flex-col divide-y divide-zinc-800">
					{posts.map((post) => (
						<div
							key={post.id}
							className="group py-4 hover:bg-zinc-800/20 -mx-4 px-4 rounded-lg transition-colors duration-200"
						>
							<Link href={`/algorithm/${post.slug}`} className="flex items-start justify-between gap-4">
								<div className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200">
										{post.title}
									</h2>
									<div className="flex gap-2">
										<PlatformBadge platform={post.platform} />
										<DifficultyBadge difficulty={post.difficulty} />
									</div>
								</div>
								<div className="flex flex-col items-end gap-1 shrink-0">
									{post.tags.length > 0 && (
										<div className="flex flex-wrap gap-1 justify-end">
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

								</div>
							</Link>
							{/* {post.url && (
								<a
									href={post.url}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-0.5 text-xs text-zinc-500 hover:text-zinc-300 truncate block transition-colors duration-200"
								>
									{post.url}
								</a>
							)} */}
							{post.date ? (
								<time dateTime={post.date} className="text-xs text-zinc-500">
									{Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
										new Date(post.date)
									)}
								</time>
							) : (
								<span className="text-xs text-zinc-500">SOON</span>
							)}
							{post.description && (
								<p className="mt-1 text-sm text-zinc-500 line-clamp-2">
									{post.description}
								</p>
							)}
						</div>
					))}
				</div>

				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 mt-12">
						{currentPage > 1 && (
							<Link
								href={`/algorithm?page=${currentPage - 1}`}
								className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors duration-200"
							>
								← 이전
							</Link>
						)}
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Link
								key={page}
								href={`/algorithm?page=${page}`}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${page === currentPage
									? "bg-zinc-100 text-zinc-900 font-medium"
									: "text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800"
									}`}
							>
								{page}
							</Link>
						))}
						{currentPage < totalPages && (
							<Link
								href={`/algorithm?page=${currentPage + 1}`}
								className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors duration-200"
							>
								다음 →
							</Link>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
