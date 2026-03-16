import Link from "next/link";
import Image from "next/image";
import { getAlgorithmPosts } from "../lib/notion";
import { Navigation } from "../components/nav";
import { DifficultyBadge } from "../components/algorithmBadge";

export const revalidate = 60;

const PAGE_SIZE = 30;

const PLATFORM_FILTERS = [
	{ label: "전체", value: "" },
	{ label: "BOJ", value: "BOJ" },
	{ label: "PS", value: "PS" },
];

export default async function AlgorithmPage({
	searchParams,
}: {
	searchParams: { page?: string; platform?: string };
}) {
	const allPosts = await getAlgorithmPosts();
	const platform = searchParams.platform ?? "";
	const filteredPosts = platform
		? allPosts.filter((p) => p.platform === platform)
		: allPosts;

	const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
	const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
	const posts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	function pageHref(page: number) {
		const params = new URLSearchParams();
		if (platform) params.set("platform", platform);
		if (page > 1) params.set("page", String(page));
		const qs = params.toString();
		return qs ? `/algorithm?${qs}` : "/algorithm";
	}

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

				{/* 플랫폼 필터 */}
				<div className="flex gap-2 mb-6">
					{PLATFORM_FILTERS.map((filter) => (
						<Link
							key={filter.value}
							href={filter.value ? `/algorithm?platform=${filter.value}` : "/algorithm"}
							className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${platform === filter.value
								? "bg-zinc-100 text-zinc-900 font-medium"
								: "bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
								}`}
						>
							{filter.label}
						</Link>
					))}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => (
						<Link
							key={post.id}
							href={`/algorithm/${post.slug}`}
							className="group flex flex-col rounded-xl overflow-hidden bg-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/70 transition-all duration-200"
						>
							<div className="relative w-full aspect-video bg-zinc-800">
								{post.coverImage ? (
									<Image
										src={post.coverImage}
										alt={post.title}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
										No Image
									</div>
								)}
							</div>
							<div className="flex flex-col gap-2 p-4">
								<h2 className="text-base font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200 line-clamp-2">
									{/* <DifficultyBadge difficulty={post.difficulty} /> */}
									{post.title}

								</h2>

								{/* {post.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400"
											>
												{tag}
											</span>
										))}
									</div>
								)} */}
								<span className="mt-auto pt-1 text-xs text-zinc-500">
									{post.date
										? Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(post.date))
										: "SOON"}
								</span>
							</div>
						</Link>
					))}
				</div>

				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 mt-12">
						{currentPage > 1 && (
							<Link
								href={pageHref(currentPage - 1)}
								className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors duration-200"
							>
								← 이전
							</Link>
						)}
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Link
								key={page}
								href={pageHref(page)}
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
								href={pageHref(currentPage + 1)}
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
