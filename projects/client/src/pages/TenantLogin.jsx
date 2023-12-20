import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api';
import { login } from '../slices/auth';

function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be 8 characters or more')
      .matches(/[a-z]+/, 'Password must have at least a lowercase character')
      .matches(/[A-Z]+/, 'Password must have at least an uppercase character')
      .matches(/\W|_+/, 'Password must have at least one special characters')
      .matches(/\d+/, 'Password must have a number'),
  });

  const handleSubmit = async (values, form) => {
    try {
      const res = await api.post('/auth/tenant/login', values);
      const {
        data: { data },
      } = res;
      toast({
        status: 'success',
        title: 'Success',
        description: 'Login successful, enjoy opening properties!',
        isClosable: true,
        duration: 5000,
      });

      dispatch(
        login({
          profile: {
            id: data.payload.id,
            name: data.payload.name,
            role: data.payload.role,
          },
          token: data.token,
        })
      );
      form.resetForm();
      navigate('/tenant');
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
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" w="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Login as tenant</Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Stack spacing={4} as="form" onSubmit={formik.handleSubmit}>
            <FormControl
              id="email"
              isInvalid={formik.errors.email && formik.touched.email}
            >
              <FormLabel>Email address</FormLabel>
              <Input
                name="email"
                type="email"
                onChange={formik.handleChange}
                {...formik.getFieldProps('email')}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isInvalid={formik.errors.password && formik.touched.password}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  {...formik.getFieldProps('password')}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Reveal/hide password"
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Stack spacing={5}>
              <Link to="/tenant/signup">
                <Text as="u" color="blue.400">
                  Don't have an account? Create here
                </Text>
              </Link>
              <Button
                type="submit"
                isDisabled={!(formik.isValid && formik.dirty)}
                colorScheme="blue"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default TenantLogin;
