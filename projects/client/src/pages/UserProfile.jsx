import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Center,
  Avatar,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import api from '../api';
import UserLayout from '../components/UserLayout';

function UserProfile() {
  const profileId = useSelector((state) => state.auth.profile.id);

  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { data },
      } = await api.get(`/auth/user/profile/${profileId}`);
      setUserProfile(data.user);
    };
    getUserProfile();
  }, [profileId]);

  return (
    <UserLayout>
      <Box justify="center" align="center">
        <Stack
          spacing={4}
          w="full"
          maxW="md"
          rounded="xl"
          boxShadow="lg"
          p={6}
          my={12}
        >
          <Text fontWeight="semibold" fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile
          </Text>

          <Center>
            <Avatar
              size="xl"
              src={`${process.env.REACT_APP_IMAGE_LINK}/${userProfile.profilePicture}`}
            />
          </Center>

          <Text align="left" fontWeight="semibold">
            Name
          </Text>
          <Text align="left">{userProfile.name}</Text>

          <Text align="left" fontWeight="semibold">
            Email
          </Text>
          <Text align="left">{userProfile.email}</Text>

          <Text align="left" fontWeight="semibold">
            Gender
          </Text>
          <Text align="left">{userProfile.gender}</Text>

          <Text align="left" fontWeight="semibold">
            Birthday
          </Text>
          <Text align="left">
            {new Date(userProfile.birthDate).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <Box display={{ base: 'block', sm: 'flex' }}>
            <Link to="/user/profile/edit">
              <Button
                variant="outline"
                colorScheme="black"
                mr={{ base: 0, sm: 4 }}
                mb={{ base: 4, sm: 0 }}
              >
                Edit Profile
              </Button>
            </Link>

            <Link to="/user/profile/change-password">
              <Button variant="outline" colorScheme="black">
                Change Password
              </Button>
            </Link>
          </Box>
        </Stack>
      </Box>
    </UserLayout>
  );
}

export default UserProfile;
