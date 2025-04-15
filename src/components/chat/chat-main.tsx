import { Container, Stack } from '@mantine/core';

import { ChatFooter } from './chat-footer.tsx';

import { MessageAssistant } from './message-assistant.tsx';
import { MessageUser } from './message-user.tsx';
import { useChat } from '@ai-sdk/react';
import { useEffect, useMemo } from 'react';

const chatUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat';

export function ChatMain() {
  const { messages, handleSubmit, input, setInput, append, status } = useChat({
    id: '3',
    api: chatUrl,
  })

  useEffect(() => {
    console.log(messages)
  }, [messages])
  return (
    <>
      <div className="flex-1 p-md pb-xl">
        <Container>
          <Stack gap="lg">
            {messages?.map((message, index) => {
              const key = message.id
              return (
                message.role === 'user' ? (
                  <MessageUser message={message} />
                ) : (
                  <MessageAssistant message={message} />
                )
              );
            })}
          </Stack>
        </Container>
      </div>
      <ChatFooter input={input} setInput={setInput} handleSubmit={handleSubmit} />
    </>
  );
}
