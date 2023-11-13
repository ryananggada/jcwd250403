import React from 'react';
import { Center, Text, VStack } from '@chakra-ui/react';

function NotFound() {
  return (
    <Center h="100vh">
      <VStack>
        <Text fontSize="9xl" fontWeight="bold">
          404
        </Text>
        <Text fontSize="lg">Sorry, page not found!</Text>
      </VStack>
    </Center>
  );
}

export default NotFound;
