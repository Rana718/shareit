import { View, Text, Image } from 'react-native'
import React from 'react'
import { commonStyles } from '../../styles/commonStyles'

export default function Misc() {
    return (
        <View className='py-5'>
            <Text className='text-xl font-bold text-left'>Explore</Text>
            <Image className='w-[100%] h-[120px] rounded-[10px] my-5' resizeMode='cover' source={require('../../assets/icons/wild_robot.jpg')}/>

            <View style={commonStyles.flexRowBetween}>
                <Text className='text-lg text-left opacity-50 w-[60%]'>
                    #1 World Best File Sharing App! Share your files with friends and family. Share your files with friends and family. Share your files with friends and family.
                </Text>
                <Image className='h-[120px] w-[35%]' resizeMode='contain' source={require('../../assets/icons/share_logo.jpg')}/>
            </View>

            <Text className='text-lg text-left font-bold my-5'>
                Made With ❤️ by - DRP
            </Text>
        </View>
    )
}


