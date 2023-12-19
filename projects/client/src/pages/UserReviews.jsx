import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Heading,
  Stack,
  Box,
  Text,
  Image,
  Flex,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import api from '../api';
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';

function UserReviews() {
  const token = useSelector((state) => state.auth.token);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api
      .get('/reviews/user', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setReviews(res.data.data);
      });
  }, [token]);

  return (
    <UserLayout>
      <Stack>
        <Heading>Your reviews</Heading>
        {reviews.map((review) => (
          <Box key={review.id}>
            <Flex p={50} w="full" alignItems="center" justifyContent="center">
              <Box
                bg="white"
                mx={{
                  lg: 8,
                }}
                display={{
                  lg: 'flex',
                }}
                maxW={{
                  lg: '5xl',
                }}
                shadow="lg"
                rounded="lg"
              >
                <Box
                  w={{
                    lg: '50%',
                  }}
                >
                  <Image
                    src={`${process.env.REACT_APP_IMAGE_LINK}/${review.property?.picture}`}
                    alt="Property Image"
                    h={{ base: 64, lg: 'full' }}
                    rounded="lg"
                    objectFit="cover"
                  />
                </Box>

                <Box
                  py={8}
                  px={6}
                  maxW={{
                    base: 'xl',
                    lg: '5xl',
                  }}
                >
                  <Text
                    fontSize={{
                      base: '2xl',
                      md: '3xl',
                    }}
                    color="gray.800"
                    fontWeight="bold"
                  >
                    {review.property?.name}
                  </Text>
                  <Text>{review.property?.category?.location}</Text>
                  {review.isDone ? (
                    <>
                      <Flex mt={2}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Icon
                            key={value}
                            as={value <= review.rating ? FaStar : FaRegStar}
                            color="orange.300"
                            boxSize={6}
                          />
                        ))}
                      </Flex>
                      <Text mt={4} color="gray.600">
                        {review.comment}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text mt={4} color="gray.600">
                        You haven't leave a review yet
                      </Text>

                      <Link to={`/user/reviews/add/${review.id}`}>
                        <Button mt={6} variant="outline" colorScheme="black">
                          Add
                        </Button>
                      </Link>
                    </>
                  )}
                </Box>
              </Box>
            </Flex>
          </Box>
        ))}
      </Stack>
    </UserLayout>
  );
}

export default UserReviews;
