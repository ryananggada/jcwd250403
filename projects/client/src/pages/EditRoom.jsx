import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { useNavigate, useParams } from 'react-router-dom';

function EditRoom() {
  const token = useSelector((state) => state.auth.token);

  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [formattedPrice, setFormattedPrice] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const roomSchema = Yup.object().shape({
    propertyId: Yup.string().required('Property is required'),
    roomType: Yup.string().required('Room type is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price should be greater than 0'),
    description: Yup.string().required('Description is required'),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = rawValue === '' ? 0 : parseFloat(rawValue);

    formik.setFieldValue('price', numericValue);
    setFormattedPrice(numericValue === '' ? '0' : formatCurrency(numericValue));
  };

  const handleSubmit = async (values, form) => {
    setIsLoading(true);
    try {
      await api.put(`/rooms/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Room successfully editted.',
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
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      propertyId: '',
      roomType: '',
      price: 0,
      description: '',
    },
    enableReinitialize: true,
    validationSchema: roomSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      const response = await api.get(`/rooms/${id}`);
      const {
        data: { data },
      } = response;

      formik.setFieldValue('propertyId', data.property.id);
      formik.setFieldValue('roomType', data.roomType);
      formik.setFieldValue('price', data.price);
      setFormattedPrice(formatCurrency(data.price));
      formik.setFieldValue('description', data.description);
    };

    fetchRoom();

    api
      .get('/properties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const {
          data: { data },
        } = res;
        setProperties(data);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <TenantLayout>
      <Stack as="form" maxWidth="420px" onSubmit={formik.handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Edit Room
        </Text>

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

        <FormControl isInvalid={formik.errors.price}>
          <FormLabel>Price</FormLabel>
          <InputGroup>
            <InputLeftAddon children="Rp" />
            <Input
              name="price"
              onChange={handlePriceChange}
              type="text"
              placeholder="0"
              value={formattedPrice}
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

export default EditRoom;
