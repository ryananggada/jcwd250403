import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
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
} from '@chakra-ui/react';
import axios from 'axios';
import TenantLayout from '../components/TenantLayout';

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
          Are you sure you want to delete this category: {modalData.location}?
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

function Categories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [modalData, setModalData] = useState({ id: 0, location: '' });
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDeleteModal = ({ id, location }) => {
    setModalData({ id, location });
    onOpen();
  };

  const getCategories = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/categories`
      );
      setCategories(data.data);
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failure',
        description: `Failed to fetch categories. Msg: ${error.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
  }, [toast]);

  const handleDeleteCategory = async ({ id }) => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/categories/${id}`)
        .then((res) => {
          getCategories();
          onClose();
          toast({
            status: 'success',
            title: 'Success',
            description: 'Category is deleted.',
            isClosable: true,
            duration: 2500,
          });
        });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Failure',
        description: `Failed to delete category. Msg: ${error.message}`,
        isClosable: true,
        duration: 2500,
      });
    }
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

        <Button colorScheme="blue" maxWidth="156px">
          <Link to="/categories/create">New Category</Link>
        </Button>

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
                        <Link to={`/categories/edit/${category.id}`}>
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

export default Categories;
