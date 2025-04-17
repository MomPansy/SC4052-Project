// @ts-nocheck
import { Center, Container, rem, Stack, Text } from '@mantine/core';
import { ChatFooter } from './chat-footer.tsx';
import { MessageAssistant } from './message-assistant.tsx';
import { MessageUser } from './message-user.tsx';
import { useChat } from '@ai-sdk/react';
import { supabaseAnonKey } from 'lib/supabase.ts';
import { useGetAuth } from 'hooks/auth.ts';
import { useQuery } from '@tanstack/react-query';
import { api } from 'lib/api.ts';
import { Message } from '@ai-sdk/ui-utils';

const chatUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat';

export function ChatMain({ chatId }: { chatId: string }) {
  const { data: authData } = useGetAuth()
  const session = authData?.session;
  const token = session?.access_token ?? supabaseAnonKey;
  const { data: initialMessages, error } = useQuery<Message[]>({
    queryKey: ['chat', chatId, session?.user.id],
    enabled: !!chatId && !!session?.user.id,
    queryFn: async () => {
      const response = await api.chat[':chatId'][':userId'].$get({
        'param': {
          chatId: chatId,
          userId: session?.user.id as string,
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch chat data");
      }
      const data = await response.json();
      return data;
    },
    select: (data) => data.map((message) => {
      return {
        ...message,
        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
      } as Message;
    })
  })

  const { messages, handleSubmit, input, setInput, append, status } = useChat({
    id: chatId,
    api: chatUrl,
    headers: {
      apikey: supabaseAnonKey,
      authorization: `Bearer ${token}`,
    },
    body: {
      userId: session?.user.id,
    },
    initialMessages: initialMessages 
  })

  return (
    <div className="flex flex-col h-[100vh]">
      {(!messages || messages.length === 0) ? (
        <Center className="flex-1">
          <Text
            fw='bold'
            c={'black'}
            fz={rem(30)}
            mb='md'
          >
            What can I help you with?
          </Text>
        </Center>
      ) : (
        <div className="flex-1 p-md pb-xl overflow-y-auto">
          <Container>
            <Stack gap="lg">
              {messages?.map((message) => (
                message.role === 'user' ? (
                  <MessageUser key={message.id} message={message} />
                ) : (
                  <MessageAssistant key={message.id} message={message} />
                )
              ))}
            </Stack>
          </Container>
        </div>
      )}
      <div className={messages?.length ? "sticky bottom-0 bg-white" : ""}>
        <ChatFooter input={input} setInput={setInput} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}
