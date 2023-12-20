import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  ButtonGroup,
  Button,
  Badge,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import api from '../api';
import UserLayout from '../components/UserLayout';

const CancelOrderModal = ({
  isOpen,
  onClose,
  modalData,
  handleCancelOrder,
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cancel Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to cancel your order?</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            marginRight={4}
            onClick={() => handleCancelOrder({ id: modalData.id })}
          >
            Yes
          </Button>
          <Button colorScheme="gray" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function UserOrderDetails() {
  const token = useSelector((state) => state.auth.token);

  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const paymentProofRef = useRef(null);

  const [order, setOrder] = useState({});
  const [modalData, setModalData] = useState({ id: 0 });
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDeleteModal = ({ id }) => {
    setModalData({ id });
    onOpen();
  };

  const handleUploadPaymentProof = async (e) => {
    try {
      if (paymentProofRef.current.files.length > 0) {
        const formData = new FormData();
        formData.append('paymentProof', paymentProofRef.current.files[0]);
        await api.post(`/orders/${id}/upload-payment`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        navigate('/user/orders');
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
      navigate('/user/orders');
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
      const { data } = await api.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data.data);
    };
    getOrder();
  }, [id, token]);

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
                {order.endDate && format(new Date(order.endDate), 'd MMM yyyy')}
              </Td>
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
            <Tr>
              <Td>Payment Proof</Td>
              <Td>
                {order.paymentProof != null ? (
                  <Image
                    src={`${process.env.REACT_APP_IMAGE_LINK}/${order.paymentProof}`}
                    maxWidth="527px"
                    maxHeight="320px"
                  />
                ) : (
                  'No payment proof yet'
                )}
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
      <ButtonGroup
        mt={4}
        display={
          order.status === 'Complete' || order.status === 'Cancelled'
            ? 'none'
            : 'block'
        }
      >
        <Button
          colorScheme="yellow"
          onClick={() => paymentProofRef.current.click()}
          isDisabled={order.status === 'Waiting' ? true : false}
        >
          Upload Payment Proof
        </Button>
        <Button
          colorScheme="red"
          isDisabled={order.status !== 'Pending' ? true : false}
          onClick={() => handleOpenDeleteModal({ id: id })}
        >
          Cancel Order
        </Button>
      </ButtonGroup>

      <CancelOrderModal
        isOpen={isOpen}
        onClose={onClose}
        modalData={modalData}
        handleCancelOrder={handleCancelOrder}
      />
    </UserLayout>
  );
}

export default UserOrderDetails;
