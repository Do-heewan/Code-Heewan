import Link from "next/link";
import React from "react";
import Particles from "./components/particles";
import { getAboutPage } from "./lib/notion";

import NotionPage from "./components/notionPage";
import { NotionAPI } from "notion-client";

const notion = new NotionAPI();
const recordMap = await notion.getPage(process.env.NOTION_ABOUT_PAGE_ID!);

const navigation = [
  { name: "Blog", href: "/blog" },
  { name: "Algorithms", href: "/algorithms" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export const revalidate = 3600;

export default async function Home() {
  const aboutMarkdown = await getAboutPage();

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-tl from-black via-zinc-600/20 to-black relative overflow-hidden">
        <nav className="my-16 animate-fade-in">
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
          Code-Heewan
        </h1>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="my-16 animate-fade-in" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* About Me Section */}
      <section className="min-h-screen w-full bg-gradient-to-b from-black via-zinc-900 to-black px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl font-display mb-4">
            🖐️ Dev Noh
          </h2>
          <div className="w-full h-px bg-zinc-800 mb-12" />

          {aboutMarkdown ? (
            <article className="prose prose-invert prose-zinc max-w-none">
              {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aboutMarkdown}
              </ReactMarkdown> */}
              <NotionPage recordMap={recordMap} />
            </article>
          ) : (
            <p className="text-zinc-500 text-sm">
              -
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
