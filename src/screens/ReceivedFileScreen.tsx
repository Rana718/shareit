import { View, Platform, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import RNFS from 'react-native-fs'
import Icons from '../components/global/Icons'
import { sendStyles } from '../styles/sendStyles'
import { connectionStyles } from '../styles/connectionStyles'
import CustomText from '../components/global/CustomText'
import { Colors } from '../utils/Constants'
import { formatFileSize } from '../utils/librayHelpers'
import { goBack } from '../utils/NavigationUtil'
import ReactNativeBlobUtil from 'react-native-blob-util'


export default function ReceivedFileScreen() {
    const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getFilesFromDirectory = async () => {
        setIsLoading(true);
        const plaformPath = Platform.OS === 'android'
            ? `${RNFS.DownloadDirectoryPath}/`
            : `${RNFS.DocumentDirectoryPath}/`;

        try {
            const exists = await RNFS.exists(plaformPath);
            if (!exists) {
                setReceivedFiles([]);
                setIsLoading(false);
                return;
            }

            const files = await RNFS.readDir(plaformPath);

            const formattedFiles = files.map(file => ({
                id: file.name,
                name: file.name,
                size: file.size,
                url: file.path,
                mimeType: file.name.split('.').pop() || 'unknown',
            }));

            setReceivedFiles(formattedFiles);
        } catch (error) {
            console.log('Error', error);
            setReceivedFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getFilesFromDirectory();
    }, []);

    const renderThumbnail = (mimeType: string) => {
        switch (mimeType) {
            case 'mp3':
                return <Icons name='musical-notes' size={16} color='blue' iconFamily='Ionicons' />
            case 'mp4':
                return <Icons name='videocam' size={16} color='green' iconFamily='Ionicons' />
            case 'jpg':
                return <Icons name='image' size={16} color='orange' iconFamily='Ionicons' />
            case 'pdf':
                return <Icons name='document' size={16} color='red' iconFamily='Ionicons' />
            default:
                return <Icons name='folder' size={16} color='gray' iconFamily='Ionicons' />
        }
    };

    const handelGoBack = () => {
        goBack();
    }

    const renderItem = ({ item }: any) => (
        <View style={connectionStyles.fileItem}>
            <View style={connectionStyles.fileInfoContainer}>
                {renderThumbnail(item.mimeType)}
                <View style={connectionStyles.fileDetails}>
                    <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={10}>
                        {item.name}
                    </CustomText>
                    <CustomText numberOfLines={1} fontFamily='Okra-Medium' fontSize={8}>
                        {item.mimeType} . {formatFileSize(item.size)}
                    </CustomText>
                </View>
            </View>

            <TouchableOpacity
                style={connectionStyles.openButton}
                onPress={() => {
                    const normalizedPath = Platform.OS === 'ios' ? `file://${item?.url}` : item?.url;

                    if (Platform.OS === 'ios') {
                        ReactNativeBlobUtil.ios.openDocument(normalizedPath)
                            .then(() => console.log('File Opened'))
                            .catch((error: any) => console.log('Error Opening File:', error));
                    } else {
                        ReactNativeBlobUtil.android.actionViewIntent(normalizedPath, "*/*")
                            .then(() => console.log('File Opened'))
                            .catch((error: any) => console.log('Error Opening File:', error));
                    }
                }}
            >
                <CustomText numberOfLines={1} color='#fff' fontFamily='Okra-Bold' fontSize={9}>
                    Open
                </CustomText>
            </TouchableOpacity>
        </View>
    )


    return (
        <LinearGradient 
            colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
            style={sendStyles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView/>

            <View style={sendStyles.mainContainer}>
                <CustomText fontFamily='Okra-Bold' fontSize={15} color='#fff' style={{ textAlign: 'center', marginTop: 60 }}>
                    All Received Files
                </CustomText>

                {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                ): receivedFiles.length > 0 ?(
                    <View className='flex-1'>
                        <FlatList
                            data={receivedFiles}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={connectionStyles.fileList}
                        />
                    </View>
                ):(
                    <View style={connectionStyles.noDataContainer}>
                        <CustomText numberOfLines={1} fontFamily='Okra-Medium' fontSize={11}>
                            No files received yet
                        </CustomText>
                    </View>
                )}

                <TouchableOpacity onPress={handelGoBack} style={sendStyles.backButton}>
                    <Icons name='arrow-back' iconFamily='Ionicons' size={16} color='#000'/>
                </TouchableOpacity>
            </View>

        </LinearGradient>
    )
}