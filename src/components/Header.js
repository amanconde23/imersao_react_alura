import { Box, Text, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../../config.json';

export default function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          label='Logout'
          href="/"
          styleSheet={{
            color: appConfig.theme.colors.neutrals["000"],
            hover: {
              backgroundColor: appConfig.theme.colors.primary[1000],
            },
          }}
        />
      </Box>
    </>
  )
}