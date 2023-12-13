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
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import TenantLayout from '../components/TenantLayout';
import api from '../api';

function TenantOrders() {
  const token = useSelector((state) => state.auth.token);
  const payload = jwtDecode(token);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');

  const handleChangeStatus = (e) => {
    const newValue = e.target.value;
    setCurrentStatus(newValue);
  };

  useEffect(() => {
    api
      .get(`/orders/tenant/${payload.id}`, {
        params: { status: currentStatus },
      })
      .then((res) => {
        setOrders(res.data.data);
      });
  }, [currentStatus, payload.id]);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" fontWeight="bold">
          Orders
        </Text>

        <Flex direction="column">
          <Text mb={2}>Sort by status</Text>
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
                <Th>Order ID</Th>
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
                    <Td>{order.id}</Td>
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
      </Stack>
    </TenantLayout>
  );
}

export default TenantOrders;
