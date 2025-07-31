import {
  Box, VStack, Image, Avatar, Button, Flex, Text, Badge, useToast,
  useColorModeValue, Drawer, DrawerOverlay, DrawerContent, DrawerBody, IconButton, useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/Auth';
import { useEffect, useState } from 'react';
import { getUserProfilePic, getUserData } from '../Api/getData';
import {
  LogOut, LogIn, Home, Users, MessageCircle, Grid, Activity, Search,
  CreditCard, BookOpen, Settings, File, AlignCenter
} from 'react-feather';
import ColorModeToggle from './ColorModeToggle';

const DrawerNav: React.FC = () => {
  const navigate = useNavigate();
  const { username, logout, profileVersion } = useAuth();
  const [profilePic, setProfilePic] = useState<string>('');
  const [isVeteran, setIsVeteran] = useState<boolean>(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverTextColor = useColorModeValue('gray.700', 'white');
  const buttonColor = useColorModeValue('gray.500', 'gray.400');
  const profileHoverBg = useColorModeValue('gray.50', 'gray.700');
  const buttonColorTwo = useColorModeValue('gray.500', 'gray.600');
  const buttonHoverTwo = useColorModeValue('gray.600', 'gray.500');

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose(); // close drawer on logout
  };

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (username) {
        try {
          const pfp = await getUserProfilePic(username);
          setProfilePic(pfp);
        } catch (error) {
          console.error("Failed to fetch profile picture:", error);
        }
      }
    };
    fetchProfilePic();
  }, [username, profileVersion]);

  useEffect(() => {
    if (username) {
      getUserData({
        username,
        setUserData: (data) => {
          setIsVeteran(data.isVeteran);
        },
        toast,
        checkAdmin: true
      });
    }
  }, [username, toast]);

  const btnProps = {
    variant: "ghost",
    borderRadius: "md",
    _hover: { bg: hoverBgColor, color: hoverTextColor },
    color: buttonColor,
    justifyContent: "flex-start",
    width: "100%",
    size: "md",
    py: 5
  };

  const NavButtons = () => (
    <VStack align="start" spacing={2} width="100%" flex="1">
      <Button leftIcon={<Home size={18} />} onClick={() => { navigate(`/`); onClose(); }} {...btnProps}>
        Main Page
      </Button>
      {username && (
        <>
          <Button leftIcon={<Grid size={18} />} onClick={() => { navigate(`/${username}/feed`); onClose(); }} {...btnProps}>Feed</Button>
          <Button leftIcon={<MessageCircle size={18} />} onClick={() => { navigate(`/${username}/chat`); onClose(); }} {...btnProps}>Chat</Button>
          <Button leftIcon={<Users size={18} />} onClick={() => { navigate(`/${username}/groups`); onClose(); }} {...btnProps}>Groups</Button>
          <Button leftIcon={<Activity size={18} />} onClick={() => { navigate(`/${username}/fitness`); onClose(); }} {...btnProps}>Tasks</Button>
          <Button leftIcon={<Search size={18} />} onClick={() => { navigate(`/${username}/search`); onClose(); }} {...btnProps}>Users</Button>
          {!isVeteran && (
            <Button leftIcon={<Settings size={18} />} onClick={() => { navigate(`/${username}/dashboard`); onClose(); }} {...btnProps}>
              Dashboard
            </Button>
          )}
        </>
      )}
      <Button leftIcon={<CreditCard size={18} />} onClick={() => { navigate(`/donate`); onClose(); }} {...btnProps}>Donate</Button>
      <Button leftIcon={<BookOpen size={18} />} onClick={() => { navigate(`/resources`); onClose(); }} {...btnProps}>Resources</Button>
      <Button leftIcon={<File size={18} />} onClick={() => { navigate(`/${username}/forms`); onClose(); }} {...btnProps}>Forms</Button>
    </VStack>
  );

  const ProfileButtons = () => (
    <Box width="100%" mt="auto" pt={4} borderTop="1px" borderColor={borderColor}>
      {username ? (
        <>
          <Flex align="center" mb={3} p={2} borderRadius="md" _hover={{ bg: profileHoverBg }} onClick={() => { navigate(`/${username}/users`); onClose(); }} cursor="pointer">
            <Avatar size="sm" name={username} src={profilePic} mr={3} />
            <Flex direction="column">
              <Text fontSize="sm" fontWeight="medium" color={textColor} noOfLines={1}>{username}</Text>
              <Badge
  bg={isVeteran ? "gray.700" : "black"}
  color="white"
  fontSize="2xs"
  variant="solid"
  borderRadius="full"
  px={1.5}
  py={0.5}
  minW="auto"
  maxW="fit-content"
  boxShadow="0 1px 2px rgba(0,0,0,0.1)"
  fontWeight="medium"
>
  {isVeteran ? "veteran" : "admin"}
</Badge>
            </Flex>
          </Flex>
          <Button onClick={handleLogout} leftIcon={<LogOut size={18} />} variant="ghost" borderRadius="md" _hover={{ bg: hoverBgColor, color: hoverTextColor }}
            color={subTextColor} width="100%" size="md" justifyContent="flex-start">
            Logout
          </Button>
          <Box mt={2} display="flex" justifyContent="center">
            <ColorModeToggle />
          </Box>
        </>
      ) : (
        <VStack spacing={3} width="100%">
          <Button onClick={() => { navigate('/login'); onClose(); }} variant="outline" size="md" width="100%" borderRadius="md"
            leftIcon={<LogIn size={16} />} _hover={{ bg: hoverBgColor }} color={buttonColor} borderColor={borderColor}>
            Login
          </Button>
          <Button onClick={() => { navigate('/register'); onClose(); }} bg={buttonColorTwo} color="white" variant="solid" size="md" width="100%" borderRadius="md"
            _hover={{ bg: buttonHoverTwo }}>
            Register
          </Button>
          <Box mt={2} display="flex" justifyContent="center">
            <ColorModeToggle />
          </Box>
        </VStack>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile IconButton to trigger Drawer */}
      <IconButton
        icon={<AlignCenter />}
        aria-label="Open Menu"
        onClick={onOpen}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex={1000}
        size="lg"
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          bg={bgColor}
          maxW={{ base: '80%', sm: '400px' }}
          w="100%"
        >
          <DrawerBody display="flex" flexDirection="column" py={4}>
            <Flex align="center" mb={6} p={3} borderRadius="md" bgColor={profileHoverBg} boxShadow="sm" border="1px" borderColor={borderColor}>
              <Image src="/vite.png" alt="BTH Fitness" boxSize="36px" mr={3} borderRadius="full" />
              <Text fontWeight="bold" fontSize="lg" color={textColor}>BTH Fitness</Text>
            </Flex>
            <NavButtons />
            <ProfileButtons />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerNav;
