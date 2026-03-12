"use client";

import React, { useEffect, useRef } from "react";

interface HeroTitleProps {
    children: React.ReactNode;
}

export default function HeroTitle({ children }: HeroTitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = html.style.overflow;

        body.style.overflow = "hidden";
        html.style.overflow = "hidden";

        let unlocked = false;
        const unlockScroll = () => {
            if (unlocked) return;
            unlocked = true;
            body.style.overflow = previousBodyOverflow;
            html.style.overflow = previousHtmlOverflow;
        };

        const handleAnimationEnd = () => unlockScroll();
        titleRef.current?.addEventListener("animationend", handleAnimationEnd, {
            once: true,
        });

        // Fallback for cases where animation events do not fire.
        const fallbackTimer = window.setTimeout(unlockScroll, 1800);

        return () => {
            window.clearTimeout(fallbackTimer);
            titleRef.current?.removeEventListener("animationend", handleAnimationEnd);
            unlockScroll();
        };
    }, []);

    return (
        <h1
            ref={titleRef}
            className="relative z-10 py-3.5 px-0.5 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text"
        >
            {children}
        </h1>
    );
}