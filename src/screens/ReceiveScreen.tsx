import { View, Text, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTCP } from '../services/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil';
import dgram from 'react-native-udp';
import LinearGradient from 'react-native-linear-gradient';
import { sendStyles } from '../styles/sendStyles';
import LottieView from 'lottie-react-native';
import Icons from '../components/global/Icons';
import BreakerText from '../components/ui/BreakerText';
import { Colors } from '../utils/Constants';
import QRScannerModel from '../components/models/QRScannerModel';
import DeviceInfo from 'react-native-device-info';
import { getBroadcastIPAddress, getLocalIPAddress } from '../utils/networkUtils';



export default function SendScreen() {
    const { startServer, server, isConnected } = useTCP();
    const [qrvalue, setQRValue] = useState('');
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(()=>{
        if(isConnected){
            navigate('ConnectionScreen');
        }
    }, [isConnected])

    useEffect(()=>{
        setupServer();
    },[])

    useEffect(()=>{
        if(!qrvalue) return;

        sendDiscoverySignal();
        intervalRef.current = setInterval(sendDiscoverySignal, 3000);

        return ()=>{
            if(intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    },[qrvalue])

    
    const setupServer = async () =>{
        const deviceName = await DeviceInfo.getDeviceName();
        const ip = await getLocalIPAddress();
        const port = 4000;

        if(!server){
            startServer(port)
        }
        
        setQRValue(`tcp://${ip}:${port}|${deviceName}`)
        console.log('Server Info:', `tcp://${ip}:${port}|${deviceName}`)
    }

    const sendDiscoverySignal = async()=>{
        const deviceName = await DeviceInfo.getDeviceName();
        const broadcastAddress = await getBroadcastIPAddress();
        const targetAddress = broadcastAddress || "255.255.255.255";
        const port = 57143;

        const client = dgram.createSocket({
            type: 'udp4',
            reusePort: true,
        })

        client.bind(()=>{
            try{
                if(Platform.OS === 'ios'){
                    client.setBroadcast(true);
                }
                client.send(`${qrvalue}`, 0, `${qrvalue}`.length, port, targetAddress, (err)=>{
                    if(err){
                        console.log('Error sending discovery signal:', err)
                    }else{
                        console.log('Discovery signal sent to:', targetAddress)
                        console.log("deviceName:", deviceName)
                    }
                    client.close();
                })
            }catch(err){
                console.log('Error sending discovery signal:', err)
            }
        })

    }

    const handleGoBack = ()=>{
        if(intervalRef.current){
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        goBack();
    }



    return (
        <LinearGradient
            colors={['#FFFFFF', '#4DA0DE', '#3387C5']}
            style={sendStyles.container}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
        >
            <SafeAreaView/>
            <View style={sendStyles.mainContainer}>
                <View style={sendStyles.infoContainer}>
                    <Icons name='blur' iconFamily='MaterialCommunityIcons' size={40} color='#fff'/>
                </View>

                <Text className='font-semibold text-white text-2xl mt-4 text-center'>
                    Receiving from nearby devices...
                </Text>


                <Text className='text-white text-center mt-4 text-sm mx-4'>
                    Ensure your device is connected to the same network as the device you want to connect to.
                </Text>

                <BreakerText text="or"/>

                <TouchableOpacity style={sendStyles.qrButton} onPress={()=>setIsScannerVisible(true)}>
                    <Icons name='qrcode' iconFamily='MaterialCommunityIcons' color={Colors.primary} size={16}/>
                    <Text className='font-bold' style={{color: Colors.primary}}>
                        Show QR Code
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={sendStyles.animationContainer}>
                <View style={sendStyles.lottieContainer}>
                    <LottieView
                        style={sendStyles.lottie}
                        source={require('../assets/animations/scan2.json')}
                        autoPlay
                        loop={true}
                        hardwareAccelerationAndroid
                    />

                </View>
                <Image source={require('../assets/images/profile.jpeg')} style={sendStyles.profileImage}/>
            </View>

            <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
                <Icons name='arrow-back' iconFamily='Ionicons' size={16} color='#000'/>
            </TouchableOpacity>

            {isScannerVisible && (
                <QRScannerModel visible={isScannerVisible} onClose={()=>setIsScannerVisible(false)}/>
            )}
        </LinearGradient>
    )
}