import { useState } from 'react';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { Link, LinkOptions } from '@tanstack/react-router';
import classes from './links-group.module.css';

interface LinksGroupProps {
  title: string;
  params: LinkOptions['params'];
  initiallyOpened?: boolean;
  link: LinkOptions['to'];
}

export function LinksGroup({ title, params, initiallyOpened, link }: LinksGroupProps) {
  const [opened, setOpened] = useState(initiallyOpened || false);

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Link
          to={link}
          params={params}
          className={classes.link} 
        >
          {title}
        </Link>
      </UnstyledButton>
    </>
  );
}
