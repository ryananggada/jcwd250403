import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Text } from '@chakra-ui/react';
import UserLayout from '../components/UserLayout';
import api from '../api';

function BookProperty() {
  const { id } = useParams();
  const [room, setRoom] = useState({});

  useEffect(() => {
    api.get(`/rooms/${id}`).then((res) => {
      console.log(res.data.data);
      setRoom(res.data.data);
    });
  }, [id]);

  return (
    <UserLayout>
      <Flex flexDirection="row" justifyContent="space-between">
        <Box>
          <Text fontSize="2xl" fontWeight="semibold">
            Checkout
          </Text>
        </Box>
        <Text>Rp {new Intl.NumberFormat('id-ID').format(room.price)}</Text>
      </Flex>
    </UserLayout>
  );
}

export default BookProperty;
