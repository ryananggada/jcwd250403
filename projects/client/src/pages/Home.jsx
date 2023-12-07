import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Button,
  Heading,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import UserLayout from '../components/UserLayout';
import { FiSearch } from 'react-icons/fi';
import api from '../api';

function Home() {
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState([]);

  const [location, setLocation] = useState('');

  const handleChangeLocation = (e) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    api.get('/categories').then((res) => {
      const {
        data: { data },
      } = res;
      setCategories(data);
      setLocation(data[0].location);
    });
  }, []);

  return (
    <UserLayout>
      <Box
        position="relative"
        bgImage="./homePageImage.jpg"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="80vh"
        m="-4"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="white"
          opacity="0.5"
        ></Box>
        <Box position="relative" zIndex="1" textAlign="center" paddingTop="5vh">
          <Heading textAlign="center" my="4rem">
            Where would you like to stay?
          </Heading>
          <Box
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="flex-end"
            justifyContent="center"
            boxShadow="md"
            bg="gray.50"
            p={4}
            m={6}
            gap={6}
          >
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <SingleDatepicker
                date={date}
                onDateChange={setDate}
                configs={{
                  dateFormat: 'dd MMM yyyy',
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Select value={location} onChange={handleChangeLocation}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.location}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Link
              to={`/properties?location=${location}&startDate=${
                date.toISOString().split('T')[0]
              }`}
            >
              <Button
                leftIcon={<FiSearch />}
                variant="outline"
                colorScheme="black"
                w="156px"
              >
                Search
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </UserLayout>
  );
}

export default Home;
