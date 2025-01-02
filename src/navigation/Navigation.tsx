import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from '../screens/SplashScreen'
import HomeScreen from '../screens/HomeScreen'
import { navigationRef } from '../utils/NavigationUtil'


const Stack = createNativeStackNavigator()

export default function Navigation() {
    return (
        <NavigationContainer ref={navigationRef}>

            <Stack.Navigator
                initialRouteName='Splash'
                screenOptions={{
                    headerShown: false
                }}
            >

                <Stack.Screen name='Splash' component={SplashScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />

            </Stack.Navigator>

        </NavigationContainer>
    )
}