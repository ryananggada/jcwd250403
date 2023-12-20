import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Flex,
  Box,
  Text,
  Image,
  Stack,
  Button,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FiMapPin } from 'react-icons/fi';
import UserLayout from '../components/UserLayout';
import api from '../api';

function BookProperty() {
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const { state } = useLocation();
  const { startDate, endDate, totalPrice } = state;

  const navigate = useNavigate();
  const toast = useToast();

  const token = useSelector((state) => state.auth.token);

  const handleCreateOrder = async () => {
    try {
      await api.post(
        '/orders',
        {
          roomId: room.id,
          startDate,
          endDate,
          totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        status: 'success',
        title: 'Success',
        description: 'Your property order successfully created!',
        isClosable: true,
        duration: 5000,
      });
      navigate('/order-created');
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

  useEffect(() => {
    api.get(`/rooms/${id}`).then((res) => {
      setRoom(res.data.data);
    });
  }, [id]);

  return (
    <UserLayout>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack gap={4}>
          <Text fontSize="3xl" fontWeight="bold">
            Property Booking
          </Text>
          <Image
            src={`${process.env.REACT_APP_IMAGE_LINK}/${room.property?.picture}`}
            width="400px"
          />
          <Text fontSize="lg" fontWeight="semibold">
            {room.property?.name} / {room.roomType}
          </Text>
          <Text>
            <Icon as={FiMapPin} /> {room.property?.category?.location}
          </Text>
          <Box
            borderLeftWidth="8px"
            borderLeftColor="orange.500"
            borderRadius={2}
            bg="orange.200"
            p={4}
          >
            At this moment, only payment by transfer is supported.
          </Box>
        </Stack>
        <Stack
          boxShadow="lg"
          bgColor="gray.100"
          p={4}
          mt={{ base: 6, md: 0 }}
          gap={4}
        >
          <Flex gap={12} justifyContent="space-between">
            <Text>Check in</Text>
            <Text>{format(new Date(startDate), 'd MMM yyyy')}</Text>
          </Flex>
          <Flex gap={12} justifyContent="space-between">
            <Text>Check out</Text>
            <Text>{format(new Date(endDate), 'd MMM yyyy')}</Text>
          </Flex>
          <Text fontWeight="semibold" fontSize="xl">
            Total price
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            Rp {new Intl.NumberFormat('id-ID').format(totalPrice)}
          </Text>

          <Button
            alignSelf="flex-end"
            variant="outline"
            colorScheme="black"
            onClick={() => {
              handleCreateOrder();
            }}
          >
            Confirm
          </Button>
        </Stack>
      </Flex>
    </UserLayout>
  );
}

export default BookProperty;
