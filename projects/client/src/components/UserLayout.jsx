import { useState, useEffect } from 'react';
import {
  useDisclosure,
  chakra,
  Box,
  Text,
  Flex,
  IconButton,
  HStack,
  Stack,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  VisuallyHidden,
  Drawer,
  DrawerContent,
  CloseButton,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  FiX,
  FiMenu,
  FiYoutube,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import UserLoginModal from './UserLoginModal';
import { logout } from '../slices/auth';
import { Link } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const SidebarContent = ({ onClose, isLogin, token, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link to="/">
          <Image src="/logoHor.png" alt="Logo Pintuku" width="100px" />
        </Link>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <Stack as="nav" spacing={4} pl={4}>
        <Link to="/tenant/login">
          <Button
            display={!isLogin(token) ? 'block' : 'none'}
            variant="outline"
            colorScheme="blue"
          >
            Register Property
          </Button>
        </Link>
      </Stack>
    </Box>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg="blackAlpha.100"
      rounded="full"
      w={8}
      h={8}
      cursor="pointer"
      as="a"
      href={href}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{
        bg: 'blackAlpha.200',
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

function UserLayout({ children }) {
  const [profilePicture, setProfilePicture] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const loginModal = useDisclosure();

  function isLogin(token) {
    if (!token) {
      return false;
    }

    const payload = jwtDecode(token);
    const currentDate = new Date();

    if (payload.exp * 1000 > currentDate.getTime() && payload.role === 'user') {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (token) {
      api
        .get('/auth/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProfilePicture(res.data.data.user.profilePicture);
        });
    }
  }, [token]);

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Box px={{ base: 3, md: 6 }} py={{ base: 0, md: 2 }}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size={'md'}
            icon={isOpen ? <FiX /> : <FiMenu />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            pl={3}
            backgroundColor="white"
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Link to="/">
              <Image src="/logoHor.png" alt="Logo Pintuku" width="100px" />
            </Link>
          </HStack>
          <Flex alignItems="center">
            <ButtonGroup>
              {isLargerThan768 && (
                <Link to="/tenant/login">
                  <Button
                    display={!isLogin(token) ? 'block' : 'none'}
                    variant="outline"
                    colorScheme="blue"
                  >
                    Register Property
                  </Button>
                </Link>
              )}
              <Button
                display={!isLogin(token) ? 'block' : 'none'}
                colorScheme="blue"
                onClick={loginModal.onOpen}
              >
                Login
              </Button>
            </ButtonGroup>
            <Box display={isLogin(token) ? 'block' : 'none'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    src={
                      profilePicture
                        ? `${process.env.REACT_APP_IMAGE_LINK}/${profilePicture}`
                        : ''
                    }
                  />
                </MenuButton>
                <MenuList zIndex={999}>
                  <Link to="/user/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <Link to="/user/orders">
                    <MenuItem>View Orders</MenuItem>
                  </Link>
                  <Link to="/user/reviews">
                    <MenuItem>Reviews</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={() => dispatch(logout())}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </Flex>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} isLogin={isLogin} token={token} />
          </DrawerContent>
        </Drawer>
      </Box>

      <Box p={4}>{children}</Box>

      <Box marginTop="auto">
        <Stack
          px={{ base: 4, md: 8 }}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justifyContent={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>&copy; 2023 PT Pintuku. All rights reserved.</Text>
          <Stack direction="row" spacing={6}>
            <SocialButton label="YouTube" href="#">
              <FiYoutube />
            </SocialButton>
            <SocialButton label="Instagram" href="#">
              <FiInstagram />
            </SocialButton>
            <SocialButton label="LinkedIn" href="#">
              <FiLinkedin />
            </SocialButton>
          </Stack>
        </Stack>
      </Box>

      <UserLoginModal isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
    </Box>
  );
}

export default UserLayout;
