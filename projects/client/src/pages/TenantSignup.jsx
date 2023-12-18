import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Stack,
  Flex,
  Heading,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api';

function TenantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      formik.setFieldValue('ktpCard', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        formik.setFieldValue('preview', e.target.result);
      };
      reader.readAsDataURL(file);
    },
  });

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
    ktpCard: Yup.mixed()
      .required('KTP is required')
      .test(
        'fileType',
        'Invalid file type (must be in JPEG or PNG)',
        (value) => {
          return value && ['image/jpeg', 'image/png'].includes(value.type);
        }
      )
      .test(
        'fileSize',
        'Picture size is too large (must be less than 1MB)',
        (value) => {
          return value && value.size <= 1 * 1024 * 1024;
        }
      ),
  });

  const handleSubmit = async (values, form) => {
    try {
      const formData = new FormData();

      const { name, email, password, phoneNumber, ktpCard } = values;
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phoneNumber', phoneNumber);
      formData.append('ktpCard', ktpCard);

      await api.post('/auth/tenant/signup', values, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        status: 'success',
        title: 'Success',
        description: 'Tenant account successfully created.',
        isClosable: true,
        duration: 7500,
      });
      form.resetForm();
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
      ktpCard: null,
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
          <Heading fontSize="2xl">Sign up as Tenant</Heading>

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
          <FormControl isInvalid={formik.errors.ktpCard}>
            <FormLabel>Upload KTP</FormLabel>
            <Box
              {...getRootProps()}
              p={3}
              h="60"
              borderWidth={1}
              borderColor="gray.300"
              borderStyle="dashed"
              borderRadius="md"
              bg={isDragActive ? 'gray.100' : 'white'}
              cursor="pointer"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Input {...getInputProps()} />
              {formik.values.preview ? (
                <Box>
                  <Image maxH="48" src={formik.values.preview} />
                </Box>
              ) : (
                <>
                  <Text>Drag & drop, or click to upload image</Text>
                  <Text>Max Size 1MB (JPEG and PNG)</Text>
                </>
              )}
            </Box>
            <FormErrorMessage>{formik.errors.ktpCard}</FormErrorMessage>
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
          src={'/tenantRegisterImage.jpg'}
        />
      </Flex>
    </Stack>
  );
}

export default TenantSignup;
