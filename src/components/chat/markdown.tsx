import { TypographyStylesProvider } from '@mantine/core';
import ReactMarkdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { MessageAnchor } from './message-anchor.tsx';

export function Markdown({ children, components, ...options }: Options) {
  return (
    <TypographyStylesProvider>
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <MessageAnchor {...props} target="_blank">
              {children}
            </MessageAnchor>
          ),
          ...components,
        }}
        {...options}
      >
        {children}
      </ReactMarkdown>
    </TypographyStylesProvider>
  );
}
