import {
    ScrollView,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import InputField from '@/components/custom/InputField';
import { useState } from 'react';
import { Button } from '@/components/custom/Button';
import {
    LoginScreenNavigationProp,
    LoginScreenProps,
} from '@/types/navigations';

export default function LoginScreen({ navigation }: LoginScreenProps) {
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

    const validateInputs = (): boolean => {
        if (!email || password.length < 8) {
            setError(true);
            return false;
        } else {
            setError(false);
            return true;
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-light">
            <StatusBar barStyle="default" />
            <KeyboardAvoidingView className="flex-1 p-6">
                <ScrollView contentContainerClassName="min-h-screen flex-1 items-center justify-center">
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
                            validateInputs();
                            if (validateInputs()) navigation.navigate('Home');
                        }}
                    />
                    <Text className="mt-4 font-bold text-primary-200">OR</Text>
                    <Button
                        type="secondary"
                        pressableClassName="mt-4"
                        label="Sign Up"
                        onPress={() => {
                            console.log('the button is pressed');

                            navigation.navigate('SignUp');
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
