import { useChat } from '@ai-sdk/react';
import { Avatar, Card, Group } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { UIMessage } from 'ai';

interface Props {
  message: UIMessage
}

export function MessageUser({ message }: Props) {
  return (
    <Group pos="relative" align="flex-start">
      <Avatar color="green" className="sticky top-[60px]">
        <IconUser stroke={1.75} />
      </Avatar>
      <Card
        withBorder
        radius="lg"
        className="w-full flex-1 whitespace-pre-wrap p-xs"
      >
        {message.content}
      </Card>
    </Group>
  );
}
