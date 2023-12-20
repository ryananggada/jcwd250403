import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Center,
  Avatar,
  Button,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import UserLayout from '../components/UserLayout';

function EditUserProfile() {
  const toast = useToast();
  const navigate = useNavigate();

  const profilePictureRef = useRef(null);

  const token = useSelector((state) => state.auth.token);

  const [isLoading, setIsLoading] = useState(false);

  const profileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Email is in invalid format')
      .required('Email is reequired'),
    gender: Yup.string().required('Gender is required'),
    birthDate: Yup.date()
      .required('Birthday is required')
      .test('age', 'Must be at least 13 years old', function (value) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 13);
        return value && value <= cutoffDate;
      }),
  });

  const handleUploadProfilePicture = async (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      const formData = new FormData();
      formData.append('profilePicture', files[0]);

      try {
        await api.post('/auth/user/profile/upload/profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        toast({
          status: 'success',
          title: 'Success',
          description: 'Your profile picture successfully updated',
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
    }
  };

  const handleSubmit = async (values, form) => {
    setIsLoading(true);
    try {
      await api.put('/auth/user/profile', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'User profile successfully editted.',
        isClosable: true,
        duration: 2500,
      });
      form.resetForm();
      navigate('/user/profile');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {},
    enableReintialize: true,
    validationSchema: profileSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: {
          data: { user },
        },
      } = await api.get(`/auth/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      formik.setValues({
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthDate: new Date(user.birthDate),
        profilePicture: `${process.env.REACT_APP_IMAGE_LINK}/${user.profilePicture}`,
      });
    };

    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <UserLayout>
      <Box justify="center" align="center">
        <Stack
          spacing={4}
          w="full"
          maxW="md"
          rounded="xl"
          boxShadow="lg"
          p={6}
          my={12}
          as="form"
          onSubmit={formik.handleSubmit}
        >
          <Text fontWeight="semibold" fontSize={{ base: '2xl', sm: '3xl' }}>
            Edit User Profile
          </Text>
          <FormControl>
            <FormLabel>Profile Picture</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={formik.values.profilePicture} />
              </Center>
              <Center w="full">
                <Input
                  ref={profilePictureRef}
                  name="profilePicture"
                  display="none"
                  onChange={(e) => handleUploadProfilePicture(e)}
                  type="file"
                />
                <Button
                  w="full"
                  onClick={() => profilePictureRef.current.click()}
                >
                  Change Picture
                </Button>
              </Center>
            </Stack>
          </FormControl>

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

          <FormControl
            isInvalid={formik.errors.gender && formik.touched.gender}
          >
            <FormLabel>Gender</FormLabel>
            <Select {...formik.getFieldProps('gender')}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
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

          <Button
            type="submit"
            isDisabled={!(formik.isValid && formik.dirty)}
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Save changes
          </Button>
        </Stack>
      </Box>
    </UserLayout>
  );
}

export default EditUserProfile;
