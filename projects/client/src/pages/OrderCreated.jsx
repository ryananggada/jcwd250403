import React from 'react';
import { Center, Box, Stack, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';

function OrderCreated() {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <Center>
        <Box boxShadow="lg" p={6} borderRadius="md" bg="gray.50">
          <Stack alignItems="center" textAlign="center">
            <Heading>Your order has been created!</Heading>
            <Text my={6}>
              Go to your order list and pay within 2 hours, or your order will
              be automatically cancelled.
            </Text>

            <Button
              colorScheme="blue"
              minW="240px"
              my={2}
              onClick={() => navigate('/user/orders')}
            >
              View your orders
            </Button>
            <Button
              colorScheme="black"
              variant="outline"
              minW="240px"
              onClick={() => navigate('/')}
            >
              Back to home
            </Button>
          </Stack>
        </Box>
      </Center>
    </UserLayout>
  );
}

export default OrderCreated;
