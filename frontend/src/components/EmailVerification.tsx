import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    Alert,
    AlertIcon,
    Spinner,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import api from '../Api/api';

const EmailVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [message, setMessage] = useState('');

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            verifyEmail(token);
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link');
        }
    }, [searchParams]);

    const verifyEmail = async (token: string) => {
        setIsVerifying(true);
        try {
            const response = await api.get(`/users/verify-email?token=${token}`);
            setVerificationStatus('success');
            setMessage(response.data.message);
            
            toast({
                title: "Email Verified!",
                description: "Your email has been successfully verified.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (error: any) {
            setVerificationStatus('error');
            setMessage(error.response?.data?.detail || 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center" p={4}>
            <Box maxW="md" w="full" bg={cardBg} rounded="lg" shadow="md" p={8}>
                <VStack spacing={6} textAlign="center">
                    <Heading size="lg" color={textColor}>
                        Email Verification
                    </Heading>

                    {isVerifying && (
                        <VStack spacing={4}>
                            <Spinner size="xl" color="blue.500" />
                            <Text color={textColor}>Verifying your email...</Text>
                        </VStack>
                    )}

                    {!isVerifying && verificationStatus === 'success' && (
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <Text fontWeight="bold">Success!</Text>
                                <Text>{message}</Text>
                                <Text fontSize="sm" mt={2}>Redirecting to login page...</Text>
                            </Box>
                        </Alert>
                    )}

                    {!isVerifying && verificationStatus === 'error' && (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <Text fontWeight="bold">Verification Failed</Text>
                                <Text>{message}</Text>
                            </Box>
                        </Alert>
                    )}

                    {verificationStatus === 'error' && (
                        <Button
                            colorScheme="blue"
                            onClick={() => navigate('/resend-verification')}
                        >
                            Request New Verification Email
                        </Button>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default EmailVerification;