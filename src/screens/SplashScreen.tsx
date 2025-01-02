import { View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { navigate } from '../utils/NavigationUtil'
import { commonStyles } from '../styles/commonStyles'

export default function SplashScreen() {

    useEffect(() => {
        const timeout = setTimeout(navigateToHome, 1500)
        return () => clearTimeout(timeout)
    }, [])

    const navigateToHome = () => {
        navigate('Home')
    }

    return (
        <View style={commonStyles.container}>
            <Image 
                style={commonStyles.img}
                source={require('../assets/images/logo_text.png')}
            />
        </View>
    )
}