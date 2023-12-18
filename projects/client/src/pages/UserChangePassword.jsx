import { useSelector } from 'react-redux';
import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import UserLayout from '../components/UserLayout';
import api from '../api';

function UserChangePassword() {
  const toast = useToast();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required('Old password is required')
      .min(8, 'Old password must be 8 characters or more')
      .matches(
        /[a-z]+/,
        'Old password must have at least a lowercase character'
      )
      .matches(
        /[A-Z]+/,
        'Old password must have at least an uppercase character'
      )
      .matches(
        /\W|_+/,
        'Old password must have at least one special characters'
      )
      .matches(/\d+/, 'Old password must have a number'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'New password must be 8 characters or more')
      .matches(
        /[a-z]+/,
        'New password must have at least a lowercase character'
      )
      .matches(
        /[A-Z]+/,
        'New password must have at least an uppercase character'
      )
      .matches(
        /\W|_+/,
        'New password must have at least one special characters'
      )
      .matches(/\d+/, 'New password must have a number'),
    confirmNewPassword: Yup.string()
      .required('Confirm new password is required')
      .oneOf([Yup.ref('newPassword')], 'Confirm new password does not match'),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await api.put('/auth/user/profile/change-password', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/user/profile');
      toast({
        status: 'success',
        title: 'Success',
        description: `${res.data.message}`,
        isClosable: true,
        duration: 2500,
      });
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
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <UserLayout>
      <Box justify="center" align="center">
        <Stack
          spacing={4}
          w="full"
          maxW="md"
          rounded="xl"
          boxShadow="xl"
          p={6}
          my={12}
          as="form"
          onSubmit={formik.handleSubmit}
        >
          <Text fontWeight="semibold" fontSize={{ base: '2xl', sm: '3xl' }}>
            Change Password
          </Text>

          <FormControl
            isInvalid={formik.errors.oldPassword && formik.touched.oldPassword}
          >
            <FormLabel>Old password</FormLabel>
            <Input
              name="oldPassword"
              type="password"
              onChange={formik.handleChange}
              {...formik.getFieldProps('oldPassword')}
            />
            <FormErrorMessage>{formik.errors.oldPassword}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.newPassword && formik.touched.newPassword}
          >
            <FormLabel>New password</FormLabel>
            <Input
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              {...formik.getFieldProps('newPassword')}
            />
            <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              formik.errors.confirmNewPassword &&
              formik.touched.confirmNewPassword
            }
          >
            <FormLabel>Confirm new password</FormLabel>
            <Input
              name="confirmNewPassword"
              type="password"
              onChange={formik.handleChange}
              {...formik.getFieldProps('confirmNewPassword')}
            />
            <FormErrorMessage>
              {formik.errors.confirmNewPassword}
            </FormErrorMessage>

            <Button
              variant="outline"
              colorScheme="black"
              mt={4}
              type="submit"
              isDisabled={!(formik.isValid && formik.dirty)}
            >
              Save new password
            </Button>
          </FormControl>
        </Stack>
      </Box>
    </UserLayout>
  );
}

export default UserChangePassword;
