import React from 'react';
import { Center, Text, VStack } from '@chakra-ui/react';
import UserLayout from '../components/UserLayout';

function NotFound() {
  return (
    <UserLayout>
      <Center>
        <VStack>
          <Text fontSize="9xl" fontWeight="bold">
            404
          </Text>
          <Text fontSize="lg">Sorry, page not found!</Text>
        </VStack>
      </Center>
    </UserLayout>
  );
}

export default NotFound;
