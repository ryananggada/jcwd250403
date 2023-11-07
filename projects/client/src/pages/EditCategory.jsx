import { useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

function EditCategory() {
  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values, form) => {
    try {
      api.put(`/categories/${id}`, values).then((res) => {
        toast({
          status: 'success',
          title: 'Success',
          description: 'Category has changed.',
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

  useEffect(() => {
    const fetchCategory = async (formik) => {
      const response = await api.get(`/categories/${id}`);
      const { data } = response;

      formik.setValues({
        location: data.data.location,
      });
    };

    fetchCategory(formik);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Edit Category
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

        <Button type="submit" colorScheme="green" maxWidth="156px">
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default EditCategory;
