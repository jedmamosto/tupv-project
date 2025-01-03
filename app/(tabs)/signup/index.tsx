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
        idNumber: '',
    });

    const [error, setError] = useState(''); // make errors here per data

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setError('Please enter a valid email address');
        } else {
            setError('');
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
                    validateEmail(text);
                }}
                error={error}
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
                error={error}
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
                }}
                error={error}
                placeholder="Your password"
                keyboardType="visible-password"
                autoCapitalize="none"
                helperText="Enter your registered password"
            />
            <InputField
                label="ID Number"
                value={signUpData.idNumber}
                onChangeText={(text) => {
                    setSignUpData((prev) => ({ ...prev, idNumber: text }));
                }}
                error={error}
                placeholder="Your ID Number"
                keyboardType="default"
                autoCapitalize="none"
                helperText="Enter your ID Number"
            />
            <Button
                pressableClassName="mt-4"
                label="Sign Up"
                onPress={() => console.log('the button is pressed')}
            />
        </View>
    );
}
