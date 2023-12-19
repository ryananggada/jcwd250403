import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Stack,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Badge,
  Select,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import TenantLayout from '../components/TenantLayout';
import api from '../api';

function TenantOrders() {
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handleChangeStatus = (e) => {
    const newValue = e.target.value;
    setCurrentStatus(newValue);
    setCurrentPage(1);
  };

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
    api
      .get('/orders/tenant', {
        params: { status: currentStatus, page: currentPage },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data.data);
        setTotalPage(Math.ceil(res.data.count / 5));
      });
  }, [token, currentStatus, currentPage]);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" fontWeight="bold">
          Orders
        </Text>

        <Flex direction="column">
          <Text mb={2}>Filter by status</Text>
          <Select
            maxWidth="360px"
            value={currentStatus}
            onChange={handleChangeStatus}
          >
            <option value="" defaultValue></option>
            <option value="Pending">Pending</option>
            <option value="Waiting">Waiting</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </Flex>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Invoice ID</Th>
                <Th>Property</Th>
                <Th>Room</Th>
                <Th>User</Th>
                <Th>Status</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.length === 0 ? (
                <Tr>
                  <Td>No orders yet</Td>
                </Tr>
              ) : (
                orders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.invoiceId}</Td>
                    <Td>{order.room?.property?.name}</Td>
                    <Td>{order.room?.roomType}</Td>
                    <Td>{order.user?.name}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          order.status === 'Cancelled'
                            ? 'red'
                            : order.status === 'Complete'
                            ? 'green'
                            : 'yellow'
                        }
                      >
                        {order.status}
                      </Badge>
                    </Td>
                    <Td isNumeric>
                      <Button
                        onClick={() => navigate(`/tenant/orders/${order.id}`)}
                      >
                        View
                      </Button>
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

export default TenantOrders;
