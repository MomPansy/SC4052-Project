import { Card, Stack, Image, Text, Anchor, Box } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Markdown } from './markdown.tsx';

import classes from './message-source.module.css';

dayjs.extend(relativeTime);
dayjs.extend(duration);

interface Props {
  index?: number;
  htmlId: string;
  link?: string;
  image?: string;
  title: string;
  content: string;
}

export function MessageSource({
  index,
  htmlId,
  link,
  image,
  title,
  content,
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <Card
      id={htmlId}
      withBorder
      className={classes.card}
      component={link ? 'a' : 'div'}
      href={link ? link : undefined}
      target={link ? '_blank' : undefined}
      rel={link ? 'noopener noreferrer' : undefined}
      tabIndex={0}
      onClick={() => {
        if (link) {
          return;
        }
        modals.open({
          size: 'xl',
          padding: 'md',
          radius: 'md',
          centered: true,
          overlayProps: { blur: 3 },
          title: (
            <Text fw={600} c="bright">
              {title}
            </Text>
          ),
          children: (
            <Stack>
              <Markdown>{content}</Markdown>
            </Stack>
          ),
        });
      }}
      styles={(theme) => ({
        root: {
          display: 'flex',
          flexDirection: 'row',
          gap: 6,
          padding: 8,
          borderRadius: theme.radius.md,
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            backgroundColor:
              colorScheme === 'light'
                ? theme.colors.gray[1]
                : theme.colors.dark[5],
            textDecoration: 'none !important',
          },
          '&:focus': {
            animation: 'highlight 1s ease-out',
          },
          '@keyframes highlight': {
            '0%': { backgroundColor: theme.colors.yellow[1] },
            '100%': { backgroundColor: 'transparent' },
          },
        },
      })}
    >
      {image && (
        <Image
          src={image}
          alt=""
          styles={{
            root: {
              width: 80,
              padding: 0,
              margin: '0 !important',
              borderRadius: 'var(--mantine-radius-sm)',
            },
          }}
        />
      )}
      {index && (
        <Box
          style={(theme) => ({
            width: '1rem',
            textAlign: 'center',
            fontSize: theme.fontSizes.xs,
            color: theme.colors.dimmed,
            backgroundColor: 'var(--mantine-primary-color-light-hover)',
            borderBottomLeftRadius: theme.radius.sm,
            position: 'absolute',
            top: -2,
            right: 0,
          })}
        >
          {index}
        </Box>
      )}
      <Stack gap="xs">
        {link ? (
          <Anchor size="sm" fw={500} lh={1.3} lineClamp={2}>
            {title}
          </Anchor>
        ) : (
          <Text c="bright" size="sm" fw={500} lh={1.3} lineClamp={2}>
            {title}
          </Text>
        )}
        <Text
          c="dimmed"
          size="xs"
          lineClamp={2}
          styles={{
            root: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            },
          }}
        >
          {content}
        </Text>
      </Stack>
    </Card>
  );
}
