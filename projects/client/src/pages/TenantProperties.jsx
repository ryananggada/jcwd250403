import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Stack,
  Text,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
  ButtonGroup,
  useToast,
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

const DeletePropertyModal = ({
  isOpen,
  onClose,
  modalData,
  handleDeleteProperty,
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this property: {modalData.name}?
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            marginRight={4}
            onClick={() => handleDeleteProperty({ id: modalData.id })}
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

function TenantProperties() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [modalData, setModalData] = useState({ id: 0, name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const querySearch = useDebounce(searchTerm, 1500);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const token = useSelector((state) => state.auth.token);

  const handleOpenDeleteModal = ({ id, name }) => {
    setModalData({ id, name });
    onOpen();
  };

  const getProperties = useCallback(async () => {
    try {
      const { data } = await api.get('/properties', {
        params: {
          page: currentPage,
          sort: currentSort,
          search: querySearch,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(data.data);
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

  const handleDeleteProperty = async ({ id }) => {
    try {
      await api.delete(`/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getProperties();
      onClose();
      toast({
        status: 'success',
        title: 'Success',
        description: 'Property is deleted.',
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
    getProperties();
  }, [getProperties]);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" fontWeight="bold">
          Properties
        </Text>

        <Box display="inline-block">
          <Link to="/tenant/properties/create">
            <Button colorScheme="blue" maxWidth="156px">
              New Property
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
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Description</Th>
                <Th>Tenant</Th>
                <Th>Picture</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {properties.length === 0 ? (
                <Tr>
                  <Td>No properties yet</Td>
                </Tr>
              ) : (
                properties.map((property) => (
                  <Tr key={property.id}>
                    <Td>{property.name}</Td>
                    <Td>{property.category.location}</Td>
                    <Td>{property.description}</Td>
                    <Td>{property.tenant.name}</Td>
                    <Td>
                      <Image
                        src={`${process.env.REACT_APP_IMAGE_LINK}/${property.picture}`}
                        width={216}
                      />
                    </Td>
                    <Td isNumeric>
                      <ButtonGroup>
                        <Link to={`/tenant/properties/edit/${property.id}`}>
                          <Button colorScheme="yellow">Edit</Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            handleOpenDeleteModal({
                              id: property.id,
                              name: property.name,
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

      <DeletePropertyModal
        isOpen={isOpen}
        onClose={onClose}
        modalData={modalData}
        handleDeleteProperty={handleDeleteProperty}
      />
    </TenantLayout>
  );
}

export default TenantProperties;
