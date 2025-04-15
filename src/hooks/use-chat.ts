import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { callChatApi, type Message, generateId } from "@ai-sdk/ui-utils";
import { useChat } from '@ai-sdk/react'
import {
  QueryKey,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "lib/supabase.ts";

export const ChatContext = createContext<{
  chatId: string;
} | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Missing ChatContext.Provider in the tree");
  }
  return context;
}

export const MessageContext = createContext<{
  index: number;
  isLast: boolean;
  message: Message;
} | null>(null);

export function useMessageContext() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("Missing MessageContext.Provider in the tree");
  }
  return context;
}

function useQueryKey(): QueryKey {
  const { chatId } = useChatContext();
  return useMemo(() => [chatId, "message"], [chatId]);
}

function useMessagesQueryOptions() {
  const { chatId } = useChatContext();
  const queryKey = useQueryKey();

  return queryOptions({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "id, created_at, position, role, content, toolInvocations:tool_invocations, annotations"
        )
        .eq("chat_id", chatId)
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }
      return data as unknown as Message[];
    },
  });
}

export function useMessagesQuery() {
  const messagesQueryOptions = useMessagesQueryOptions();
  return useQuery(messagesQueryOptions);
}

export function useMessagesMutation() {
  const queryClient = useQueryClient();
  const queryKey = useQueryKey();

  const getMessages = useCallback(
    () => queryClient.getQueryData<Message[]>(queryKey) ?? [],
    [queryClient, queryKey]
  );

  const setMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev) =>
        updater(prev ?? [])
      );
    },
    [queryClient, queryKey]
  );

  const { chatId } = useChatContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  useChat
  
}
