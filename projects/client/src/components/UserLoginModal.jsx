import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import api from '../api';
import { login } from '../slices/auth';
import { Link } from 'react-router-dom';

function UserLoginModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const toast = useToast();

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

  const handleSubmit = async (values) => {
    try {
      const res = await api.post('/auth/user/login', values);
      const {
        data: { data },
      } = res;
      toast({
        status: 'success',
        title: 'Success',
        description: 'Login successful, happy renting!',
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

      handleClose();
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

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={formik.handleSubmit}>
        <ModalHeader fontWeight="bold" fontSize="2xl">
          Login
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl
            mb={4}
            isInvalid={formik.errors.email && formik.touched.email}
          >
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              onChange={formik.handleChange}
              type="text"
              {...formik.getFieldProps('email')}
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            mb={4}
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
          <Link to="/user/signup">
            <Text color="blue.400">Don't have an account? Sign up here!</Text>
          </Link>
        </ModalBody>

        <ModalFooter>
          <Button type="submit">Login</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UserLoginModal;
