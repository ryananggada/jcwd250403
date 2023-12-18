import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Heading, Card, CardHeader, CardBody, Stack } from '@chakra-ui/react';
import TenantLayout from '../components/TenantLayout';
import api from '../api';

function TenantHome() {
  const token = useSelector((state) => state.auth.token);
  const [reports, setReports] = useState({});

  useEffect(() => {
    const getOrderReports = async () => {
      const { data } = await api.get('/orders/report', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(data);
    };

    getOrderReports();
  }, [token]);

  return (
    <TenantLayout>
      <Stack gap={6} align={{ base: 'center', md: 'normal' }}>
        <Heading>Welcome, you currently have</Heading>

        <Card maxWidth="420px">
          <CardHeader>
            <Heading fontSize="xl" textAlign="center">
              Pending Orders
            </Heading>
          </CardHeader>
          <CardBody fontSize="lg" textAlign="center">
            {reports.waitingOrdersCount}
          </CardBody>
        </Card>
        <Card maxWidth="420px">
          <CardHeader>
            <Heading fontSize="xl" textAlign="center">
              Successful Orders
            </Heading>
          </CardHeader>
          <CardBody fontSize="lg" textAlign="center">
            {reports.successOrdersCount}
          </CardBody>
        </Card>
      </Stack>
    </TenantLayout>
  );
}

export default TenantHome;
