import { useEffect, useState } from 'react';
import {
  Text,
  Stack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react';
import TenantLayout from '../components/TenantLayout';
import { Link } from 'react-router-dom';
import api from '../api';

function TenantAvailability() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      const {
        data: { data },
      } = await api.get('/rooms');
      setRooms(data);
    };

    getRooms();
  }, []);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" fontWeight="bold">
          Set Room Availability
        </Text>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Room Type</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {rooms.length === 0 ? (
                <Tr>
                  <Td>No rooms yet</Td>
                </Tr>
              ) : (
                rooms.map((room) => (
                  <Tr key={room.id}>
                    <Td>{room.property.name}</Td>
                    <Td>{room.roomType}</Td>
                    <Td>{room.price}</Td>
                    <Td>{room.description}</Td>
                    <Td isNumeric>
                      <Link to={`/tenant/availabilities/add/${room.id}`}>
                        <Button colorScheme="yellow">View</Button>
                      </Link>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </TenantLayout>
  );
}

export default TenantAvailability;
