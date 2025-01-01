import { View, Text } from 'react-native'
import InputField from '../../../components/custom/InputField'
import { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(text)) {
            setEmailError('Please enter a valid email address')
        } else {
            setEmailError('')
        }
    }
    return (
        <View className="flex h-screen w-screen flex-col items-center justify-center bg-light p-6">
            <InputField
                label="Email Address"
                value={email}
                onChangeText={(text) => {
                    setEmail(text)
                    validateEmail(text)
                }}
                error={emailError}
                placeholder="juandelacruz@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                helperText="Enter your registered email"
            />
            <InputField
                label="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text)
                }}
                error={passwordError}
                placeholder="Your password"
                keyboardType="visible-password"
                autoCapitalize="none"
                helperText="Enter your registered password"
            />
        </View>
    )
}
