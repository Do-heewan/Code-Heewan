"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
// @ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
// @ts-ignore
import bash from "react-syntax-highlighter/dist/cjs/languages/hljs/bash";
// @ts-ignore
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
// @ts-ignore
import typescript from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript";
// @ts-ignore
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
// @ts-ignore
import java from "react-syntax-highlighter/dist/cjs/languages/hljs/java";
// @ts-ignore
import cpp from "react-syntax-highlighter/dist/cjs/languages/hljs/cpp";
// @ts-ignore
import csharp from "react-syntax-highlighter/dist/cjs/languages/hljs/csharp";
// @ts-ignore
import sql from "react-syntax-highlighter/dist/cjs/languages/hljs/sql";
// @ts-ignore
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
// @ts-ignore
import plaintext from "react-syntax-highlighter/dist/cjs/languages/hljs/plaintext";
// @ts-ignore
import kotlin from "react-syntax-highlighter/dist/cjs/languages/hljs/kotlin";
// @ts-ignore
import go from "react-syntax-highlighter/dist/cjs/languages/hljs/go";
// @ts-ignore
import rust from "react-syntax-highlighter/dist/cjs/languages/hljs/rust";
// @ts-ignore
import xml from "react-syntax-highlighter/dist/cjs/languages/hljs/xml";
// @ts-ignore
import css from "react-syntax-highlighter/dist/cjs/languages/hljs/css";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("c#", csharp);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("plaintext", plaintext);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("css", css);

const REGISTERED_LANGUAGES = new Set([
	"bash", "shell", "javascript", "js", "typescript", "ts",
	"python", "py", "java", "cpp", "c++", "csharp", "c#",
	"sql", "json", "plaintext", "kotlin", "go", "rust", "xml", "html", "css",
]);

const LANGUAGE_MAP: Record<string, string> = {
	"plain text": "plaintext",
	plain_text: "plaintext",
	sh: "bash",
	zsh: "bash",
	text: "plaintext",
};

export function BlogContent({ markdown }: { markdown: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex]}
			components={{
				// pre를 div로 교체해서 내부 div(SyntaxHighlighter) 중첩 문제 해결
				pre({ children }: any) {
					return <div className="not-prose my-4">{children}</div>;
				},
				code({ className, children, node, ...props }: any) {
					const codeContent = String(children).replace(/\n$/, "");
					const isBlock = node?.position?.start?.line !== node?.position?.end?.line || className;

					// block code: className이 있거나 멀티라인인 경우
					if (isBlock && (className || codeContent.includes("\n"))) {
						const rawLang = className
							? (className as string).replace("language-", "")
							: "";
						const mapped = LANGUAGE_MAP[rawLang] ?? rawLang;
						const language = REGISTERED_LANGUAGES.has(mapped) ? mapped : "plaintext";
						return (
							<SyntaxHighlighter style={atomOneDark} language={language} PreTag="div">
								{codeContent}
							</SyntaxHighlighter>
						);
					}

					// inline code
					return (
						<code
							className="rounded bg-zinc-700 px-[0.3rem] py-[0.15rem] font-mono text-sm text-red-500"
							{...props}
						>
							{children}
						</code>
					);
				},
			}}
		>
			{markdown}
		</ReactMarkdown>
	);
}
