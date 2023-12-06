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
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

function ResetPassword() {
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const resetPasswordSchema = Yup.object().shape({
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
      const res = await api.put(`/auth/user/reset-password/${token}`, values);
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
      newPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" w="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Reset password</Heading>
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
              id="newPassword"
              isInvalid={
                formik.errors.newPassword && formik.touched.newPassword
              }
            >
              <FormLabel>New Password</FormLabel>
              <Input
                name="newPassword"
                type="password"
                onChange={formik.handleChange}
                {...formik.getFieldProps('newPassword')}
              />
              <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
            </FormControl>

            <FormControl
              id="confirmNewPassword"
              isInvalid={
                formik.errors.confirmNewPassword &&
                formik.touched.confirmNewPassword
              }
            >
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                name="confirmNewPassword"
                type="password"
                onChange={formik.handleChange}
                {...formik.getFieldProps('confirmNewPassword')}
              />
              <FormErrorMessage>
                {formik.errors.confirmNewPassword}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              isDisabled={!(formik.isValid && formik.dirty)}
              variant="outline"
              colorScheme="black"
              mt={4}
            >
              Reset password
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ResetPassword;
