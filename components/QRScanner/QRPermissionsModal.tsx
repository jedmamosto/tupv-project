import { useState } from "react"
import { View, Text, Modal, StatusBar, TouchableOpacity } from "react-native"
import { Button } from "../custom/Button"
import { useCameraPermissions } from "expo-camera"
import { SafeAreaView } from "react-native-safe-area-context"
import QRScannerModal from "./QRScannerModal"
import { LinearGradient } from "expo-linear-gradient"
import { ArrowLeft } from "react-native-feather"

interface QRPermissionsModalProps {
  onModalStateChange: (state: boolean) => void
  onScanComplete: (scannedId: string) => void
}

const QRPermissionsModal = ({ onModalStateChange, onScanComplete }: QRPermissionsModalProps) => {
  const [permission, requestPermission] = useCameraPermissions()
  const isPermissionGranted = Boolean(permission?.granted)
  const [isScannerModalVisible, setIsScannerModalVisible] = useState(false)

  const handleSuccessfulScan = (scannedData: string) => {
    setIsScannerModalVisible(false)

    setTimeout(() => {
      onScanComplete(scannedData)
      onModalStateChange(false)
    }, 500)
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#3d5300" />
      <LinearGradient colors={["#3d5300", "#5a7d00", "#7da900"]} className="absolute h-full w-full" />
      <View className="bg-primary pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => onModalStateChange(false)} className="mr-4">
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Scan Your ID QR Code</Text>
      </View>
      <View className="flex-1 justify-between p-6">
        <View>
          {!isPermissionGranted ? (
            <Button label="Request Camera Access" onPress={requestPermission} pressableClassName="mb-4" />
          ) : (
            <Button label="Scan QR Code" onPress={() => setIsScannerModalVisible(true)} pressableClassName="mb-4" />
          )}
        </View>
      </View>
      <Modal
        visible={isScannerModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsScannerModalVisible(false)}
      >
        <QRScannerModal onScanComplete={handleSuccessfulScan} onScannerModalStateChange={setIsScannerModalVisible} />
      </Modal>
    </SafeAreaView>
  )
}

export default QRPermissionsModal

