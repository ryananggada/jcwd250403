import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea,
  Select,
  Box,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

function CreateProperty() {
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      formik.setFieldValue('picture', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        formik.setFieldValue('preview', e.target.result);
      };
      reader.readAsDataURL(file);
    },
  });

  const propertySchema = Yup.object().shape({
    name: Yup.string().required('Property name is required'),
    categoryId: Yup.string().required('Category is required'),
    tenantId: Yup.string().required('Tenant is required'),
    description: Yup.string().required('Description is required'),
    picture: Yup.mixed()
      .required('Picture is required')
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
      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('tenantId', values.tenantId);
      formData.append('description', values.description);
      formData.append('picture', values.picture);

      await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'New property is added.',
        isClosable: true,
        duration: 2500,
      });

      form.resetForm();
      navigate('/tenant/properties');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `Something went wrong: ${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      categoryId: 1,
      tenantId: 1,
      description: '',
      picture: null,
    },
    validationSchema: propertySchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    api.get('/categories').then((res) => {
      const {
        data: { data },
      } = res;
      setCategories(data);
    });
  }, []);

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Create New Property
        </Text>
        <FormControl isInvalid={formik.errors.name && formik.touched.name}>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            onChange={formik.handleChange}
            type="text"
            placeholder="Property name"
            {...formik.getFieldProps('name')}
          />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.categoryId && formik.touched.categoryId}
        >
          <FormLabel>Location</FormLabel>
          <Select {...formik.getFieldProps('categoryId')}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.location}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{formik.errors.categoryId}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.description && formik.touched.description}
        >
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            onChange={formik.handleChange}
            type="text"
            placeholder="Enter description"
            {...formik.getFieldProps('description')}
          />
          <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.picture}>
          <FormLabel>Upload image</FormLabel>
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
          <FormErrorMessage>{formik.errors.picture}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="green">
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default CreateProperty;
