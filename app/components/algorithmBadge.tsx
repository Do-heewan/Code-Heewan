import Image from "next/image";

// ─── 플랫폼 설정 ───────────────────────────────────────────
const PLATFORM_CONFIG: Record<string, { style: string; icon?: string }> = {
	PS: { style: "bg-orange-900/50 text-orange-300", icon: "/icons/platform/ps.svg" },
	BOJ: { style: "bg-blue-900/50 text-blue-300", icon: "/icons/platform/boj.svg" },
};

// ─── 난이도 설정 ───────────────────────────────────────────
// 긴 키(구체적인 값)가 먼저 매칭되도록 getDifficultyConfig에서 정렬 처리
const DIFFICULTY_CONFIG: Record<string, { style: string; icon?: string }> = {
	// ── Programmers ──────────────────────────────────────
	"level 0": { style: "bg-green-900/50 text-green-300", icon: "/icons/difficulty/ps/level0.svg" },
	"level 1": { style: "bg-green-900/50 text-green-300", icon: "/icons/difficulty/ps/level1.svg" },
	"level 2": { style: "bg-yellow-900/50 text-yellow-300", icon: "/icons/difficulty/ps/level2.svg" },
	"level 3": { style: "bg-orange-900/50 text-orange-300", icon: "/icons/difficulty/ps/level3.svg" },
	"level 4": { style: "bg-red-900/50 text-red-300", icon: "/icons/difficulty/ps/level4.svg" },
	"level 5": { style: "bg-purple-900/50 text-purple-300", icon: "/icons/difficulty/ps/level5.svg" },

	// ── BOJ 브론즈 ───────────────────────────────────────
	"브론즈 v": { style: "bg-amber-900/50 text-amber-600", icon: "/icons/difficulty/bronze/bronze5.svg" },
	"브론즈 iv": { style: "bg-amber-900/50 text-amber-600", icon: "/icons/difficulty/bronze/bronze4.svg" },
	"브론즈 iii": { style: "bg-amber-900/50 text-amber-600", icon: "/icons/difficulty/bronze/bronze3.svg" },
	"브론즈 ii": { style: "bg-amber-900/50 text-amber-600", icon: "/icons/difficulty/bronze/bronze2.svg" },
	"브론즈 i": { style: "bg-amber-900/50 text-amber-600", icon: "/icons/difficulty/bronze/bronze1.svg" },

	// ── BOJ 실버 ─────────────────────────────────────────
	"실버 v": { style: "bg-slate-600/50 text-slate-300", icon: "/icons/difficulty/silver/silver5.svg" },
	"실버 iv": { style: "bg-slate-600/50 text-slate-300", icon: "/icons/difficulty/silver/silver4.svg" },
	"실버 iii": { style: "bg-slate-600/50 text-slate-300", icon: "/icons/difficulty/silver/silver3.svg" },
	"실버 ii": { style: "bg-slate-600/50 text-slate-300", icon: "/icons/difficulty/silver/silver2.svg" },
	"실버 i": { style: "bg-slate-600/50 text-slate-300", icon: "/icons/difficulty/silver/silver1.svg" },

	// ── BOJ 골드 ─────────────────────────────────────────
	"골드 v": { style: "bg-yellow-800/50 text-yellow-400", icon: "/icons/difficulty/gold/gold5.svg" },
	"골드 iv": { style: "bg-yellow-800/50 text-yellow-400", icon: "/icons/difficulty/gold/gold4.svg" },
	"골드 iii": { style: "bg-yellow-800/50 text-yellow-400", icon: "/icons/difficulty/gold/gold3.svg" },
	"골드 ii": { style: "bg-yellow-800/50 text-yellow-400", icon: "/icons/difficulty/gold/gold2.svg" },
	"골드 i": { style: "bg-yellow-800/50 text-yellow-400", icon: "/icons/difficulty/gold/gold1.svg" },

	// ── BOJ 플래티넘 ─────────────────────────────────────
	"플래티넘 v": { style: "bg-teal-900/50 text-teal-300", icon: "/icons/difficulty/platinum/platinum5.svg" },
	"플래티넘 iv": { style: "bg-teal-900/50 text-teal-300", icon: "/icons/difficulty/platinum/platinum4.svg" },
	"플래티넘 iii": { style: "bg-teal-900/50 text-teal-300", icon: "/icons/difficulty/platinum/platinum3.svg" },
	"플래티넘 ii": { style: "bg-teal-900/50 text-teal-300", icon: "/icons/difficulty/platinum/platinum2.svg" },
	"플래티넘 i": { style: "bg-teal-900/50 text-teal-300", icon: "/icons/difficulty/platinum/platinum1.svg" },

	// ── BOJ 다이아 ───────────────────────────────────────
	"다이아 v": { style: "bg-cyan-900/50 text-cyan-300", icon: "/icons/difficulty/diamond/diamond5.svg" },
	"다이아 iv": { style: "bg-cyan-900/50 text-cyan-300", icon: "/icons/difficulty/diamond/diamond4.svg" },
	"다이아 iii": { style: "bg-cyan-900/50 text-cyan-300", icon: "/icons/difficulty/diamond/diamond3.svg" },
	"다이아 ii": { style: "bg-cyan-900/50 text-cyan-300", icon: "/icons/difficulty/diamond/diamond2.svg" },
	"다이아 i": { style: "bg-cyan-900/50 text-cyan-300", icon: "/icons/difficulty/diamond/diamond1.svg" },

	// ── BOJ 루비 ─────────────────────────────────────────
	"루비 v": { style: "bg-rose-900/50 text-rose-300", icon: "/icons/difficulty/ruby/ruby5.svg" },
	"루비 iv": { style: "bg-rose-900/50 text-rose-300", icon: "/icons/difficulty/ruby/ruby4.svg" },
	"루비 iii": { style: "bg-rose-900/50 text-rose-300", icon: "/icons/difficulty/ruby/ruby3.svg" },
	"루비 ii": { style: "bg-rose-900/50 text-rose-300", icon: "/icons/difficulty/ruby/ruby2.svg" },
	"루비 i": { style: "bg-rose-900/50 text-rose-300", icon: "/icons/difficulty/ruby/ruby1.svg" },
};

// 가장 긴 키(구체적인 값) 우선으로 매칭
function getDifficultyConfig(difficulty: string) {
	const lower = difficulty.toLowerCase();
	const key = Object.keys(DIFFICULTY_CONFIG)
		.filter((k) => lower.startsWith(k.toLowerCase()))
		.sort((a, b) => b.length - a.length)[0];
	return key ? DIFFICULTY_CONFIG[key] : { style: "bg-zinc-700 text-zinc-300" };
}

// ─── 공통 뱃지 ────────────────────────────────────────────
type BadgeProps = {
	label: string;
	style: string;
	icon?: string;
};

function Badge({ label, style, icon }: BadgeProps) {
	return (
		<span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${style}`}>
			{icon && (
				<Image src={icon} alt={label} width={12} height={12} className="shrink-0" />
			)}
			{label}
		</span>
	);
}

// ─── 공개 컴포넌트 ────────────────────────────────────────
export function PlatformBadge({ platform }: { platform: string }) {
	if (!platform) return null;
	const config = PLATFORM_CONFIG[platform] ?? { style: "bg-zinc-700 text-zinc-300" };
	return <Badge label={platform} style={config.style} icon={config.icon} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
	if (!difficulty) return null;
	const config = getDifficultyConfig(difficulty);
	return <Badge label={difficulty} style={config.style} icon={config.icon} />;
}
