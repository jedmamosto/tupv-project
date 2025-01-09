import { View, Text, ScrollView, Modal } from 'react-native';
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

    const [isModalVisible, setIsModalVisible] = useState(false);

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
        <ScrollView className="flex-1 bg-light p-6">
            <View className="flex-1 items-center justify-center">
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

                        if (
                            formatted.length === 4 &&
                            !formatted.includes('-')
                        ) {
                            formatted += '-';
                        } else if (
                            formatted.length === 7 &&
                            formatted.split('-').length === 2
                        ) {
                            formatted += '-';
                        }

                        setSignUpData((prev) => ({
                            ...prev,
                            idNumber: formatted,
                        }));
                        validateIdNumber(formatted);
                    }}
                    error={idNumberError}
                    placeholder="Your ID Number"
                    keyboardType="default"
                    autoCapitalize="none"
                    helperText="Enter your ID Number"
                />
                <View className="flex w-full flex-row items-center gap-2 self-start">
                    <InputField
                        containerClass="w-2/3"
                        label="Confirm ID Number"
                        value={''} // TODO: should be changed to result from the QR Scan
                        onChangeText={(text) => {
                            let formatted = text.toUpperCase();

                            if (
                                formatted.length === 4 &&
                                !formatted.includes('-')
                            ) {
                                formatted += '-';
                            } else if (
                                formatted.length === 7 &&
                                formatted.split('-').length === 2
                            ) {
                                formatted += '-';
                            }

                            setSignUpData((prev) => ({
                                ...prev,
                                idNumber: formatted,
                            }));
                            validateIdNumber(formatted);
                        }}
                        error={idNumberError} // TODO: Align Validation
                        editable={false}
                        placeholder="Scan result will show here"
                        keyboardType="default"
                        autoCapitalize="none"
                        helperText="Scan your ID to confirm"
                    />
                    {/* TODO: Add QR Scanner modal here to confirm ID number*/}
                    <Modal visible={isModalVisible}>
                        <View className="flex-1 p-6">
                            <Text>Hello World</Text>
                            <Button
                                pressableClassName=""
                                label="Go back"
                                onPress={() => setIsModalVisible(false)}
                            />
                        </View>
                    </Modal>
                    <Button
                        pressableClassName="w-1/3 h-12"
                        type="secondary"
                        label="Scan Your ID"
                        onPress={() => {
                            console.log('the button modal is pressed');
                            setIsModalVisible(true);
                        }}
                    />
                </View>
                <Button
                    pressableClassName="mt-4"
                    label="Sign Up"
                    // TODO: Add final validations upon press
                    onPress={() => console.log('the button is pressed')}
                />
            </View>
        </ScrollView>
    );
}
