import {
    ScrollView,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import InputField from '../../../components/custom/InputField';
import { useState } from 'react';
import { Button } from '@/components/custom/Button';

export default function Login() {
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setError(true);
        } else {
            setError(false);
        }
        validateInputs();
    };

    const validateInputs = () => {
        if (!email || password.length < 8) {
            setError(true);
        } else {
            setError(false);
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar barStyle="default" />
            <KeyboardAvoidingView className="flex-1 p-6">
                <ScrollView contentContainerClassName="flex-1 items-center justify-center">
                    {/* TEMPORARY */}
                    <View className="p-6">
                        <Image
                            source={require('@/assets/images/grubly-logo.png')}
                            contentFit="fill"
                            style={{ width: 200, height: 200 }}
                        />
                    </View>

                    <InputField
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        placeholder="juandelacruz@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        helperText="Enter your registered email"
                    />
                    <InputField
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                        placeholder="Your password"
                        keyboardType="default"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        helperText="Enter your registered password"
                    />
                    {error ? (
                        <Text className="mt-1 text-sm text-danger">
                            Invalid email or password. Please check your
                            credentials and try again.
                        </Text>
                    ) : null}
                    <Button
                        pressableClassName="mt-4"
                        label="Login"
                        onPress={() => {
                            console.log('the button is pressed');
                            validateEmail(email);
                        }}
                    />
                    <Text className="mt-4 font-bold text-primary-200">OR</Text>
                    <Button
                        type="secondary"
                        pressableClassName="mt-4"
                        label="Sign Up"
                        onPress={() => {
                            console.log('the button is pressed');
                            validateEmail(email);
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
