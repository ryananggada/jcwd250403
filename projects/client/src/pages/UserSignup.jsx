import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
  Image,
  FormErrorMessage,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api';

function UserSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegExp, 'Phone number is not valid'),
    gender: Yup.string().required('Gender is required'),
    birthDate: Yup.date()
      .required('Birthday is required')
      .test('age', 'Must be at least 13 years old', function (value) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 13);
        return value && value <= cutoffDate;
      }),
  });

  const handleSubmit = async (values) => {
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
      gender: '',
      birthDate: new Date(),
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
            isInvalid={formik.errors.phoneNumber && formik.touched.phoneNumber}
          >
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              onChange={formik.handleChange}
              type="text"
              {...formik.getFieldProps('phoneNumber')}
            />
            <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.gender && formik.touched.gender}
          >
            <FormLabel>Gender</FormLabel>
            <Select {...formik.getFieldProps('gender')}>
              <option value="" defaultValue></option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.birthDate}>
            <FormLabel>Birthday</FormLabel>
            <SingleDatepicker
              date={formik.values.birthDate}
              onDateChange={(val) => {
                formik.setFieldValue('birthDate', val);
              }}
              onBlur={() => formik.setFieldTouched('birthDate', true)}
              configs={{ dateFormat: 'd MMM yyyy' }}
            />
            <FormErrorMessage>{formik.errors.birthDate}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.password && formik.touched.password}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                onChange={formik.handleChange}
                type={showPassword ? 'text' : 'password'}
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
          <FormControl
            isInvalid={
              formik.errors.confirmPassword && formik.touched.confirmPassword
            }
          >
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                name="confirmPassword"
                onChange={formik.handleChange}
                type={showConfirmPassword ? 'text' : 'password'}
                {...formik.getFieldProps('confirmPassword')}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Reveal/hide password"
                  icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <Stack spacing={6}>
            <Button
              type="submit"
              colorScheme="teal"
              variant="solid"
              isDisabled={!(formik.isValid && formik.dirty)}
            >
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt="Signup image"
          objectFit="cover"
          src={'/userRegisterImage.jpg'}
        />
      </Flex>
    </Stack>
  );
}

export default UserSignup;
