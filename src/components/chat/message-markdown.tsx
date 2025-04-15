import {
    Badge,
    Button,
    Image,
    Tooltip,
    TypographyStylesProvider,
} from '@mantine/core';
import { useMemo, useRef } from 'react';
import { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Markdown } from './markdown.tsx';
import { MessageAnchor } from './message-anchor.tsx';
import { MessageSource } from './message-source.tsx';
import { useChat } from '@ai-sdk/react';
import classes from './message-markdown.module.css';
import { UIMessage } from 'ai';

interface Props {
    markdownOptions?: Options;
    message: UIMessage
}

export function MessageMarkdown({
    markdownOptions: { components, ...options } = {},
    message
}: Props) {
  
    const idPrefixIndexMap = useRef(new Map<string, number>());

    return (
        <TypographyStylesProvider className={classes['message-markdown']}>
            <Markdown
                skipHtml
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ children, ...props }) => {
                        if (props.href?.startsWith('#') && props.id) {
                            if (!props.id.startsWith('user-content-fnref-')) {
                                return null;
                            }
                            const idPrefix = props.href.slice('#user-content-fn-'.length);
                            const index = parseInt(
                                (props.node?.children[0] as { value: string }).value,
                            );
                            idPrefixIndexMap.current.set(idPrefix, index);
                            return (
                                <span style={{ margin: 2 }}>
                                    <Tooltip label="⚠️ Source not found" withArrow withinPortal>
                                        <Badge variant="light" px={6} radius="xl">
                                            ⚠️
                                        </Badge>
                                    </Tooltip>
                                    {/* {qna ? (
                                        <Button
                                            variant="light"
                                            size="compact-xs"
                                            radius="xl"
                                            onClick={() => {
                                                document
                                                    .getElementById(`${qna.shortId}-${idPrefix}`)
                                                    ?.focus();
                                            }}
                                        >
                                            {children}
                                        </Button>
                                    ) : (
                                        <Tooltip label="⚠️ Source not found" withArrow withinPortal>
                                            <Badge variant="light" px={6} radius="xl">
                                                ⚠️
                                            </Badge>
                                        </Tooltip>
                                    )} */}
                                </span>
                            );
                        }
                        return (
                            <MessageAnchor {...props} target="_blank">
                                {children}
                            </MessageAnchor>
                        );
                    },

                    img: ({ ...props }) => {
                        return (
                            <a
                                href={props.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', margin: '0 auto' }}
                            >
                                <Image
                                    radius="md"
                                    mah={200}
                                    maw={250}
                                    alt={props.alt}
                                    src={props.src}
                                />
                            </a>
                        );
                    },
                    h2: ({ children, ...props }) => {
                        if (props.id === 'footnote-label') {
                            return null;
                        }
                        return <h2 {...props}>{children}</h2>;
                    },

                    // li: ({ children, ...props }) => {
                    //     if (props.id?.startsWith('user-content-fn-')) {
                    //         const idPrefix = props.id.slice('user-content-fn-'.length);
                    //         // const qna = qnas.find((s) => s.shortId === idPrefix);
                    //         // if (!qna) {
                    //         //     return null;
                    //         // }
                    //         const index = idPrefixIndexMap.current.get(idPrefix);
                    //         // const htmlId = `${qna.shortId}-${idPrefix}`;
                    //         return (
                    //             <MessageSource
                    //                 key={qna.id}
                    //                 index={index}
                    //                 htmlId={htmlId}
                    //                 title={qna.question}
                    //                 content={qna.answer}
                    //             />
                    //         );
                    //     }
                    //     return <li {...props}>{children}</li>;
                    // },
                    ...components,
                }}
                {...options}
            >
                {[message.content].filter(Boolean).join('\n\n')}
            </Markdown>
        </TypographyStylesProvider>
    );
}
