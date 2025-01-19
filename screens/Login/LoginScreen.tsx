import {
    ScrollView,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
    // Added for platform-specific styling
    NativeSyntheticEvent,
    TextInputFocusEventData,
} from 'react-native';
import { Image } from 'expo-image';
import InputField from '@/components/custom/InputField';
import { useState, useCallback } from 'react';
import { Button } from '@/components/custom/Button';
import {
    LoginScreenNavigationProp,
    LoginScreenProps,
} from '@/types/navigations';
import { loginWithEmailPassword } from '@/lib/firebase/auth';

export default function LoginScreen({ navigation }: LoginScreenProps) {
    // Get screen dimensions for responsive design
    const { width, height } = useWindowDimensions();
    const isTablet = width > 768; // Common tablet breakpoint

    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    // Track keyboard focus for better scroll handling
    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

    // Calculate responsive dimensions
    const logoSize = isTablet
        ? Math.min(width * 0.2, 300) // Tablet size (20% of width, max 300)
        : Math.min(width * 0.4, 200); // Phone size (40% of width, max 200)

    // Container width for form elements
    const containerWidth = isTablet
        ? Math.min(width * 0.6, 600) // Tablet size (60% of width, max 600)
        : '100%'; // Phone size (full width)

    // Handle input focus events
    const handleInputFocus = useCallback(
        (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsKeyboardFocused(true);
        },
        []
    );

    const handleInputBlur = useCallback(() => {
        setIsKeyboardFocused(false);
    }, []);

    // Email validation with improved UX
    const validateEmail = (text: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(text);
        // Only show error if user has started typing
        if (text.length > 0) {
            setEmailError(isValid ? '' : 'Please enter a valid email address');
        } else {
            setEmailError('');
        }
        return isValid;
    };

    // Input validation with improved feedback
    const validateInputs = (): boolean => {
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        let isValid = true;

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateInputs()) return;

        try {
            setIsLoading(true);
            setGeneralError('');

            const response = await loginWithEmailPassword(email, password);

            if (response.success) {
                setEmail('');
                setPassword('');
                navigation.navigate('Home');
            } else {
                setGeneralError(
                    response.error || 'An error occurred during login'
                );
            }
        } catch (err) {
            setGeneralError('An unexpected error occurred. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar
                barStyle={
                    Platform.OS === 'ios' ? 'dark-content' : 'light-content'
                }
                backgroundColor={
                    Platform.OS === 'android' ? '#3d5300' : undefined
                }
            />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={
                    Platform.OS === 'ios' ? (isTablet ? 40 : 20) : 0
                }
            >
                <ScrollView
                    contentContainerClassName={`min-h-screen flex-1 items-center 
                        ${isTablet ? 'justify-center' : 'justify-start pt-12'}`}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    {/* Main container with responsive width */}
                    <View style={{ width: containerWidth }} className="px-6">
                        {/* Logo container with dynamic sizing */}
                        <View
                            className={`mb-8 ${isTablet ? 'mb-12' : ''} items-center justify-center`}
                        >
                            <Image
                                source={require('@/assets/images/grubly-logo.png')}
                                contentFit="contain"
                                style={{
                                    width: logoSize,
                                    height: logoSize,
                                }}
                                transition={200} // Smooth size transitions
                            />
                        </View>

                        {/* Form container */}
                        <View className={`w-full ${isTablet ? 'px-8' : ''}`}>
                            <InputField
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="juandelacruz@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                helperText="Enter your registered email"
                                error={emailError}
                                editable={!isLoading}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                containerClass={isTablet ? 'mb-6' : ''}
                            />

                            <InputField
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Your password"
                                keyboardType="default"
                                secureTextEntry={true}
                                autoCapitalize="none"
                                helperText="Enter your registered password"
                                error={passwordError}
                                editable={!isLoading}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                containerClass={isTablet ? 'mb-6' : ''}
                            />

                            {generalError ? (
                                <Text className="mb-4 mt-1 text-center text-sm text-danger">
                                    {generalError}
                                </Text>
                            ) : null}

                            <Button
                                pressableClassName={`mt-4 
                                    ${isTablet ? 'py-5' : ''}`}
                                label={isLoading ? 'Please wait...' : 'Login'}
                                onPress={handleLogin}
                                type={isLoading ? 'secondary' : 'primary'}
                            />

                            <Text className="mb-4 mt-6 text-center font-bold text-primary-200">
                                OR
                            </Text>

                            <Button
                                type="secondary"
                                pressableClassName={isTablet ? 'py-5' : ''}
                                label="Sign Up"
                                onPress={() => navigation.navigate('SignUp')}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
