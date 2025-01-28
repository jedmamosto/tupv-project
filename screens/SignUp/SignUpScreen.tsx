import {
    View,
    Text,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import InputField from '@/components/custom/InputField';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/custom/Button';
import QRPermissions from '@/components/QRScanner/QRPermissionsModal';
import { signUpWithEmailPassword } from '@/lib/firebase/auth';
import { router } from 'expo-router';

export default function SignUpScreen() {
    const { width } = useWindowDimensions();
    const isTablet = width > 768;
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
        idNumber: '',
        scannedIdNumber: '',
    });

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [idNumberError, setIdNumberError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleInputFocus = useCallback(() => setIsKeyboardFocused(true), []);
    const handleInputBlur = useCallback(() => setIsKeyboardFocused(false), []);
    const handleModalStateChange = (state: boolean) => setIsModalVisible(state);

    // useEffect(() => {
    //     if (route.params?.scannedId) {
    //         setSignUpData((prev) => ({
    //             ...prev,
    //             scannedIdNumber: route.params?.scannedId || '',
    //         }));
    //         verifyIdMatch();
    //     }
    // }, [route.params?.scannedId]);

    const validateName = (text: string): boolean => {
        if (!text.trim()) {
            setNameError('Name is required');
            return false;
        }
        if (text.trim().length < 2) {
            setNameError('Name must be at least 2 characters');
            return false;
        }
        setNameError('');
        return true;
    };

    const validateEmail = (text: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(text);
        setEmailError(isValid ? '' : 'Please enter a valid email address');
        return isValid;
    };

    const validatePassword = (
        password: string,
        confirmPassword?: string
    ): boolean => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const validateIdNumber = (text: string): boolean => {
        const idPattern = /^TUPV-[0-9]{2}-[0-9]{4}$/;
        const isValid = idPattern.test(text);
        setIdNumberError(isValid ? '' : 'ID must follow format: TUPV-YY-NNNN');
        return isValid;
    };

    const verifyIdMatch = (): boolean => {
        if (!signUpData.idNumber && !signUpData.scannedIdNumber) {
            setIdNumberError('Please enter and scan your ID number');
            return false;
        }

        if (!signUpData.idNumber) {
            setIdNumberError('Please enter your ID number manually');
            return false;
        }

        if (!signUpData.scannedIdNumber) {
            setIdNumberError('Please scan your ID QR code');
            return false;
        }

        if (signUpData.idNumber !== signUpData.scannedIdNumber) {
            setIdNumberError('Manual ID and scanned ID do not match');
            return false;
        }

        setIdNumberError('');
        return true;
    };

    const validateAllInputs = (): boolean => {
        const isNameValid = validateName(signUpData.name);
        const isEmailValid = validateEmail(signUpData.email);
        const isPasswordValid = validatePassword(
            signUpData.password,
            signUpData.confirmedPassword
        );
        const isIdValid = validateIdNumber(signUpData.idNumber);
        const isIdMatching = verifyIdMatch();

        return (
            isNameValid &&
            isEmailValid &&
            isPasswordValid &&
            isIdValid &&
            isIdMatching
        );
    };

    const handleQRScanComplete = (scannedId: string) => {
        setSignUpData((prev) => ({
            ...prev,
            scannedIdNumber: scannedId,
        }));
        setTimeout(() => {
            verifyIdMatch();
        }, 300);
    };

    const handleSignUp = async () => {
        if (!validateAllInputs()) return;

        try {
            setIsLoading(true);
            setGeneralError('');

            const response = await signUpWithEmailPassword({
                name: signUpData.name,
                email: signUpData.email,
                password: signUpData.password,
                idNumber: signUpData.idNumber,
            });

            if (response.success) {
                setSignUpData({
                    name: '',
                    email: '',
                    password: '',
                    confirmedPassword: '',
                    idNumber: '',
                    scannedIdNumber: '',
                });
                // navigation.navigate('Home');
            } else {
                setGeneralError(
                    response.error || 'An error occurred during sign up'
                );
            }
        } catch (err) {
            setGeneralError('An unexpected error occurred. Please try again');
        } finally {
            setIsLoading(false);
            router.push('/(customer)/home');
        }
    };

    const containerWidth = isTablet ? Math.min(width * 0.6, 600) : '100%';

    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar
                barStyle={
                    Platform.OS === 'ios' ? 'dark-content' : 'light-content'
                }
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="h-full flex-1"
                keyboardVerticalOffset={
                    Platform.OS === 'ios' ? (isTablet ? 40 : 20) : 0
                }
            >
                <ScrollView
                    contentContainerClassName={`
                        flex-1 min-h-screen items-center
                        ${isKeyboardFocused ? 'justify-start pt-4' : 'justify-center'}
                        ${isTablet ? 'px-8' : 'px-6'}
                    `}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={{ width: containerWidth }}>
                        {(!isKeyboardFocused || isTablet) && (
                            <Text className="mb-6 text-center text-4xl font-bold text-primary">
                                Sign Up
                            </Text>
                        )}

                        <InputField
                            label="Name"
                            value={signUpData.name}
                            onChangeText={(text) => {
                                setSignUpData((prev) => ({
                                    ...prev,
                                    name: text,
                                }));
                                validateName(text);
                            }}
                            error={nameError}
                            placeholder="Juan De La Cruz"
                            keyboardType="default"
                            autoCapitalize="words"
                            helperText="Enter your full name"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <InputField
                            label="Email Address"
                            value={signUpData.email}
                            onChangeText={(text) => {
                                setSignUpData((prev) => ({
                                    ...prev,
                                    email: text,
                                }));
                                validateEmail(text);
                            }}
                            error={emailError}
                            placeholder="juandelacruz@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            helperText="Enter an email"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <InputField
                            label="Password"
                            value={signUpData.password}
                            onChangeText={(text) => {
                                setSignUpData((prev) => ({
                                    ...prev,
                                    password: text,
                                }));
                                validatePassword(text);
                            }}
                            error={passwordError}
                            placeholder="Your password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            helperText="Enter a password"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <InputField
                            label="Confirm Password"
                            value={signUpData.confirmedPassword}
                            onChangeText={(text) => {
                                setSignUpData((prev) => ({
                                    ...prev,
                                    confirmedPassword: text,
                                }));
                                validatePassword(signUpData.password, text);
                            }}
                            error={passwordError}
                            placeholder="Repeat your password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            helperText="Confirm your password"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <InputField
                            label="ID Number"
                            value={signUpData.idNumber}
                            onChangeText={(text) => {
                                const formatted = text.toUpperCase();
                                setSignUpData((prev) => ({
                                    ...prev,
                                    idNumber: formatted,
                                }));
                                validateIdNumber(formatted);
                            }}
                            error={idNumberError}
                            placeholder="TUPV-##-####"
                            keyboardType="default"
                            autoCapitalize="none"
                            helperText="Enter your ID Number"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <View
                            className={`flex w-full flex-row justify-center ${isTablet ? 'space-x-4' : 'space-x-2'}`}
                        >
                            <InputField
                                containerClass={`${isTablet ? 'w-3/4' : 'w-2/3'} pr-2`}
                                label="Confirm ID Number"
                                value={signUpData.scannedIdNumber}
                                error={idNumberError}
                                editable={false}
                                placeholder="Scan result will show here"
                                keyboardType="default"
                                autoCapitalize="none"
                                helperText="Scan your ID to confirm"
                            />

                            <Button
                                pressableClassName={`${isTablet ? 'w-1/4' : 'w-1/3'} min-h-12`}
                                type="secondary"
                                label="Scan ID"
                                onPress={() => setIsModalVisible(true)}
                            />
                        </View>

                        {generalError && (
                            <Text className="mt-2 text-center text-sm text-danger">
                                {generalError}
                            </Text>
                        )}

                        <Button
                            pressableClassName={`mt-6 ${isTablet ? 'py-5' : ''}`}
                            label={isLoading ? 'Please wait...' : 'Sign Up'}
                            onPress={handleSignUp}
                        />

                        {(!isKeyboardFocused || isTablet) && (
                            <>
                                <Text className="mt-4 text-center font-bold text-primary-200">
                                    OR
                                </Text>
                                <Button
                                    type="secondary"
                                    pressableClassName={`mt-4 ${isTablet ? 'py-5' : ''}`}
                                    label="Go to Login"
                                    onPress={() => router.push('/(auth)/login')}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <QRPermissions
                    onModalStateChange={handleModalStateChange}
                    onScanComplete={handleQRScanComplete}
                />
            </Modal>
        </SafeAreaView>
    );
}
