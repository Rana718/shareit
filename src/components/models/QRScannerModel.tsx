import { View, Modal, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { modalStyles } from '../../styles/modalStyles';
import CustomText from '../global/CustomText';
import Icons from '../global/Icons';
import { Camera, CodeScanner, useCameraDevice } from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';


interface QRScannerModelProps {
    visible: boolean;
    onClose: () => void;
}

export default function QRScannerModel({ visible, onClose }: QRScannerModelProps) {

    const [loading, setLoading] = useState(true)
    const [codeFound, setCodeFound] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)
    const device = useCameraDevice('back') as any
    const shimmerTranslatex = useSharedValue(-300)

    const shimmerStyle = useAnimatedStyle(()=>({
        transform: [{translateX: shimmerTranslatex.value}]
    }))

    useEffect(()=>{
        const checkPermission = async () => {
            const cameraPermission = await Camera.requestCameraPermission();
            setHasPermission(cameraPermission === 'granted')
        }
        checkPermission()
        if(visible){
            setLoading(true)
            const timer = setTimeout(()=>setLoading(false), 400)
            return ()=> clearTimeout(timer)
        }
    },[visible])

    useEffect(()=>{
        shimmerTranslatex.value = withRepeat(
            withTiming(300, { duration: 150, easing: Easing.linear }),
            -1,
            false
        )
    }, [shimmerTranslatex])


    const handelScan = (data: any) => {
        const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
        const [host, port] = connectionData?.split(':');
        console.log(host, port, deviceName)
    }

    const codeScanner = useMemo<CodeScanner>(()=>({
        codeTypes: ['qr', 'codabar'],
        onCodeScanned: (codes)=>{
            if(codeFound){
                return
            }
            console.log(`Scanned code: ${codes?.length} codes!`)
            if(codes?.length > 0){
                const scannedCode = codes[0].value;
                console.log(scannedCode);
                setCodeFound(true)
                handelScan(scannedCode)
            }
        }
    }), [codeFound])

    return (
        <Modal
            animationType='slide'
            visible={visible}
            presentationStyle='formSheet'
            onRequestClose={onClose}
            onDismiss={onClose}
        >
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.qrContainer}>

                    { loading ? (
                        <View style={modalStyles.skeleton}>
                            <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}>
                                <LinearGradient
                                    colors={['#f3f3f3', '#fff', '#f3f3f3']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    style={modalStyles.shimmerGradient}
                                />
                            </Animated.View>
                        </View>
                    ):(
                        <>
                            { (!device || !hasPermission) ? (

                                <View style={modalStyles.skeleton}>
                                    <Image source={require('../../assets/images/no_camera.png')} style={modalStyles.noCameraImage}/>
                                </View>

                            ):(
                                <View style={modalStyles.skeleton}>
                                    <Camera
                                        style={modalStyles.camera}
                                        isActive={visible}
                                        device={device}
                                        codeScanner={codeScanner}
                                    />
                                </View>
                            )}
                        </>
                    )}

                </View>

                <View style={modalStyles.info}>
                    <CustomText style={modalStyles.infoText1}>
                        Ensure you're on the same network with the sender
                    </CustomText>
                    <CustomText>
                        Ask the receiver to show a QR code to connect and teansfer files.
                    </CustomText>
                </View>

                <ActivityIndicator size='small' color='#000' className='self-center'/>

                <TouchableOpacity onPress={()=>onClose()} style={modalStyles.closeButton}> 
                    <Icons name='close' iconFamily='Ionicons' size={24} color='#000'/>
                </TouchableOpacity>

            </View>

        </Modal>
    )
}