import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { homeHeaderStyles } from '../../styles/homeHeaderStyles'
import { commonStyles } from '../../styles/commonStyles'
import Icons from '../global/Icons'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { screenHeight, screenWidth, svgPath } from '../../utils/Constants'


export default function HomeHeader() {
    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView/>
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
                <TouchableOpacity>
                    <Icons iconFamily='Ionicons' name='menu' size={28} color='#fff'/>
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

            <Svg
                height={screenHeight*0.18}
                width={screenWidth}
                viewBox='0 0 1440 220'
                style={homeHeaderStyles.curve}
            >
                <Defs>
                    <LinearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                        <Stop offset='0' stopColor='#007AFF' stopOpacity='1'/>
                        <Stop offset='1' stopColor='#80BFFF' stopOpacity='1'/>
                    </LinearGradient>
                </Defs>

                <Path fill='#80BFFF' d={svgPath}/>
                <Path fill='url(#grad)' d={svgPath}/>

            </Svg>
        </View>
    )
}