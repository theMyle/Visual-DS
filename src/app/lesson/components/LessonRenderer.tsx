"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Heading from "./Heading";
import TableSection from "./TableSection";
import VideoEmbed from "./VideoEmbed";
import VisualImage from "./VisualImage";
import ListSection from "./ListSection";
import Callout from "./Callout";
import Highlight from "./Highlight";
import TextLink from "./TextLink";
import { SECTION_CLASS } from "./constants";

interface LessonRendererProps {
  content: string;
}

export default function LessonRenderer({ content }: LessonRendererProps) {
  return (
    <div className="flex flex-col">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <div className="mt-2 mb-8">
              <Heading as="h1" size="lg">{children}</Heading>
            </div>
          ),
          h2: ({ children }) => (
            <div className="mt-8 mb-6">
              <Heading as="h2" size="md">{children}</Heading>
            </div>
          ),
          h3: ({ children }) => (
            <div className="mt-6 mb-4">
              <Heading as="h3" size="sm">{children}</Heading>
            </div>
          ),
          p: ({ children }) => <div className="leading-relaxed mb-6">{children}</div>,
          blockquote: ({ children }) => {
            // Recursive helper to extract all text content from an element tree
            const getTextContent = (node: any): string => {
              if (typeof node === 'string') return node;
              if (Array.isArray(node)) return node.map(getTextContent).join("");
              if (node?.props?.children) return getTextContent(node.props.children);
              return "";
            };

            const fullText = getTextContent(children).trim();
            const match = fullText.match(/^\[(info|warning|success|tip|danger)\]/i);

            if (match) {
              const variant = match[1].toLowerCase() as any;

              // Recursive helper to remove the tag from the tree
              const removeTagFromTree = (node: any): any => {
                if (typeof node === 'string') {
                  return node.trimStart().replace(/^\[(info|warning|success|tip|danger)\]\s*/i, "");
                }

                if (Array.isArray(node)) {
                  let found = false;
                  return node.map(c => {
                    if (!found) {
                      const text = getTextContent(c);
                      if (text.trim().match(/^\[(info|warning|success|tip|danger)\]/i)) {
                        found = true;
                        if (typeof c === 'string') {
                          return c.trimStart().replace(/^\[(info|warning|success|tip|danger)\]\s*/i, "");
                        }
                        if (c?.props?.children) {
                          return React.cloneElement(c, { children: removeTagFromTree(c.props.children) });
                        }
                      }
                    }
                    return c;
                  });
                }

                if (node?.props?.children) {
                  return React.cloneElement(node, { children: removeTagFromTree(node.props.children) });
                }

                return node;
              };

              return <Callout variant={variant}>{removeTagFromTree(children)}</Callout>;
            }

            return (
              <blockquote className="border-l-4 border-slate-200 pl-6 italic text-slate-600 my-4 bg-slate-50/50 py-4 rounded-r-lg [&>*:last-child]:mb-0">
                {children}
              </blockquote>
            );
          },
          a: ({ href, children }) => (
            <TextLink href={href || "#"}>{children}</TextLink>
          ),
          ul: ({ children }) => <ListSection ordered={false}>{children}</ListSection>,
          ol: ({ children }) => <ListSection ordered={true}>{children}</ListSection>,
          li: ({ children }) => <li>{children}</li>,
          img: ({ src, alt }) => {
            if (!src) return null;

            // Check if it's actually a video (custom convention for markdown migration)
            if (src.endsWith(".mp4") || src.endsWith(".webm") || src.includes("youtube.com") || src.includes("storage.googleapis.com")) {
              return (
                <div className="my-10">
                  <VideoEmbed embedUrl={src} title={alt} />
                </div>
              );
            }

            return <VisualImage src={src} alt={alt || ""} />;
          },
          table: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const thead = childrenArray.find((c: any) => c.type === "thead") as any;
            const tbody = childrenArray.find((c: any) => c.type === "tbody") as any;

            let headers: string[] = [];
            if (thead) {
              const tr = React.Children.toArray(thead.props.children).find((c: any) => c.type === "tr") as any;
              if (tr && tr.props.children) {
                headers = React.Children.toArray(tr.props.children)
                  .map((th: any) => {
                    const content = th.props?.children;
                    if (Array.isArray(content)) return content.join("");
                    return content?.toString() || "";
                  });
              }
            }

            let rows: React.ReactNode[][] = [];
            if (tbody) {
              const trs = React.Children.toArray(tbody.props.children).filter((c: any) => c.type === "tr") as any[];
              rows = trs.map(tr =>
                React.Children.toArray(tr.props.children)
                  .filter((c: any) => c.type === "td")
                  .map((td: any) => td.props?.children)
              );
            }

            return <TableSection headers={headers} rows={rows} />;
          },
          code: ({ inline, children, className, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = inline || !match;

            if (isInline) {
              return (
                <Highlight variant="accent" appearance="pill" subtle={true}>
                  <code className="font-mono text-[0.9em]" {...props}>
                    {children}
                  </code>
                </Highlight>
              );
            }
            return (
              <pre className="bg-slate-50 p-6 rounded-xl overflow-x-auto border border-slate-200 my-10 w-full shadow-sm">
                <code className={className} {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
