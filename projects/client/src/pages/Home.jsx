import { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Select, Button } from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import UserLayout from '../components/UserLayout';
import { FiSearch } from 'react-icons/fi';
import api from '../api';

function Home() {
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => {
      const {
        data: { data },
      } = res;
      setCategories(data);
    });
  }, []);

  return (
    <UserLayout>
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="flex-end"
        justifyContent="center"
        boxShadow="md"
        bg="gray.50"
        p={4}
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
          <Select>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.location}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          leftIcon={<FiSearch />}
          variant="outline"
          colorScheme="black"
          w="156px"
        >
          Search
        </Button>
      </Box>
    </UserLayout>
  );
}

export default Home;
