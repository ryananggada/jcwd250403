import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormLabel,
  Stack,
  Text,
  Select,
  useToast,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { format, subDays, startOfDay } from 'date-fns';
import TenantLayout from '../components/TenantLayout';
import api from '../api';
import { useFormik } from 'formik';

function AddAvailability() {
  const toast = useToast();

  const { id } = useParams();

  const token = useSelector((state) => state.auth.token);

  const [availableDates, setAvailableDates] = useState([]);

  const currentDate = new Date();
  const oneDayAfterCurrent = currentDate.setDate(currentDate.getDate() + 1);

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const oneMonthInFuture = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  const disablePastDates = () => {
    const pastDates = [];

    for (let i = 0; i <= startOfDay(new Date()).getDate() - 1; i++) {
      pastDates.push(startOfDay(subDays(new Date(), i)).getTime());
    }

    return new Set(pastDates);
  };

  const handleSubmit = async (values, form) => {
    try {
      await api.post(`/available-dates/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        status: 'success',
        title: 'Success',
        description: 'Available date for this room is added.',
        isClosable: true,
        duration: 2500,
      });
      getAvailableDates();
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

  const formik = useFormik({
    initialValues: {
      date: oneDayAfterCurrent,
      pricePercentage: 0,
    },
    onSubmit: handleSubmit,
  });

  const getAvailableDates = useCallback(async () => {
    const {
      data: { data },
    } = await api.get(`/available-dates/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAvailableDates(data);
  }, [id, token]);

  useEffect(() => {
    getAvailableDates();
  }, [getAvailableDates]);

  return (
    <TenantLayout>
      <Flex gap="20px" flexDirection={{ base: 'column', md: 'row' }}>
        <Stack
          maxWidth="420px"
          gap="20px"
          as="form"
          flex="3"
          onSubmit={formik.handleSubmit}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Add Available Dates
          </Text>
          <FormControl>
            <FormLabel>Set available dates</FormLabel>
            <SingleDatepicker
              date={formik.values.date}
              onDateChange={(val) => {
                formik.setFieldValue('date', val);
              }}
              minDate={firstDayOfMonth}
              maxDate={oneMonthInFuture}
              disabledDates={disablePastDates()}
              configs={{ dateFormat: 'd MMM yyyy' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Set price increase (if there is)</FormLabel>
            <Select {...formik.getFieldProps('pricePercentage')}>
              <option value="0" defaultValue>
                0%
              </option>
              <option value="0.05">5%</option>
              <option value="0.10">10%</option>
              <option value="0.15">15%</option>
              <option value="0.20">20%</option>
              <option value="0.25">25%</option>
            </Select>
          </FormControl>
          <Button
            type="submit"
            maxWidth="256px"
            colorScheme="green"
            isDisabled={!(formik.isValid && formik.dirty)}
          >
            Add available date
          </Button>
        </Stack>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Price Increase</Th>
              </Tr>
            </Thead>
            <Tbody>
              {availableDates.length === 0 ? (
                <Tr>
                  <Td>No available dates yet</Td>
                </Tr>
              ) : (
                availableDates.map((ad) => (
                  <Tr key={ad.id}>
                    <Td>
                      {ad.date && format(new Date(ad.date), 'd MMM yyyy')}
                    </Td>
                    <Td>{ad.pricePercentage * 100 + '%'}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </TenantLayout>
  );
}

export default AddAvailability;
