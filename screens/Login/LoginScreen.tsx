import { useState } from 'react';
import {
    Text,
    ScrollView,
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    StatusBar,
    useWindowDimensions,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from 'expo-image';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/custom/Button';
import { loginWithEmailPassword } from '@/lib/firebase/auth';
import { router } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
    const { width } = useWindowDimensions();
    const isTablet = width > 768;
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(text);
        setEmailError(isValid ? '' : 'Please enter a valid email address');
        return isValid;
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateAllInputs = () => {
        return (
            validateEmail(loginData.email) &&
            validatePassword(loginData.password)
        );
    };

    const handleLogin = async () => {
        if (!validateAllInputs()) return;
        try {
            setIsLoading(true);
            setGeneralError('');
            const response = await loginWithEmailPassword(
                loginData.email,
                loginData.password
            );
            if (response.success) {
                setLoginData({ email: '', password: '' });
                router.push('/(customer)/home');
            } else {
                setGeneralError(
                    response.error || 'An error occurred during login'
                );
            }
        } catch (error) {
            setGeneralError('An unexpected error occurred. Please try again');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const containerWidth = isTablet ? Math.min(width * 0.6, 600) : '100%';

    return (
        <SafeAreaView className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
            <LinearGradient
                colors={['#3d5300', '#5a7d00', '#7da900']}
                className="absolute h-full w-full"
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: isTablet ? 32 : 24,
                        paddingVertical: isTablet ? 48 : 32,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={{ width: containerWidth }}
                        entering={FadeInDown.duration(600)}
                        layout={Layout.springify()}
                        className="rounded-3xl bg-white/90 p-6 shadow-lg"
                    >
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            className="mb-6 items-center"
                        >
                            <Image
                                source={require('@/assets/images/new-logo-nobg.jpg')}
                                style={{ width: 120, height: 120 }}
                                contentFit="contain"
                            />
                            <Text className="mt-4 text-3xl font-bold text-primary">
                                Welcome Back
                            </Text>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.duration(600).delay(200)}
                            className="space-y-4"
                        >
                            <InputField
                                label="Email Address"
                                value={loginData.email}
                                onChangeText={(text) => {
                                    setLoginData((prev) => ({
                                        ...prev,
                                        email: text,
                                    }));
                                    validateEmail(text);
                                }}
                                error={emailError}
                                placeholder="juandelacruz@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <View className="relative">
                                <InputField
                                    label="Password"
                                    value={loginData.password}
                                    onChangeText={(text) => {
                                        setLoginData((prev) => ({
                                            ...prev,
                                            password: text,
                                        }));
                                        validatePassword(text);
                                    }}
                                    error={passwordError}
                                    placeholder="Your password"
                                    secureTextEntry={!passwordVisible}
                                    autoCapitalize="none"
                                    className="pr-10"
                                />
                                <TouchableOpacity
                                    onPress={togglePasswordVisibility}
                                    className="absolute right-5 top-16 -translate-y-1/2 transform"
                                >
                                    <Feather
                                        name={
                                            passwordVisible ? 'eye' : 'eye-off'
                                        }
                                        size={20}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>

                            {generalError && (
                                <Animated.Text
                                    className="text-center text-sm text-danger"
                                    entering={FadeInUp.duration(300)}
                                >
                                    {generalError}
                                </Animated.Text>
                            )}

                            <Button
                                pressableClassName={`mt-6 ${isTablet ? 'py-5' : ''}`}
                                label={isLoading ? 'Please wait...' : 'Login'}
                                onPress={handleLogin}
                            />
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
