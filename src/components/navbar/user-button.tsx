import { Avatar, Group, Text, UnstyledButton, Menu } from '@mantine/core';
import classes from './user-button.module.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase';

export function UserButton() {
  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error?.message);
      }

      return data.user?.email
    },
  })
  return (
    <UnstyledButton className={classes.user}>
      <Menu
        width={300}
        styles={{
          dropdown: {
            textAlign: 'center',
          },
          item: {
            textAlign: 'center'
          },
        }}
      >
        <Menu.Target>
          <Group>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              radius="xl"
            />
            <Text size="sm" fw={500}>
              {data}
            </Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item
            color={'red'}
            onClick={ () => void supabase.auth.signOut().then(() => {
              window.location.href = '/login';
            })}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

    </UnstyledButton>
  );
}