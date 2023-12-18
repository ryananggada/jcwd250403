import {
  Flex,
  Stack,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await api.post('/auth/user/forgot-password', values);
      toast({
        status: 'success',
        title: 'Success',
        description: `${res.data.message}`,
        isClosable: true,
        duration: 5000,
      });
      navigate('/');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" w="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Forgot password</Heading>
        </Stack>
        <Box
          rounded="lg"
          bg="white"
          boxShadow="lg"
          p={8}
          as="form"
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={4}>
            <FormControl
              id="email"
              isInvalid={formik.errors.email && formik.touched.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                onChange={formik.handleChange}
                {...formik.getFieldProps('email')}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              isDisabled={!(formik.isValid && formik.dirty)}
              variant="outline"
              colorScheme="black"
              mt={4}
            >
              Send reset link
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword;
