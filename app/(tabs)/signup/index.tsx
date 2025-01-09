import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import InputField from '../../../components/custom/InputField';
import { useState } from 'react';
import { Button } from '@/components/custom/Button';

export default function SignUp() {
    const [signUpData, setSignUpData] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
        idNumber: '',
    });

    const [confirmedMode, setConfirmedMode] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [idNumberError, setIdNumberError] = useState('');

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = (text: string) => {
        if (text.length < 8) {
            setPasswordError('Password must be at least 8 characters');
        } else {
            setPasswordError('');
        }
    };

    const passwordMatch = (password: string, confirmPassword: string) => {
        if (!confirmPassword) return;

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const validateIdNumber = (text: string) => {
        const idPattern = /^TUPV-[0-9]{2}-[0-9]{4}$/;

        if (!idPattern.test(text)) {
            setIdNumberError('ID must follow format: TUPV-YY-NNNN');
        } else {
            setIdNumberError('');
        }
    };

    return (
        <View className="flex h-screen w-screen flex-col items-center justify-center bg-light p-6">
            <Text className="mb-6 text-4xl font-bold text-primary">
                Sign Up
            </Text>
            <InputField
                label="Name"
                value={signUpData.name}
                onChangeText={(text) => {
                    setSignUpData((prev) => ({
                        ...prev,
                        name: text,
                    }));
                }}
                placeholder="Juan De La Cruz"
                keyboardType="default"
                autoCapitalize="words"
                helperText="Enter your registered email"
            />
            <InputField
                label="Email Address"
                value={signUpData.email}
                onChangeText={(text) => {
                    setSignUpData((prev) => ({ ...prev, email: text }));
                    validateEmail(text);
                }}
                error={emailError}
                placeholder="juandelacruz@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                helperText="Enter your registered email"
            />
            <InputField
                label="Password"
                value={signUpData.password}
                onChangeText={(text) => {
                    setSignUpData((prev) => ({ ...prev, password: text }));
                    validatePassword(text);
                }}
                error={passwordError}
                placeholder="Your password"
                secureTextEntry={true}
                autoCapitalize="none"
                helperText="Enter your registered password"
            />
            <InputField
                label="Confirm Password"
                value={signUpData.confirmedPassword}
                onChangeText={(text) => {
                    setSignUpData((prev) => ({
                        ...prev,
                        confirmedPassword: text,
                    }));
                    validatePassword(text);
                    passwordMatch(signUpData.password, text);
                }}
                error={passwordError}
                placeholder="Your password"
                secureTextEntry={true}
                autoCapitalize="none"
                helperText="Confirm your password"
            />
            <InputField
                label="ID Number"
                value={signUpData.idNumber}
                onChangeText={(text) => {
                    let formatted = text.toUpperCase();

                    if (formatted.length === 4 && !formatted.includes('-')) {
                        formatted += '-';
                    } else if (
                        formatted.length === 7 &&
                        formatted.split('-').length === 2
                    ) {
                        formatted += '-';
                    }

                    setSignUpData((prev) => ({ ...prev, idNumber: formatted }));
                    validateIdNumber(formatted);
                }}
                error={idNumberError}
                placeholder="Your ID Number"
                keyboardType="default"
                autoCapitalize="none"
                helperText="Enter your ID Number"
            />
            {/* TODO: Add QR Scanner here to confirm ID number*/}
            <Button
                pressableClassName="mt-4"
                label="Sign Up"
                // TODO: Add final validations upon press
                onPress={() => console.log('the button is pressed')}
            />
        </View>
    );
}
