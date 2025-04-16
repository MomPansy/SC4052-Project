
import { Code, Group, ScrollArea, Text, Drawer, ActionIcon, RemoveScroll } from '@mantine/core';
import { LinksGroup } from './links-group.tsx';
import { UserButton } from './user-button.tsx';
import { Logo } from './logo.tsx';
import classes from './expandable-navbar.module.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase.ts';
import { useDisclosure } from '@mantine/hooks';
import { IconLayoutSidebar, IconLayoutSidebarRightCollapse } from '@tabler/icons-react';

export function Sidebar() {
    const [opened, { open, close }] = useDisclosure(true);

    const { data, error, isLoading } = useQuery({
        queryKey: ['chatIds'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('chats')
                .select('id, title')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    const links = data?.map((item) => <LinksGroup key={item.id} link='/chat/$id' params={{id: item.id,}} title={item.title ?? 'This title is broken'} />);

    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                withOverlay={false}
                withinPortal={false}
                zIndex={0}
                trapFocus={false}
                padding={0}
                size={'xs'}
                withCloseButton={false}
                styles={{
                    header: {
                        display: 'none',
                    },
                }}
                shadow={'xs'}
            >
                <nav className={classes.navbar}>
                    <div className={classes.header}>
                        <Group justify="space-between">
                            <ActionIcon
                                variant='subtle'>
                                <IconLayoutSidebarRightCollapse size={30} color={'black'} onClick={close} />
                            </ActionIcon>
                            <Group flex={1} >
                                <Logo style={{ width: 120 }} />
                                {/* <Text>
                                    Project Chatbot
                                </Text> */}
                            </Group>
                            <Code fw={700}>v0.0.0</Code>
                        </Group>
                    </div>

                    <ScrollArea className={classes.links}>
                        <div className={classes.linksInner}>{links}</div>
                    </ScrollArea>

                    <div className={classes.footer}>
                        <UserButton />
                    </div>
                </nav>
            </Drawer>
            <ActionIcon
                pos='fixed'
                top={20}
                left={20}
                size={'xl'}
                variant='subtle'
                onClick={open}
            >
                <IconLayoutSidebar size={30} color={'black'} />
            </ActionIcon>
        </>
    );
}