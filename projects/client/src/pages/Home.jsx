import { useState } from 'react';
import { Flex, FormControl, FormLabel, Select, Button } from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import UserLayout from '../components/UserLayout';
import { FiSearch } from 'react-icons/fi';

function Home() {
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);

  return (
    <UserLayout>
      <Flex align="center">
        <FormControl>
          <FormLabel>Date</FormLabel>
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={setSelectedDates}
            configs={{
              dateFormat: 'dd/MM/yyyy',
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Select>
            <option value="Jakarta" defaultValue>
              Jakarta
            </option>
            <option value="Bali">Bali</option>
            <option value="Medan">Medan</option>
          </Select>
        </FormControl>

        <Button
          leftIcon={<FiSearch />}
          variant="outline"
          colorScheme="black"
          width="156px"
        >
          Search
        </Button>
      </Flex>
    </UserLayout>
  );
}

export default Home;
