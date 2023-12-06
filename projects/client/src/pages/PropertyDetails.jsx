import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import UserLayout from '../components/UserLayout';
import api from '../api';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [rooms, setRooms] = useState([]);

  const [nameQuery, setNameQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('A-Z');

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      setProperty(res.data.data);
    });

    api.get(`/rooms/property/${id}`).then((res) => {
      setRooms(res.data.data);
    });
  }, [id]);

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
              <GridItem border="1px" borderColor="black" borderRadius={4} p={3}>
                <Stack>
                  <Text fontSize="xl" fontWeight="medium">
                    {room.roomType}
                  </Text>
                  <Text>{room.description}</Text>
                  <Text>
                    Rp {new Intl.NumberFormat('id-ID').format(room.price)} / day
                  </Text>
                  <Link to={`/properties/book/${room.id}`}>
                    <Button
                      alignSelf="flex-end"
                      colorScheme="black"
                      variant="outline"
                    >
                      Rent now
                    </Button>
                  </Link>
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
