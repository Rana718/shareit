import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { optionStyles } from '../../styles/optionsStyles';
import Icons from '../global/Icons';
import { Colors } from '../../utils/Constants';
import CustomText from '../global/CustomText';
import { useTCP } from '../../services/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';
import { pickDocument, pickImage } from '../../utils/librayHelpers';


interface OptionsProps {
    isHome?: boolean;
    onMediaPickUp?: (media: any) => void;
    onFilePickeUp?: (file: any) => void;
}

export default function Options({isHome, onMediaPickUp, onFilePickeUp}: OptionsProps) {
    const { isConnected } = useTCP();

    const handleUniversePicker = async (type: string) => {
        if(isHome){
            if(isConnected){
                navigate("ConnectionScreen")
            }else{
                navigate("HomeScreen")
            }
            return
        }
        if(type === 'image' && onMediaPickUp){
            pickImage(onMediaPickUp)
        }
        if(type === 'file' && onFilePickeUp){
            pickDocument(onFilePickeUp)
        }
    }


    return (
        <View style={optionStyles.container}>
            <TouchableOpacity style={optionStyles.subContainer} onPress={() => handleUniversePicker('image')}>
                <Icons name='images' iconFamily='Ionicons' color={Colors.primary} size={20}/>
                <CustomText fontFamily='Okra-Medium' className='mt-1 text-center'>Photo</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={optionStyles.subContainer} onPress={() => handleUniversePicker('image')}>
                <Icons name='musical-notes-sharp' iconFamily='Ionicons' color={Colors.primary} size={20}/>
                <CustomText fontFamily='Okra-Medium' className='mt-1 text-center'>Audio</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={optionStyles.subContainer} onPress={() => handleUniversePicker('image')}>
                <Icons name='folder-open' iconFamily='Ionicons' color={Colors.primary} size={20}/>
                <CustomText fontFamily='Okra-Medium' className='mt-1 text-center'>Files</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={optionStyles.subContainer} onPress={() => handleUniversePicker('image')}>
                <Icons name='contacts' iconFamily='MaterialCommunityIcons' color={Colors.primary} size={20}/>
                <CustomText fontFamily='Okra-Medium' className='mt-1 text-center'>Contacts</CustomText>
            </TouchableOpacity>
        </View>
    )
}