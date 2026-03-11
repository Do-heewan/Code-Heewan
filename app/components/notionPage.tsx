"use client";

import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";
import type { ExtendedRecordMap } from "notion-types";

interface Props {
    recordMap: ExtendedRecordMap;
}

export default function NotionPage({ recordMap }: Props) {
    return (
        <NotionRenderer
            recordMap={recordMap}
            fullPage={false}
            darkMode={true}
        />
    );
}