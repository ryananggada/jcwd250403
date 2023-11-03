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
import axios from 'axios';
import TenantLayout from '../components/TenantLayout';

function CreateCategory() {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values, form) => {
    try {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/categories`, values)
        .then((res) => {
          toast({
            status: 'success',
            title: 'Success',
            description: 'New category is added.',
            isClosable: true,
            duration: 2500,
          });

          form.resetForm();
          navigate('/categories');
        });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `Something went wrong: ${error.message}`,
        isClosable: true,
        duration: 2500,
      });
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

        <Button type="submit" colorScheme="green">
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default CreateCategory;
