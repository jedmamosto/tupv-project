import { useState } from "react"
import {
  Text,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native"
import { Image } from "expo-image"
import InputField from "@/components/custom/InputField"
import { Button } from "@/components/custom/Button"
import { loginWithEmailPassword } from "@/lib/firebase/auth"
import { router } from "expo-router"
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

export default function LoginScreen() {
  const { width } = useWindowDimensions()
  const isTablet = width > 768
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")

  // Animation for the floating action button
  const fabScale = useSharedValue(1)
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
    }
  })

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, {}, () => {
      fabScale.value = withSpring(1)
    })
    router.push("/(auth)/signup")
  }

  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(text)
    setEmailError(isValid ? "" : "Please enter a valid email address")
    return isValid
  }

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateAllInputs = (): boolean => {
    const isEmailValid = validateEmail(loginData.email)
    const isPasswordValid = validatePassword(loginData.password)
    return isEmailValid && isPasswordValid
  }

  const handleLogin = async () => {
    if (!validateAllInputs()) return

    try {
      setIsLoading(true)
      setGeneralError("")

      const response = await loginWithEmailPassword(loginData.email, loginData.password)

      if (response.success) {
        setLoginData({
          email: "",
          password: "",
        })
        router.push("/(customer)/home")
      } else {
        setGeneralError(response.error || "An error occurred during login")
      }
    } catch (error) {
      setGeneralError("An unexpected error occurred. Please try again")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerWidth = isTablet ? Math.min(width * 0.6, 600) : "100%"

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
      <LinearGradient colors={["#3d5300", "#5a7d00", "#7da900"]} className="absolute h-full w-full" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? (isTablet ? 40 : 20) : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: isTablet ? 32 : 24,
            paddingVertical: isTablet ? 48 : 32,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Animated.View
            style={{ width: containerWidth }}
            entering={FadeInDown.duration(600)}
            layout={Layout.springify()}
            className="bg-white/90 rounded-3xl shadow-lg p-6"
          >
            <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-6">
              <Image
                source={require("@/assets/images/grubly-logo-nobg.png")}
                style={{ width: 120, height: 120 }}
                contentFit="contain"
              />
              <Text className="mt-4 text-3xl font-bold text-primary">Welcome Back</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} className="space-y-4">
              <InputField
                label="Email Address"
                value={loginData.email}
                onChangeText={(text) => {
                  setLoginData((prev) => ({ ...prev, email: text }))
                  validateEmail(text)
                }}
                error={emailError}
                placeholder="juandelacruz@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                helperText="Enter your email"
              />

              <InputField
                label="Password"
                value={loginData.password}
                onChangeText={(text) => {
                  setLoginData((prev) => ({ ...prev, password: text }))
                  validatePassword(text)
                }}
                error={passwordError}
                placeholder="Your password"
                secureTextEntry={true}
                autoCapitalize="none"
                helperText="Enter your password"
              />

              {generalError && (
                <Animated.Text className="text-center text-sm text-danger" entering={FadeInUp.duration(300)}>
                  {generalError}
                </Animated.Text>
              )}

              <Button
                pressableClassName={`mt-6 ${isTablet ? "py-5" : ""}`}
                label={isLoading ? "Please wait..." : "Login"}
                onPress={handleLogin}
              />
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View style={[fabAnimatedStyle, { position: "absolute", right: 20, bottom: 20 }]}>
        <TouchableOpacity onPress={handleFabPress} className="bg-white rounded-full p-4 shadow-lg">
          <Feather name="user-plus" size={24} color="#3d5300" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

