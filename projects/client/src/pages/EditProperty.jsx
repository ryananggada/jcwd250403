import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

function EditProperty() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png'] },
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
    description: Yup.string().required('Description is required'),
    picture: Yup.mixed()
      .nullable(true)
      .test(
        'fileType',
        'Invalid file type (must be in JPEG or PNG)',
        (value) => {
          if (!value) return true;
          return value && ['image/jpeg', 'image/png'].includes(value.type);
        }
      )
      .test(
        'fileSize',
        'Picture size is too large (must be less than 1MB)',
        (value) => {
          if (!value) return true;
          return value && value.size <= 1 * 1024 * 1024;
        }
      ),
  });

  const handleSubmit = async (values, form) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('description', values.description);
      formData.append('picture', values.picture);

      await api.put(`/properties/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Property successfully editted.',
        isClosable: true,
        duration: 2500,
      });

      form.resetForm();
      navigate('/tenant/properties');
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
    initialValues: {
      name: '',
      categoryId: 1,
      description: '',
      picture: null,
    },
    enableReinitialize: true,
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

    const fetchProperty = async () => {
      const response = await api.get(`/properties/${id}`);
      const {
        data: { data },
      } = response;

      formik.setFieldValue('name', data.name);
      formik.setFieldValue('categoryId', data.category.id);
      formik.setFieldValue('description', data.description);

      formik.setFieldValue(
        'preview',
        `${process.env.REACT_APP_IMAGE_LINK}/${data.picture}`
      );
    };

    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Edit Property
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

        <Button
          type="submit"
          isDisabled={!(formik.isValid && formik.dirty)}
          colorScheme="green"
          isLoading={isLoading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default EditProperty;
