import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function UserSignup() {
  const toast = useToast();
  const navigate = useNavigate();

  const signupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
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
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Confirm password does not match'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  const handleSubmit = async (values, form) => {
    try {
      await api.post('/auth/user/signup', values);
      toast({
        status: 'success',
        title: 'Success',
        description: 'Account created, please check your email to verify.',
        isClosable: true,
        duration: 7500,
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
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
    validationSchema: signupSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack
          spacing={4}
          w="full"
          maxW="md"
          as="form"
          onSubmit={formik.handleSubmit}
        >
          <Heading fontSize="2xl">Sign up</Heading>

          <FormControl isInvalid={formik.errors.name && formik.touched.name}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              onChange={formik.handleChange}
              type="text"
              {...formik.getFieldProps('name')}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.email && formik.touched.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              onChange={formik.handleChange}
              type="email"
              {...formik.getFieldProps('email')}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.password && formik.touched.password}
          >
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              onChange={formik.handleChange}
              type="password"
              {...formik.getFieldProps('password')}
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              formik.errors.confirmPassword && formik.touched.confirmPassword
            }
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name="confirmPassword"
              onChange={formik.handleChange}
              type="password"
              {...formik.getFieldProps('confirmPassword')}
            />
            <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={formik.errors.phoneNumber && formik.touched.phoneNumber}
          >
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              onChange={formik.handleChange}
              type="text"
              placeholder="Your Phone Number"
              {...formik.getFieldProps('phoneNumber')}
            />
            <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
          </FormControl>

          <Stack spacing={6}>
            <Button type="submit" colorScheme="teal" variant="solid">
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt="Signup image"
          objectFit="cover"
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}

export default UserSignup;
