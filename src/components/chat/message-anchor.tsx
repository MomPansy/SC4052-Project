import { Anchor } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  children: React.ReactNode;
}

export function MessageAnchor({ className, ...props }: Props) {
  return (
    <Anchor rel="noopener noreferrer" {...props}>
      {props.children}
      {props.target === '_blank' && (
        <IconExternalLink
          style={{
            display: 'inline',
            width: '0.8em',
            height: '0.8em',
            marginLeft: '0.25em',
            marginTop: '-0.5em',
          }}
          stroke={1.75}
        />
      )}
    </Anchor>
  );
}
