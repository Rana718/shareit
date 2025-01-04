import { View, Text, Image } from 'react-native'
import React from 'react'
import CustomText from '../global/CustomText'

export default function Misc() {
    return (
        <View className='py-5'>
            <CustomText fontSize={13} fontFamily='Okra-Bold'>Explore</CustomText>
            <Image className='w-[100%] h-[120px] rounded-[10px] my-6' resizeMode='cover' source={require('../../assets/icons/wild_robot.jpg')}/>
        </View>
    )
}


