import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Button,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';

function TenantLogin() {
  const handleSubmit = async (values, form) => {};

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" w="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Login as tenant</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Text color="blue.400">Forgot password?</Text>
              <Button colorScheme="blue">Sign in</Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default TenantLogin;
