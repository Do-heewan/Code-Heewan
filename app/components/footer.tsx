import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const navigation = [
    { name: "Blog", href: "/blog" },
    { name: "Algorithms", href: "/algorithms" },
    { name: "Projects", href: "/projects" },
];

const socials = [
    {
        name: "GitHub",
        href: "https://github.com/Do-heewan",
        icon: Github,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/%EC%99%84-%ED%9D%AC-9263a735b/",
        icon: Linkedin,
    },
    {
        name: "Email",
        href: "mailto:nhw3152@gmail.com",
        icon: Mail,
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-800/80 bg-black/95">
            {/* <div className="mx-auto grid max-w-7xl gap-5 py-4 lg:grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr] lg:px-8">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                            Code-Heewan
                        </p>
                        <h2 className="mt-3 font-display text-2xl text-zinc-100 sm:text-3xl">
                            Building, learning, and documenting.
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-7 text-zinc-400">
                        개발 과정에서 만든 것들, 배운 것들, 다시 참고할 기록들을
                        정리하는 개인 공간입니다.
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-zinc-200">Explore</p>
                    <nav className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors duration-200 hover:text-zinc-100"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <p className="text-sm font-medium text-zinc-200">Contact</p>
                    <nav className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors duration-200 hover:text-zinc-100"
                            >

                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <p className="text-sm font-medium text-zinc-200">PORTFOLIO</p>
                    <nav className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                        <Link
                            key="Projects"
                            href="/projects"
                            className="transition-colors duration-200 hover:text-zinc-100"
                        >Projects
                        </Link>
                    </nav>
                </div>

                <div>
                    <p className="text-sm font-medium text-zinc-200">SOCIAL</p>
                    <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                        {socials.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-3 transition-colors duration-200 hover:text-zinc-100"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div> 
        */}

            <div className="border-t border-zinc-800/80">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <p>© {currentYear} Code-Heewan.</p>
                    <div className="mt-4 flex flex-row gap-3 text-sm text-zinc-400">{socials.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="inline-flex items-center transition-colors duration-200 hover:text-zinc-100 gap-1"
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}</div>
                </div>
            </div>
        </footer >
    );
}
