import { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  useToast,
  Select,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import api from '../api';
import TenantLayout from '../components/TenantLayout';

const DeleteRoomModal = ({ isOpen, onClose, modalData, handleDeleteRoom }) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this room?</ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            marginRight={4}
            onClick={() => handleDeleteRoom({ id: modalData.id })}
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

function TenantRooms() {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [modalData, setModalData] = useState({ id: 0, type: '' });
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDeleteModal = ({ id, roomType }) => {
    setModalData({ id, roomType });
    onOpen();
  };

  const getRooms = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await api.get('/rooms');
      setRooms(data);
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failure',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  }, [toast]);

  const handleDeleteRoom = async ({ id }) => {
    try {
      await api.delete(`/rooms/${id}`).then((res) => {
        getRooms();
        onClose();
        toast({
          status: 'success',
          title: 'Success',
          description: 'Room is deleted.',
          isClosable: true,
          duration: 2500,
        });
      });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failure',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  };

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" fontWeight="bold">
          Rooms
        </Text>

        <Box display="inline-block">
          <Link to="/tenant/rooms/create">
            <Button colorScheme="blue" maxWidth="156px">
              New Room
            </Button>
          </Link>
        </Box>

        <Flex>
          <InputGroup maxWidth="576px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
          </InputGroup>

          <InputGroup alignItems="center" justifyContent="end">
            <Text mr="1rem">Sort by</Text>
            <Select width="200px">
              <option value="ASC" defaultValue>
                A-Z
              </option>
              <option value="DESC">Z-A</option>
            </Select>
          </InputGroup>
        </Flex>

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
                      <ButtonGroup>
                        <Link to={`/tenant/rooms/edit/${room.id}`}>
                          <Button colorScheme="yellow">Edit</Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            handleOpenDeleteModal({
                              id: room.id,
                              roomType: room.roomType,
                            })
                          }
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex justifyContent="flex-end" alignItems="center">
          <Button>{'<'}</Button>
          <Text mx="2">1 of 1</Text>
          <Button>{'>'}</Button>
        </Flex>
      </Stack>

      <DeleteRoomModal
        isOpen={isOpen}
        onClose={onClose}
        modalData={modalData}
        handleDeleteRoom={handleDeleteRoom}
      />
    </TenantLayout>
  );
}

export default TenantRooms;
