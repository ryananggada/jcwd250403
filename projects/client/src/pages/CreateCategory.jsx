import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

function CreateCategory() {
  const toast = useToast();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, form) => {
    setIsLoading(true);

    try {
      await api.post(`/categories`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'New category is added.',
        isClosable: true,
        duration: 2500,
      });

      form.resetForm();
      navigate('/tenant/categories');
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

  const categorySchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
  });

  const formik = useFormik({
    initialValues: {
      location: '',
    },
    validationSchema: categorySchema,
    onSubmit: handleSubmit,
  });

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Create New Category
        </Text>
        <FormControl
          isInvalid={formik.errors.location && formik.touched.location}
          my="1.5rem"
        >
          <FormLabel>Location</FormLabel>
          <Input
            name="location"
            onChange={formik.handleChange}
            type="text"
            placeholder="Your location"
            {...formik.getFieldProps('location')}
          />
          <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="green"
          maxWidth="156px"
          isLoading={isLoading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default CreateCategory;
