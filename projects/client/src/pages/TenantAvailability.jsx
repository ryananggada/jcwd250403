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
  Flex,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import TenantLayout from '../components/TenantLayout';
import { Link } from 'react-router-dom';
import api from '../api';

function TenantAvailability() {
  const token = useSelector((state) => state.auth.token);

  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (totalPage > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      const { data } = await api.get('/rooms', {
        params: {
          page: currentPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(data.data);
      setTotalPage(Math.ceil(data.count / 5));
    };

    getRooms();
  }, [token, currentPage]);

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
                    <Td>
                      Rp {new Intl.NumberFormat('id-ID').format(room.price)}
                    </Td>
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
        <Flex justifyContent="flex-end" alignItems="center">
          <Button onClick={() => handlePrevPage()}>{'<'}</Button>
          <Text mx="2">
            {currentPage} of {totalPage === 0 ? 1 : totalPage}
          </Text>
          <Button onClick={() => handleNextPage()}>{'>'}</Button>
        </Flex>
      </Stack>
    </TenantLayout>
  );
}

export default TenantAvailability;
