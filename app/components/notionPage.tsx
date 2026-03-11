"use client";

import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";
import "./notionPage.css";
import type { ExtendedRecordMap } from "notion-types";

interface Props {
    recordMap: ExtendedRecordMap;
}

export default function NotionPage({ recordMap }: Props) {
    return (
        <div className="notion-about">
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={true}
            />
        </div>
    );
}