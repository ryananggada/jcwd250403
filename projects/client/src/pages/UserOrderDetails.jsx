import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import api from '../api';
import UserLayout from '../components/UserLayout';

function UserOrderDetails() {
  const { id } = useParams();
  const toast = useToast();

  const paymentProofRef = useRef(null);

  const [order, setOrder] = useState({});

  const handleUploadPaymentProof = async (e) => {
    try {
      if (paymentProofRef.current.files.length > 0) {
        const formData = new FormData();
        formData.append('paymentProof', paymentProofRef.current.files[0]);
        await api.post(`/orders/${id}/upload-payment`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({
          status: 'success',
          title: 'Success',
          description: 'Payment proof successfully uploaded',
          isClosable: true,
          duration: 2500,
        });
      }
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
    const getOrder = async () => {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
      console.log(data.data);
    };
    getOrder();
  }, [id]);

  return (
    <UserLayout>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Invoice ID</Td>
              <Td>{order.id}</Td>
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
                {order.endDate && format(new Date(order.endDate), 'd MMM yyyy')}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Input
        ref={paymentProofRef}
        name="paymentProof"
        display="none"
        onChange={(e) => handleUploadPaymentProof(e)}
        type="file"
      />
      <Button mt={4} onClick={() => paymentProofRef.current.click()}>
        Upload Payment Proof
      </Button>
    </UserLayout>
  );
}

export default UserOrderDetails;
