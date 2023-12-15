import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { Link, createSearchParams, useSearchParams } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import api from '../api';
import useDebounce from '../hooks/useDebounce';

function PropertiesList() {
  const dateConverter = (inputDate) => {
    const targetTimeZone = 'Asia/Jakarta';
    const zonedTime = utcToZonedTime(inputDate, targetTimeZone);
    const formattedDateString = format(zonedTime, 'yyyy-MM-dd');
    return formattedDateString;
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentStartDate, setCurrentStartDate] = useState(
    searchParams.has('start_date')
      ? new Date(searchParams.get('start_date'))
      : new Date()
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const querySearch = useDebounce(searchParams.get('name'), 500);

  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);

  const getProperties = useCallback(async () => {
    const { data } = await api.get('/properties/with-rooms', {
      params: {
        page: currentPage,
        startDate: dateConverter(currentStartDate),
        sort: searchParams.get('sort'),
        search: querySearch,
        location: searchParams.get('location'),
      },
    });
    setProperties(data.data);
    setTotalPage(Math.ceil(data.count / 6));
  }, [currentPage, currentStartDate, querySearch, searchParams]);

  const handleChangeLocation = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('location', e.target.value);
      return newParams;
    });
    setCurrentPage(1);
  };

  const handleChangeSort = (e) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', e.target.value);
      return newParams;
    });
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
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('name', e.target.value);
      return newParams;
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('start_date', dateConverter(currentStartDate));
      return newParams;
    });
  }, [currentStartDate, searchParams, setSearchParams]);

  useEffect(() => {
    api.get('/categories').then((res) => {
      const {
        data: { data },
      } = res;
      setCategories(data);
      if (searchParams.get('location') === '') {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set('location', data[0].location);
          return newParams;
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getProperties();
  }, [getProperties]);

  return (
    <UserLayout>
      <Flex
        gap={4}
        p={4}
        boxShadow="md"
        bg="gray.50"
        mb={6}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <SingleDatepicker
            date={currentStartDate}
            onDateChange={setCurrentStartDate}
            configs={{
              dateFormat: 'd MMM yyyy',
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={searchParams.get('name')}
            onChange={handleSearchTerm}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Select
            value={searchParams.get('location')}
            onChange={handleChangeLocation}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.location}>
                {category.location}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Sort by</FormLabel>
          <Select value={searchParams.get('sort')} onChange={handleChangeSort}>
            <option value="name-asc" defaultValue>
              A-Z
            </option>
            <option value="name-desc">Z-A</option>
            <option value="price-asc">Price (low - high)</option>
            <option value="price-desc">Price (high - low)</option>
          </Select>
        </FormControl>
      </Flex>
      <Box>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          }}
          gap={4}
        >
          {properties.length === 0 ? (
            <Text>No properties found</Text>
          ) : (
            properties.map((item) => (
              <Box
                maxW="240px"
                w="full"
                key={item.id}
                bg="gray.50"
                boxShadow="2xl"
                rounded="lg"
                overflow="hidden"
                mx="auto"
              >
                <Link
                  to={{
                    pathname: `/properties/${item.id}`,
                    search: `?${createSearchParams({
                      start_date: dateConverter(currentStartDate),
                      end_date: dateConverter(
                        new Date(
                          currentStartDate.getTime() + 24 * 60 * 60 * 1000
                        )
                      ),
                    })}`,
                  }}
                >
                  <Image
                    src={`${process.env.REACT_APP_IMAGE_LINK}/${item.picture}`}
                    height="200px"
                    style={{ objectFit: 'cover' }}
                  />
                  <Box p={4}>
                    <Text fontWeight="semibold" fontSize="lg">
                      {item.name}
                    </Text>
                    <Text>
                      Rp {new Intl.NumberFormat('id-ID').format(item.minPrice)}
                    </Text>
                  </Box>
                </Link>
              </Box>
            ))
          )}
        </Grid>

        <Flex justifyContent="center" alignItems="center" mt={6}>
          <Button onClick={() => handlePrevPage()}>{'<'}</Button>
          <Text mx="2">
            {currentPage} of {totalPage === 0 ? 1 : totalPage}
          </Text>
          <Button onClick={() => handleNextPage()}>{'>'}</Button>
        </Flex>
      </Box>
    </UserLayout>
  );
}

export default PropertiesList;
