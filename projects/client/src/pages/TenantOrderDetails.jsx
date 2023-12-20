import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  ButtonGroup,
  Button,
  Image,
  Text,
  Flex,
  Stack,
  Center,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

function TenantOrderDetails() {
  const token = useSelector((state) => state.auth.token);

  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState({});

  const handleConfirmOrder = async () => {
    try {
      await api.post(`/orders/${id}/confirm`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Order successfully confirmed',
        isClosable: true,
        duration: 2500,
      });
      navigate('/tenant/orders');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  const handleRejectOrder = async () => {
    try {
      await api.delete(`/orders/${id}/reject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Order successfully rejected',
        isClosable: true,
        duration: 2500,
      });
      navigate('/tenant/orders');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  const handleCancelOrder = async () => {
    try {
      await api.delete(`/orders/${id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Order successfully cancelled',
        isClosable: true,
        duration: 2500,
      });
      navigate('/tenant/orders');
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  useEffect(() => {
    api
      .get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setOrder(res.data.data);
      });
  }, [id, token]);

  return (
    <TenantLayout>
      <Flex justify="space-between" direction={{ base: 'column', md: 'row' }}>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
              </Tr>
              <Tbody>
                <Tr>
                  <Td>Invoice ID</Td>
                  <Td>{order.invoiceId}</Td>
                </Tr>
                <Tr>
                  <Td>Property Name</Td>
                  <Td>{order.room?.property?.name}</Td>
                </Tr>
                <Tr>
                  <Td>Room Type</Td>
                  <Td>{order.room?.roomType}</Td>
                </Tr>
                <Tr>
                  <Td>Start Date</Td>
                  <Td>
                    {order.startDate &&
                      format(new Date(order.startDate), 'd MMM yyyy')}
                  </Td>
                </Tr>
                <Tr>
                  <Td>End Date</Td>
                  <Td>
                    {order.endDate &&
                      format(new Date(order.endDate), 'd MMM yyyy')}
                  </Td>
                </Tr>
                <Tr>
                  <Td>User</Td>
                  <Td>{order.user?.name}</Td>
                </Tr>
                <Tr>
                  <Td>Status</Td>
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
                </Tr>
              </Tbody>
            </Thead>
          </Table>
        </TableContainer>

        <Stack gap="2.5rem">
          {order.paymentProof !== null ? (
            <>
              <Text textAlign="center" fontSize="xl" fontWeight="semibold">
                Payment Proof
              </Text>
              <Center>
                <Image
                  src={`${process.env.REACT_APP_IMAGE_LINK}/${order.paymentProof}`}
                  width={{ base: '256px', md: '100%' }}
                  height={{ base: '100%', md: '356px' }}
                />
              </Center>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Flex>

      <ButtonGroup
        mt={4}
        display={
          order.status === 'Waiting' || order.status === 'Pending'
            ? 'flex'
            : 'none'
        }
      >
        <Button colorScheme="green" onClick={() => handleConfirmOrder()}>
          Confirm
        </Button>
        <Button
          display={order.status === 'Waiting' ? 'block' : 'none'}
          colorScheme="red"
          onClick={() => handleRejectOrder()}
        >
          Reject
        </Button>
        <Button
          display={order.status === 'Pending' ? 'block' : 'none'}
          colorScheme="red"
          onClick={() => handleCancelOrder()}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </TenantLayout>
  );
}

export default TenantOrderDetails;
