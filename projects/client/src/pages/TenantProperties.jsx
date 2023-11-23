import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Stack,
  Text,
  Box,
  Button,
  Flex,
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
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleOpenDeleteModal = ({ id, name }) => {
    setModalData({ id, name });
    onOpen();
  };

  const getProperties = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await api.get('/properties');
      setProperties(data);
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

  const handleDeleteProperty = async ({ id }) => {
    try {
      await api.delete(`/properties/${id}`).then((res) => {
        getProperties();
        onClose();
        toast({
          status: 'success',
          title: 'Success',
          description: 'Property is deleted.',
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
          <Button>{'<'}</Button>
          <Text mx="2">1 of 1</Text>
          <Button>{'>'}</Button>
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
