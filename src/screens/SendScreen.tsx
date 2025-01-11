import { View, Text, Animated, Easing, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTCP } from '../services/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil';
import dgram from 'react-native-udp';
import LinearGradient from 'react-native-linear-gradient';
import { sendStyles } from '../styles/sendStyles';
import LottieView from 'lottie-react-native';
import Icons from '../components/global/Icons';
import BreakerText from '../components/ui/BreakerText';
import { Colors, screenWidth } from '../utils/Constants';
import QRScannerModel from '../components/models/QRScannerModel';


const deviceNames = ['Oppo', 'Vivo X1', 'Redmi', 'Samsung', 'OnePlus', 'Apple', 'Realme', 'Nokia', 'Sony', 'LG', 'Google', 'Motorola', 'Lenovo', 'HTC', 'Huawei']

export default function SendScreen() {
    const { connectToServer, isConnected } = useTCP();
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [nearbyDevices, setNearbyDevices] = useState<any[]>([]);


    useEffect(() => {
        if (isConnected) {
            navigate('ConnectionScreen');
        }
    }, [isConnected])

    useEffect(() => {
        let udpServer: any;
        const setupServer = async () => {
            udpServer = await listenForDevices();
        }
        setupServer();

        return () => {
            if (udpServer) {
                udpServer.close(() => {
                    console.log("UPD Server closed");
                })
            }
            setNearbyDevices([]);
        }
    },[])



    const handelScan = (data: any) => {
        const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
        const [host, port] = connectionData.split(':');
        connectToServer(host, parseInt(port, 10), deviceName);
    }

    const listenForDevices = async () => {
        const server = dgram.createSocket({
            type: 'udp4',
            reusePort: true
        });
        const port = 57143;
        server.bind(port, () => {
            console.log('Listening for devices for nearby devices...');
        })
        server.on('message', (msg, rinfo) => {
            const [connectionData, otherDevice] = msg?.toString()?.replace('tcp://', '')?.split('|');
            setNearbyDevices((prevDevices) => {
                const deviceExists = prevDevices?.some(device => device?.name === otherDevice);
                if (!deviceExists) {
                    const newDevice = {
                        id: `${Date.now()}_${Math.random()}`,
                        name: otherDevice,
                        image: require('../assets/icons/device.jpg'),
                        fullAddress: msg?.toString(),
                        position: getRandomPosition(150, prevDevices?.map((d) => d.position), 50),
                        scale: new Animated.Value(0)
                    };

                    Animated.timing(newDevice.scale, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true
                    }).start();

                    return [...prevDevices, newDevice];
                }
                return prevDevices;
            })
        })
    }

    const getRandomPosition = (radius: number, exisitingPositions: { x: number, y: number }[], minDistance: number) => {
        let position: any;
        let isOverlapping;

        do {
            const angle = Math.random() * 360;
            const distance = Math.random() * (radius - 50) + 50;
            const x = distance * Math.cos((angle + Math.PI) / 180);
            const y = distance * Math.sin((angle + Math.PI) / 180);

            position = { x, y }
            isOverlapping = exisitingPositions.some((pos) => {
                const dx = pos.x - position.x;
                const dy = pos.y - position.y;
                return Math.sqrt(dx * dx + dy * dy) < minDistance;
            })
        } while (isOverlapping)

        return position;
    }

    const handleGoBack = () => {
        goBack();
    }



    return (
        <LinearGradient
            colors={['#FFFFFF', '#B689ED', '#A066E5']}
            style={sendStyles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />
            <View style={sendStyles.mainContainer}>
                <View style={sendStyles.infoContainer}>
                    <Icons name='search' iconFamily='Ionicons' size={40} color='#fff' />
                </View>

                <Text className='font-semibold text-white text-2xl mt-4 text-center'>
                    Looking for nearby devices...
                </Text>


                <Text className='text-white text-center mt-4 text-sm mx-4'>
                    Ensure your device's Hotspot is active and the receiver is connected to the same network.
                </Text>

                <BreakerText text="or" />

                <TouchableOpacity style={sendStyles.qrButton} onPress={() => setIsScannerVisible(true)}>
                    <Icons name='qrcode-scan' iconFamily='MaterialCommunityIcons' color={Colors.primary} size={16} />
                    <Text className='font-bold' style={{ color: Colors.primary }}>
                        Scan QR Code
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={sendStyles.animationContainer}>
                <View style={sendStyles.lottieContainer}>
                    <LottieView
                        style={sendStyles.lottie}
                        source={require('../assets/animations/scanner.json')}
                        autoPlay
                        loop={true}
                        hardwareAccelerationAndroid
                    />

                    {
                        nearbyDevices?.map((device) => {
                            return (
                                <Animated.View
                                    key={device?.id}
                                    style={[
                                        sendStyles.deviceDot,
                                        {
                                            transform: [{ scale: device?.scale }],
                                            left: screenWidth / 2.33 + device?.position?.x,
                                            top: screenWidth / 2.33 + device?.position?.y
                                        }
                                    ]}
                                >
                                    <TouchableOpacity onPress={() => handelScan(device?.fullAddress)}>
                                        <Image source={device?.image} style={sendStyles.deviceImage} />

                                        <Text numberOfLines={1} className='text-gray-800 text-xs' style={sendStyles.deviceText}>
                                            {device?.name}
                                        </Text>
                                    </TouchableOpacity>

                                </Animated.View>
                            );
                        })
                    }

                </View>
                <Image source={require('../assets/images/profile.jpeg')} style={sendStyles.profileImage} />
            </View>

            <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
                <Icons name='arrow-back' iconFamily='Ionicons' size={16} color='#000' />
            </TouchableOpacity>

            {isScannerVisible && (
                <QRScannerModel visible={isScannerVisible} onClose={() => setIsScannerVisible(false)} />
            )}
        </LinearGradient>
    )
}