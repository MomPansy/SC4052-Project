import { createFileRoute } from '@tanstack/react-router';
import { ChatMain } from 'components/chat/chat-main';

export const Route = createFileRoute('/chat/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <ChatMain chatId={id}/>
  );
}
