import Link from "next/link";
import React from "react";
import {
  getHrefFromUrl,
  INITIAL_INDEX,
  LINE_BREAK,
  LIST_PREFIX,
  URL_REGEX,
} from "../../utils/common";

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = INITIAL_INDEX;
  let match: RegExpExecArray | null;

  URL_REGEX.lastIndex = INITIAL_INDEX;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const url = match[0];

    parts.push(
      <Link
        key={match.index}
        href={getHrefFromUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </Link>,
    );

    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function FormattedBody({ text }: { text: string }) {
  const lines = text.split(LINE_BREAK);
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith(LIST_PREFIX)) {
      listItems.push(
        <li key={`li-${i}`}>{renderInline(line.slice(LIST_PREFIX.length))}</li>,
      );
    } else {
      flushList();
      if (line.trim()) {
        elements.push(<p key={`p-${i}`}>{renderInline(line)}</p>);
      }
    }
  }

  flushList();

  return <>{elements}</>;
}
