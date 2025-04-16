import { createFileRoute, redirect } from '@tanstack/react-router'
import { accessTokenQueryOptions } from 'hooks/auth.ts'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({
  async beforeLoad({ context: { queryClient } }) {
    try {
      await queryClient.ensureQueryData(accessTokenQueryOptions);
    } catch (_error) {
      throw redirect({ to: '/login' });
    }
    const uuid = uuidv4();
    throw redirect({
      to: `/chat/$id`,
      params: { id: uuid },
    });
  },
});
