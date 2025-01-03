import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { homeHeaderStyles } from '../../styles/homeHeaderStyles'
import { commonStyles } from '../../styles/commonStyles'
import Icons from '../global/Icons'


export default function HomeHeader() {
    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView/>
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
                <TouchableOpacity>
                    <Icons iconFamily='Ionicons' name='menu' size={22} color='#fff'/>
                </TouchableOpacity>
                <Image 
                    source={require('../../assets/images/logo_t.png')}
                    style={homeHeaderStyles.logo}
                />
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/images/profile.jpeg')}
                        style={homeHeaderStyles.profile}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}