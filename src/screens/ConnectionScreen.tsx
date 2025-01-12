import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTCP } from '../services/TCPProvider';
import Icons from '../components/global/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { sendStyles } from '../styles/sendStyles';
import { connectionStyles } from '../styles/connectionStyles';
import CustomText from '../components/global/CustomText';
import { resetAndNavigate } from '../utils/NavigationUtil';
import Options from '../components/home/Options';
import { formatFileSize } from '../utils/librayHelpers';
import { Colors } from '../utils/Constants';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default function ConnectionScreen() {

    const { connectedDevice, disconnect, sendFileAck, sentFiles, receivedFiles, totalReceivedBytes, totalSentBytes, isConnected } = useTCP();

    const [activeTab, setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');

    const renderThumbnail = (mineType: string) => {
        switch (mineType) {
            case '.mp3':
                return <Icons name='musical-notes' size={16} color='blue' iconFamily='Ionicons' />
            case '.mp4':
                return <Icons name='videocam' size={16} color='red' iconFamily='Ionicons' />
            case '.jpg':
                return <Icons name='image' size={16} color='green' iconFamily='Ionicons' />
            case '.pdf':
                return <Icons name='document' size={16} color='red' iconFamily='Ionicons' />
            default:
                return <Icons name='folder' size={16} color='gray' iconFamily='Ionicons' />
        }
    }

    const onMediaPickeUp = (image: any)=>{
        console.log('Picked Image:', image);
        sendFileAck(image, 'image');
    }

    const onFilePickedUp = (file: any) =>{
        console.log('picked File:', file);
        sendFileAck(file, 'file');
    }

    const handelTabChange = (tab: 'SENT' | 'RECEIVED') =>{
        setActiveTab(tab);
    }

    const renderItem = ({ item }: any) =>{
        return(
            <View style={connectionStyles.fileItem}>
                <View style={connectionStyles.fileInfoContainer}>
                    {renderThumbnail(item.mineType)}
                    <View style={connectionStyles?.fileDetails}>
                        <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={10}>
                            {item?.name}
                        </CustomText>
                        <CustomText>
                            {item?.mineType} . {formatFileSize(item?.size)}
                        </CustomText>
                    </View>
                </View>

                { item?.available ? (
                        <TouchableOpacity
                            style={connectionStyles.openButton}
                            onPress={()=>{
                                const normalizedPath = Platform.OS === 'ios' ? `file://${item?.url}` : item?.url;

                                if(Platform.OS === 'ios'){
                                    ReactNativeBlobUtil.ios.openDocument(normalizedPath)
                                        .then(()=> console.log('File Opened'))
                                        .catch((error: any)=> console.log('Error Opening File:', error));
                                }else{
                                    ReactNativeBlobUtil.android.actionViewIntent(normalizedPath, "*/*")
                                        .then(()=> console.log('File Opened'))
                                        .catch((error: any)=> console.log('Error Opening File:', error));
                                }
                            }}
                        >
                            <CustomText numberOfLines={1} color='#fff' fontFamily='Okra-Bold' fontSize={9}>
                                Open
                            </CustomText>
                        </TouchableOpacity>
                    ):(
                        <ActivityIndicator size='small' color={Colors.primary}/>
                    )

                }

            </View>
        )
    }



    useEffect(() => {
        if(!isConnected){
            resetAndNavigate('HomeScreen');
        }
    },[isConnected])




    return (
        <LinearGradient
            colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
            style={sendStyles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />

            <View style={sendStyles.mainContainer}>
                <View style={connectionStyles.container}>
                    <View style={connectionStyles.connectionContainer}>

                        <View style={{ width: '55%' }}>

                            <CustomText numberOfLines={1} fontFamily='Okra-Medium'>
                                connected with
                            </CustomText>
                            <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={14}>
                                {connectedDevice || 'Unknown Device'}
                            </CustomText>

                            <TouchableOpacity onPress={() => disconnect()} style={connectionStyles.disconnectButton}>
                                <Icons name='remove-circle' size={12} iconFamily='Ionicons' />
                                <CustomText numberOfLines={1} fontFamily='Okra-Bold'>
                                    Disconnect
                                </CustomText>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <Options onMediaPickUp={onMediaPickeUp} onFilePickeUp={onFilePickedUp}/>

                    <View style={connectionStyles.fileContainer}>
                        <View style={connectionStyles.sendReceiveButton}>
                            <View style={connectionStyles.sendReceiveButtonContainer}>
                                <TouchableOpacity
                                    onPress={()=> handelTabChange('SENT')}
                                    style={[connectionStyles.sendReceiveButton, activeTab === 'SENT' ? connectionStyles.activeButton : connectionStyles.inactiveButton]}
                                >
                                    <Icons name='cloud-upload' size={12} color={activeTab === 'SENT' ? '#fff' : 'blue'} iconFamily='Ionicons'/>
                                    <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={9} color={activeTab === 'SENT' ? '#fff': '#000'}>
                                        Sent
                                    </CustomText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={()=> handelTabChange('RECEIVED')}
                                    style={[connectionStyles.sendReceiveButton, activeTab === 'SENT' ? connectionStyles.activeButton : connectionStyles.inactiveButton]}
                                >
                                    <Icons name='cloud-upload' size={12} color={activeTab === 'SENT' ? '#fff' : 'blue'} iconFamily='Ionicons'/>
                                    <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={9} color={activeTab === 'SENT' ? '#fff': '#000'}>
                                        Received
                                    </CustomText>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <CustomText fontFamily='Okra-Bold' fontSize={9}>
                                    {formatFileSize((activeTab === 'SENT' ? totalSentBytes : totalReceivedBytes) || 0)}
                                </CustomText>

                                <CustomText fontFamily='Okra-Bold' fontSize={12}>/</CustomText>

                                <CustomText fontFamily='Okra-Bold' fontSize={10}>
                                    {activeTab === 'SENT' ?
                                        formatFileSize(sentFiles.reduce((total: number, file: any) => total + file.size, 0)) :
                                        formatFileSize(receivedFiles.reduce((total: number, file: any) => total + file.size, 0))
                                    }
                                </CustomText>
                            </View>
                        </View>
                        
                        {(activeTab === 'SENT' ? sentFiles.length : receivedFiles.length) > 0 ? (
                            <FlatList
                                data={activeTab === 'SENT' ? sentFiles : receivedFiles}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={connectionStyles.fileList}
                            />
                        ):(
                            <View style={connectionStyles.noDataContainer}>
                                <CustomText numberOfLines={1} fontFamily='Okra-Medium' fontSize={12}>
                                    {activeTab === 'SENT'
                                        ? "No files sent yet."
                                        : "No files received yet."
                                    }
                                </CustomText>
                            </View>
                        )}

                    </View>

                </View>

                <TouchableOpacity onPress={()=> resetAndNavigate('HomeScreen')} style={sendStyles.backButton}>
                    <Icons name='arrow-back' iconFamily='Ionicons' size={16}/>
                </TouchableOpacity>

            </View>
        </LinearGradient>
    )
}