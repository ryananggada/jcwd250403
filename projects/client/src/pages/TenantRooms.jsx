import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  Flex,
  Input,
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
import useDebounce from '../hooks/useDebounce';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const querySearch = useDebounce(searchTerm, 1500);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const token = useSelector((state) => state.auth.token);

  const handleOpenDeleteModal = ({ id, roomType }) => {
    setModalData({ id, roomType });
    onOpen();
  };

  const getRooms = useCallback(async () => {
    try {
      const { data } = await api.get('/rooms', {
        params: {
          page: currentPage,
          sort: currentSort,
          search: querySearch,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(data.data);
      setTotalPage(Math.ceil(data.count / 5));
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failure',
        description: `${error.response.data.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  }, [currentPage, currentSort, querySearch, token, toast]);

  const handleDeleteRoom = async ({ id }) => {
    try {
      await api.delete(`/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getRooms();
      onClose();
      toast({
        status: 'success',
        title: 'Success',
        description: 'Room is deleted.',
        isClosable: true,
        duration: 2500,
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

  const handleChangeSort = (e) => {
    const newValue = e.target.value;
    setCurrentSort(newValue);
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

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchTerm}
            />
          </InputGroup>

          <InputGroup alignItems="center" justifyContent="end">
            <Text mr="1rem">Sort by</Text>
            <Select
              width="200px"
              value={currentSort}
              onChange={handleChangeSort}
            >
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
                <Th>Room Type</Th>
                <Th>Property</Th>
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
                    <Td>{room.roomType}</Td>
                    <Td>{room.property.name}</Td>
                    <Td>
                      Rp {new Intl.NumberFormat('id-ID').format(room.price)}
                    </Td>
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
          <Button onClick={() => handlePrevPage()}>{'<'}</Button>
          <Text mx="2">
            {currentPage} of {totalPage === 0 ? 1 : totalPage}
          </Text>
          <Button onClick={() => handleNextPage()}>{'>'}</Button>
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
