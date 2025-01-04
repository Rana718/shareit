import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'
import SendReceiveButton from '../components/home/SendReceiveButton'
import Options from '../components/home/Options'
import Misc from '../components/home/Misc'

export default function HomeScreen() {
    return (
        <View style={commonStyles.baseContainer}>
            <HomeHeader/>

            <ScrollView className='pb-[100px] p-4' showsVerticalScrollIndicator={false}>
                <SendReceiveButton/>

                <Options/>
                <Misc/>
            </ScrollView>

            
        </View>
    )
}