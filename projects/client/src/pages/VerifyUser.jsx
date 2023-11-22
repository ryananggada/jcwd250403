import { useState, useEffect } from 'react';
import {
  Flex,
  Stack,
  Center,
  Heading,
  FormControl,
  HStack,
  PinInput,
  PinInputField,
  Button,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function VerifyUser() {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const res = await api.post(`/verify/${id}`, values);
      toast({
        status: 'success',
        title: 'Success',
        description: `${res.data.message}`,
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

  const resendOtp = async () => {
    try {
      const res = await api.get(`/verify/resend/${id}`);
      toast({
        status: 'success',
        title: 'Success',
        description: `${res.data.message}`,
        isClosable: true,
        duration: 7500,
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
      otp: '',
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    api.get(`/auth/user/email/${id}`).then((res) => {
      setEmail(res.data.data.user.email);
    });
  }, [id]);

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Stack
        spacing={4}
        w="full"
        maxW="sm"
        bg="gray.50"
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={10}
        as="form"
        onSubmit={formik.handleSubmit}
      >
        <Center>
          <Heading fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your email
          </Heading>
        </Center>
        <Center fontSize={{ base: 'sm', sm: 'md' }} color="gray.800">
          Check the OTP code in your email
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          fontWeight="bold"
          color="gray.800"
        >
          {email}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput
                value={formik.otp}
                name="otp"
                onChange={(val) => formik.setFieldValue('otp', val)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6} align="end" mt={4}>
          <ButtonGroup>
            <Button colorScheme="yellow" onClick={() => resendOtp()}>
              Resend OTP
            </Button>
            <Button colorScheme="blue" type="submit">
              Verify
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default VerifyUser;
