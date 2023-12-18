import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { FiMapPin } from 'react-icons/fi';
import { format, addDays } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import UserLayout from '../components/UserLayout';
import api from '../api';

function PropertyDetails() {
  const dateConverter = (inputDate) => {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const token = useSelector((state) => state.auth.token);
  const payload = token !== null ? jwtDecode(token) : '';

  const navigate = useNavigate();
  const toast = useToast();

  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedDates, setSelectedDates] = useState([
    searchParams.has('start_date')
      ? new Date(searchParams.get('start_date'))
      : new Date(),
    searchParams.has('end_date')
      ? new Date(searchParams.get('end_date'))
      : new Date().setDate(new Date().getDate() + 1),
  ]);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      setProperty(res.data.data);
    });

    if (selectedDates[0] instanceof Date && selectedDates[1] instanceof Date) {
      api
        .get(`/rooms/property/${id}`, {
          params: {
            startDate: dateConverter(selectedDates[0]),
            endDate: dateConverter(selectedDates[1]),
          },
        })
        .then((res) => {
          setRooms(res.data.data);
        });
    }
  }, [selectedDates, id]);

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (
        selectedDates[0] instanceof Date &&
        selectedDates[1] instanceof Date
      ) {
        newParams.set('start_date', dateConverter(selectedDates[0]));
        newParams.set('end_date', dateConverter(selectedDates[1]));
      }
      return newParams;
    });
  }, [searchParams, selectedDates, setSearchParams]);

  useEffect(() => {
    api.get(`/reviews/property/${id}`).then((res) => {
      setReviews(res.data.data);
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
          <FormControl maxWidth="576px">
            <FormLabel>Date</FormLabel>
            <RangeDatepicker
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
              configs={{
                dateFormat: 'd MMM yyyy',
              }}
            />
          </FormControl>
          <Text fontSize="2xl" fontWeight="semibold" my={4}>
            Rooms
          </Text>

          {rooms.length === 0 ? (
            <Text fontSize="xl" fontWeight="medium" textAlign="center">
              No rooms available in this date range
            </Text>
          ) : (
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

                    {room.availableDates.length > 0 && (
                      <Text my={1} fontWeight="semibold">
                        Available Date:
                      </Text>
                    )}
                    <Text>
                      {room.availableDates.length > 0 &&
                        `${format(
                          new Date(room.availableDates[0].date),
                          'd MMM yyyy'
                        )} to ${format(
                          addDays(
                            new Date(
                              room.availableDates[
                                room.availableDates.length - 1
                              ].date
                            ),
                            1
                          ),
                          'd MMM yyyy'
                        )}`}
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
                          const newEndDate = new Date(
                            room.availableDates[
                              room.availableDates.length - 1
                            ].date
                          );
                          newEndDate.setDate(newEndDate.getDate() + 1);

                          navigate(`/properties/book/${room.id}`, {
                            state: {
                              startDate: room.availableDates[0].date,
                              endDate: newEndDate,
                              totalPrice: room.totalPrice,
                            },
                          });
                        }
                      }}
                    >
                      Rent now
                    </Button>
                  </Stack>
                </GridItem>
              ))}
            </Grid>
          )}

          <Text fontSize="2xl" fontWeight="semibold" my={4}>
            Reviews
          </Text>
          {reviews.length === 0 ? (
            <Text fontSize="xl" fontWeight="medium" textAlign="center">
              No reviews yet
            </Text>
          ) : (
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={2}
            >
              {reviews.map((review) => (
                <GridItem
                  border="1px"
                  borderColor="black"
                  borderRadius={4}
                  p={3}
                  key={review.id}
                >
                  <Flex alignItems="center" gap={3}>
                    <Avatar
                      src={`${process.env.REACT_APP_IMAGE_LINK}/${review.user?.profilePicture}`}
                    />
                    <Text>{review.user?.name}</Text>
                  </Flex>
                  <Flex my={2}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Icon
                        key={value}
                        as={value <= review.rating ? FaStar : FaRegStar}
                        color="orange.300"
                        boxSize={6}
                      />
                    ))}
                  </Flex>
                  <Text my={2}>{review.comment}</Text>
                </GridItem>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </UserLayout>
  );
}

export default PropertyDetails;
