import { useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Select,
  Textarea,
  Button,
  useToast,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TenantLayout from '../components/TenantLayout';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
  const toast = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  const roomSchema = Yup.object().shape({
    propertyId: Yup.string().required('Property is required'),
    roomType: Yup.string().required('Room type is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price should be positive'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values, form) => {
    try {
      await api.post('/rooms', values);
      toast({
        status: 'success',
        title: 'Success',
        description: 'New room is added.',
        isClosable: true,
        duration: 2500,
      });
      form.resetForm();
      navigate('/tenant/rooms');
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
      propertyId: 1,
      roomType: '',
      price: 0,
      description: '',
    },
    validationSchema: roomSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    api.get('/properties').then((res) => {
      const {
        data: { data },
      } = res;
      setProperties(data);
    });
  }, []);

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Create New Room
        </Text>

        <FormControl
          isInvalid={formik.errors.propertyId && formik.touched.propertyId}
        >
          <FormLabel>Property</FormLabel>
          <Select {...formik.getFieldProps('propertyId')}>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{formik.errors.propertyId}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.roomType && formik.touched.roomType}
        >
          <FormLabel>Room Type</FormLabel>
          <Input
            name="roomType"
            onChange={formik.handleChange}
            type="text"
            placeholder="Room type"
            {...formik.getFieldProps('roomType')}
          />
          <FormErrorMessage>{formik.errors.roomType}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.price && formik.touched.price}>
          <FormLabel>Price</FormLabel>
          <InputGroup>
            <InputLeftAddon children="Rp" />
            <Input
              name="price"
              onChange={formik.handleChange}
              type="number"
              placeholder="0"
              step="1000"
              {...formik.getFieldProps('price')}
            />
          </InputGroup>
          <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
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

        <Button type="submit" colorScheme="green">
          Submit
        </Button>
      </Stack>
    </TenantLayout>
  );
}

export default CreateRoom;
