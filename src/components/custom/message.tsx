'use client';

import { Attachment, ToolInvocation } from 'ai';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ReactNode, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

import { Markdown } from './markdown';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';

// Color theme configuration for different content types
const semanticColors = {
  title: "text-blue-700 dark:text-blue-400 font-semibold text-xl",
  subtitle: "text-purple-700 dark:text-purple-400 font-medium text-lg",
  caseTitle: "text-blue-700 dark:text-blue-400 font-semibold",
  legalPrinciple: "text-emerald-700 dark:text-emerald-400",
  citation: "text-purple-700 dark:text-purple-400 italic",
  conclusion: "text-rose-700 dark:text-rose-400 font-medium",
  warning: "text-amber-700 dark:text-amber-400",
  emphasis: "text-indigo-700 dark:text-indigo-400",
  procedural: "text-cyan-700 dark:text-cyan-400",
  evidence: "text-teal-700 dark:text-teal-400",
  statute: "text-violet-700 dark:text-violet-400",
  default: "text-gray-900 dark:text-gray-100"
};

const legalPatterns = [
  {
    regex: /^#\s+(.+?)$/gm,
    className: semanticColors.title,
    removeMarker: true
  },
  {
    regex: /^#{2,}\s+(.+?)$/gm,
    className: semanticColors.subtitle,
    removeMarker: true
  },
  {
    regex: /(?:^|\n)(?:CASE:|IN THE MATTER OF:|SUIT NO:|APPEAL NO:)(.+?)(?:\n|$)/gi,
    className: semanticColors.caseTitle,
  },
  {
    regex: /(?:^|\n)(?:PRINCIPLE:|LEGAL PRINCIPLE:|RATIO:|RATIO DECIDENDI:)(.+?)(?:\n|$)/gi,
    className: semanticColors.legalPrinciple,
  },
  {
    regex: /\[([^\]]+)\]|\(([^\)]+)\)/g, // Citations in square brackets or parentheses
    className: semanticColors.citation,
  },
  {
    regex: /(?:^|\n)(?:CONCLUSION:|JUDGMENT:|HOLDING:|ORDER:|DECISION:)(.+?)(?:\n|$)/gi,
    className: semanticColors.conclusion,
  },
  {
    regex: /(?:^|\n)(?:WARNING:|IMPORTANT:|NOTE:|CAVEAT:|DISCLAIMER:)(.+?)(?:\n|$)/gi,
    className: semanticColors.warning,
  },
  {
    regex: /(?:^|\n)(?:PROCEDURE:|PROCEEDINGS:|TIMELINE:)(.+?)(?:\n|$)/gi,
    className: semanticColors.procedural,
  },
  {
    regex: /(?:^|\n)(?:EVIDENCE:|EXHIBITS:|PROOF:)(.+?)(?:\n|$)/gi,
    className: semanticColors.evidence,
  },
  {
    regex: /(?:^|\n)(?:STATUTE:|SECTION:|LAW:|ACT:)(.+?)(?:\n|$)/gi,
    className: semanticColors.statute,
  },
  {
    regex: /\*\*(.+?)\*\*/g, // Text between double asterisks
    className: semanticColors.emphasis,
  }
];

const colorizeText = (text: string) => {
  if (!text) return null;

  // Split text into lines while preserving empty lines
  const lines = text.split(/\n/);
  const processedLines = lines.map((line, index) => {
    if (!line.trim()) {
      return <div key={index} className="h-4" />; // Empty line spacing
    }

    let processedLine = line;
    let hasMatch = false;
    let className = semanticColors.default;

    // Apply patterns in order of specificity
    for (const { regex, className: patternClass, removeMarker } of legalPatterns) {
      const matches = Array.from(line.matchAll(new RegExp(regex)));
      if (matches.length > 0) {
        hasMatch = true;
        matches.forEach(match => {
          const content = match[1] || match[0];
          // Remove the markdown markers if removeMarker is true
          processedLine = removeMarker 
            ? content 
            : processedLine.replace(match[0], `<span class="${patternClass}">${content}</span>`);
        });
        className = patternClass;
      }
    }

    // Handle markdown-style formatting within colored text
    processedLine = processedLine
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>');

    return (
      <div 
        key={index}
        className={`${hasMatch ? '' : className} leading-relaxed py-1`}
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
  });

  return <div className="space-y-1">{processedLines}</div>;
};

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const colorizedContent = useMemo(() => {
    if (typeof content === 'string' && role === 'assistant') {
      return colorizeText(content);
    }
    return content;
  }, [content, role]);

  const components: Components = {
    pre: ({ node, ...props }) => (
      <pre
        {...props}
        className="overflow-x-auto w-full max-w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 my-4"
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => (
      <code
        {...props}
        className={`${
          inline 
            ? 'px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm' 
            : 'block w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto'
        } font-mono`}
      >
        {children}
      </code>
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
      />
    ),
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table
          {...props}
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-800"
        />
      </div>
    ),
    th: ({ node, ...props }) => (
      <th
        {...props}
        className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      />
    ),
    td: ({ node, ...props }) => (
      <td
        {...props}
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
      />
    ),
  };

  return (
    <motion.div
      className="w-full max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-role={role}
    >
      <div className={`flex gap-4 rounded-xl ${
        role === 'user' 
          ? 'px-5 w-fit ml-auto py-3.5 bg-muted' 
          : 'w-full'
      }`}>
        {role === 'assistant' && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border 
            bg-gradient-to-br from-blue-500 to-purple-500">
            <Sparkles className="size-4 text-white" />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full overflow-x-auto">
          {content && (
            <div className="flex flex-col gap-4 w-full">
              {typeof content === 'string' ? (
                role === 'assistant' ? (
                  colorizedContent
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  >
                    {content}
                  </ReactMarkdown>
                )
              ) : (
                content
              )}
            </div>
          )}

          {toolInvocations && toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : null}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId} className="skeleton">
                      {toolName === 'getWeather' ? <Weather /> : null}
                    </div>
                  );
                }
              })}
            </div>
          )}

          {attachments && (
            <div className="flex flex-row gap-2">
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;






//old code with no code highlighting
/* 'use client';

import { Attachment, ToolInvocation } from 'ai';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

import { Markdown } from './markdown';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const components: Components = {
    pre: ({ node, ...props }) => (
      <pre {...props} className="overflow-x-auto w-full max-w-full" />
    ),
    code: ({ node, inline, className, children, ...props }: any) => (
      <code
        {...props}
        className={`${inline ? 'inline-code' : 'block w-full p-4 bg-muted/50 rounded-lg overflow-x-auto'}`}
      >
        {children}
      </code>
    ),
  };

  return (
    <motion.div
      className="w-full max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div className="flex gap-4 group-data-[role=user]/message:px-5 w-fit min-w-0 group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:py-3.5 group-data-[role=user]/message:bg-muted rounded-xl">
        {role === 'assistant' && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <Sparkles className="size-4" />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full overflow-x-auto">
          {content && (
            <div className="flex flex-col gap-4 w-full">
              {typeof content === 'string' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                content
              )}
            </div>
          )}

          {toolInvocations && toolInvocations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : null}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId} className="skeleton">
                      {toolName === 'getWeather' ? <Weather /> : null}
                    </div>
                  );
                }
              })}
            </div>
          ) : null}

          {attachments && (
            <div className="flex flex-row gap-2">
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};



 */










