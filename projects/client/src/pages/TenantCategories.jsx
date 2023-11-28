import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Text,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Stack,
  Flex,
  ButtonGroup,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
} from '@chakra-ui/react';
import api from '../api';
import { FiSearch } from 'react-icons/fi';
import TenantLayout from '../components/TenantLayout';
import useDebounce from '../hooks/useDebounce';

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  modalData,
  handleDeleteCategory,
}) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this category location:{' '}
          {modalData.location}?
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            marginRight={4}
            onClick={() => handleDeleteCategory({ id: modalData.id })}
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

function TenantCategories() {
  const token = useSelector((state) => state.auth.token);

  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [modalData, setModalData] = useState({ id: 0, location: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const querySearch = useDebounce(searchTerm, 1500);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDeleteModal = ({ id, location }) => {
    setModalData({ id, location });
    onOpen();
  };

  const getCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories', {
        params: {
          page: currentPage,
          sort: currentSort,
          search: querySearch,
        },
      });
      setCategories(data.data);
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
  }, [toast, currentPage, currentSort, querySearch]);

  const handleDeleteCategory = async ({ id }) => {
    try {
      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getCategories();
      onClose();
      toast({
        status: 'success',
        title: 'Success',
        description: 'Category is deleted.',
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
    getCategories();
  }, [getCategories]);

  return (
    <TenantLayout>
      <Stack direction="column" gap="20px">
        <Text fontSize="3xl" as="b">
          Categories
        </Text>

        <Box display="inline-block">
          <Link to="/tenant/categories/create">
            <Button colorScheme="blue" maxWidth="156px">
              New Category
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

        <TableContainer maxWidth="576px">
          <Table>
            <Thead>
              <Tr>
                <Th>Location</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.length === 0 ? (
                <Tr>
                  <Td>No categories yet</Td>
                </Tr>
              ) : (
                categories.map((category) => (
                  <Tr key={category.id}>
                    <Td>{category.location}</Td>
                    <Td isNumeric>
                      <ButtonGroup>
                        <Link to={`/tenant/categories/edit/${category.id}`}>
                          <Button colorScheme="yellow">Edit</Button>
                        </Link>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            handleOpenDeleteModal({
                              id: category.id,
                              location: category.location,
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

      <DeleteCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        modalData={modalData}
        handleDeleteCategory={handleDeleteCategory}
      />
    </TenantLayout>
  );
}

export default TenantCategories;
