import React, { useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Input,
    Button,
    Alert,
    AlertIcon,
    useColorModeValue,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import api from '../Api/api';

const ResendVerification: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'success' | 'error' | null>(null);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.200');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        setMessage('');

        try {
            await api.post(`/users/resend-verification?email=${email}`);
            setStatus('success');
            setMessage('Verification email sent! Please check your inbox.');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Failed to send verification email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center" p={4}>
            <Box maxW="md" w="full" bg={cardBg} rounded="lg" shadow="md" p={8}>
                <VStack spacing={6}>
                    <Heading size="lg" color={textColor} textAlign="center">
                        Resend Verification Email
                    </Heading>
                    
                    <Text color={textColor} textAlign="center">
                        Enter your email address to receive a new verification link.
                    </Text>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel color={textColor}>Email Address</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </FormControl>

                            {status && (
                                <Alert status={status} borderRadius="md">
                                    <AlertIcon />
                                    <Text>{message}</Text>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={isLoading}
                                loadingText="Sending..."
                                w="full"
                            >
                                Send Verification Email
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Box>
    );
};

export default ResendVerification;