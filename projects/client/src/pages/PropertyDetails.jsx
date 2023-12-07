import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Grid,
  GridItem,
  Stack,
  Button,
  Icon,
  Center,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { FiMapPin } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import UserLayout from '../components/UserLayout';
import api from '../api';

function PropertyDetails() {
  const token = useSelector((state) => state.auth.token);
  const payload = token !== null ? jwtDecode(token) : '';

  const navigate = useNavigate();
  const toast = useToast();

  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [rooms, setRooms] = useState([]);

  const [selectedDates, setSelectedDates] = useState([
    new Date(),
    new Date().setDate(new Date().getDate() + 1),
  ]);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      setProperty(res.data.data);
    });

    api
      .get(`/rooms/property/${id}`, {
        params: { startDate: selectedDates[0], endDate: selectedDates[1] },
      })
      .then((res) => {
        setRooms(res.data.data);
      });
  }, [selectedDates, id]);

  return (
    <UserLayout>
      <Stack>
        <Center>
          <Image
            src={`${process.env.REACT_APP_IMAGE_LINK}/${property.picture}`}
            width="576px"
          />
        </Center>
        <Stack boxShadow="lg" p={4} bg="gray.50">
          <Text fontSize="4xl" fontWeight="bold">
            {property.name}
          </Text>
          <Text fontSize="lg">
            <Icon as={FiMapPin} /> {property.category?.location}
          </Text>
          <Text>Tenant: {property.tenant?.name}</Text>

          <Text>{property.description}</Text>
        </Stack>

        <Box>
          <FormControl maxWidth="576px">
            <FormLabel>Date</FormLabel>
            <RangeDatepicker
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
              configs={{
                dateFormat: 'dd MMM yyyy',
              }}
            />
          </FormControl>
          <Text fontSize="2xl" fontWeight="semibold" my={4}>
            Rooms
          </Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={2}
          >
            {rooms.map((room) => (
              <GridItem
                border="1px"
                borderColor="black"
                borderRadius={4}
                p={3}
                key={room.id}
              >
                <Stack>
                  <Text fontSize="xl" fontWeight="medium">
                    {room.roomType}
                  </Text>
                  <Text>{room.description}</Text>
                  <Text>
                    Rp {new Intl.NumberFormat('id-ID').format(room.price)} /
                    night
                  </Text>

                  <Button
                    alignSelf="flex-end"
                    colorScheme="black"
                    variant="outline"
                    onClick={() => {
                      if (token == null || payload.role !== 'user') {
                        toast({
                          status: 'error',
                          title: 'Error',
                          description: 'Only registered user can book!',
                          isClosable: true,
                          duration: 2500,
                        });
                      } else {
                        navigate(`/properties/book/${room.id}`);
                      }
                    }}
                  >
                    {room.availableDates.length === 0 ? 'Sold out' : 'Rent now'}
                  </Button>
                </Stack>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Stack>
    </UserLayout>
  );
}

export default PropertyDetails;
