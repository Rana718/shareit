import { View, Modal, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { modalStyles } from '../../styles/modalStyles';
import CustomText from '../global/CustomText';
import Icons from '../global/Icons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import QRCode from 'react-native-qrcode-svg';
import { multiColor } from '../../utils/Constants';
import { getLocalIPAddress } from '../../utils/networkUtils';
import { useTCP } from '../../services/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';


interface QRScannerModelProps {
    visible: boolean;
    onClose: () => void;
}

export default function QRSGenerateModel({ visible, onClose }: QRScannerModelProps) {
    const { isConnected, startServer, server } = useTCP();
    const [loading, setLoading] = useState(true)
    const [qrValue, setQRValue] = useState('')
    const shimmerTranslatex = useSharedValue(-300)

    const shimmerStyle = useAnimatedStyle(()=>({
        transform: [{translateX: shimmerTranslatex.value}]
    }))

    const setupServer = async () =>{
        const deviceName = await DeviceInfo.getDeviceName();
        const ip = await getLocalIPAddress();
        const port = 4000;

        if(server){
            setQRValue(`tcp://${ip}:${port}|${deviceName}`)
            setLoading(false)
            return
        }

        startServer(port)
        setQRValue(`tcp://${ip}:${port}|${deviceName}`)
        console.log('Server Info:', `tcp://${ip}:${port}|${deviceName}`)
        setLoading(false);
    }

    useEffect(()=>{
        shimmerTranslatex.value = withRepeat(
            withTiming(300, { duration: 150, easing: Easing.linear }),
            -1,
            false
        )

        if(visible){
            setLoading(true)
            setupServer()
        }

    }, [visible])

    useEffect(()=>{
        console.log('TCPProvider: isConnected:', isConnected);
        if(isConnected){
            onClose()
            navigate('ConnectionScreen')
        }
    })


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

                    { loading || qrValue == null || qrValue == "" ? (
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
                            <QRCode
                                value={qrValue}
                                size={250}
                                logoSize={60}
                                logoBackgroundColor='#fff'
                                logoMargin={2}
                                logoBorderRadius={10}
                                logo={require('../../assets/images/profile.jpeg')}
                                linearGradient={multiColor}
                                enableLinearGradient={true}
                            />
                        </>
                    )}

                </View>

                <View style={modalStyles.info}>
                    <CustomText style={modalStyles.infoText1}>
                        Ensure you're on the same network with the sender
                    </CustomText>
                    <CustomText>
                        Ask the sender to scan this QR code to connect and teansfer files.
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