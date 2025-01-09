import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { screenHeight } from '../../utils/Constants'
import { navigate } from '../../utils/NavigationUtil'

export default function SendReceiveButton() {

    return (
        <View className='flex-row justify-evenly' style={{marginTop: screenHeight*0.04}}>
            <TouchableOpacity className='w-[140px] h-[120px] rounded-[10px] overflow-hidden'
                onPress={() => navigate('SendScreen')}
            >
                <Image className='w-[100%] h-[100%]' source={require('../../assets/icons/send1.jpg')} resizeMode='cover'/>
            </TouchableOpacity>

            <TouchableOpacity className='w-[140px] h-[120px] rounded-[10px] overflow-hidden'
                onPress={() => navigate('ReceiveScreen')}
            >
                <Image className='w-[100%] h-[100%]' source={require('../../assets/icons/receive1.jpg')} resizeMode='cover'/>
            </TouchableOpacity>
        </View>
    )
}