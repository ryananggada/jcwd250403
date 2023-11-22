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

const Links = ['View Orders'];

const NavLink = ({ children }) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
      }}
      href={'#'}
    >
      {children}
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }) => {
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
        <Image src="/logoHor.png" alt="Logo Pintuku" width="100px" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <Stack as="nav" spacing={4} pl={4}>
        {Links.map((link) => (
          <NavLink key={link}>{link}</NavLink>
        ))}
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
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const loginModal = useDisclosure();

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
            <Image src="/logoHor.png" alt="Logo Pintuku" width="100px" />
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Button
              display={profile === null ? 'block' : 'none'}
              colorScheme="teal"
              size="sm"
              onClick={loginModal.onOpen}
            >
              Login
            </Button>
            <Box display={profile !== null ? 'block' : 'none'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar size="sm" src="" />
                </MenuButton>
                <MenuList>
                  <MenuItem>Transactions</MenuItem>
                  <MenuItem>Edit Profile</MenuItem>
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
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>

      {children}

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
