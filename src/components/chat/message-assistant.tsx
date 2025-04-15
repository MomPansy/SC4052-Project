import {
  Accordion,
  Avatar,
  Card,
  Group,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconRobot } from '@tabler/icons-react';

// import { MessageCollectContacts } from 'components/message-collect-contacts.tsx';
import { MessageMarkdown } from './message-markdown.tsx';
// import { MessageSearchQna } from 'components/message-search-qna.tsx';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';

interface Props {
  message: UIMessage
}

export function MessageAssistant({ message }: Props) {
  const theme = useMantineTheme();
  const toolInvocations = message?.parts.filter((part) => part.type === 'tool-invocation')
  return (
    <Group pos="relative" align="flex-start" wrap="nowrap">
      <Avatar
        color={theme.colors[theme.primaryColor][4]}
        className="sticky top-[60px]"
      >
        <IconRobot stroke={1.75} />
      </Avatar>
      <Stack w="100%" gap="xs">
        <Card
          withBorder
          radius="lg"
          className="w-full flex-1 bg-default-hover p-xs"
        >
          {message.content && <MessageMarkdown message={message} />}
          {(toolInvocations.length ?? 0) > 0 && (
            <Card.Section>
              <Accordion
                multiple
                defaultValue={toolInvocations.map(({ toolInvocation }) =>
                  toolInvocation.toolCallId
                )}
                classNames={{
                  control: 'pt-[2px]',
                }}
              >
                {/* {toolInvocations?.map(({toolInvocation}) => {
                  if (toolInvocation.toolName === 'searchQnas') {
                    return (
                      <MessageSearchQna
                        key={toolInvocation.toolCallId}
                        toolInvocation={toolInvocation}
                      />
                    );
                  } else if (toolInvocation.toolName === 'collectContacts') {
                    return (
                      <MessageCollectContacts
                        key={toolInvocation.toolCallId}
                        toolInvocation={toolInvocation}
                      />
                    );
                  }
                })} */}
              </Accordion>
            </Card.Section>
          )}
        </Card>
      </Stack>
    </Group>
  );
}
