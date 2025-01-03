import { View, Text } from 'react-native'
import React from 'react'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'

export default function HomeScreen() {
    return (
        <View style={commonStyles.baseContainer}>
            <HomeHeader/>
        </View>
    )
}