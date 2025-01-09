import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from '../screens/SplashScreen'
import HomeScreen from '../screens/HomeScreen'
import { navigationRef } from '../utils/NavigationUtil'
import { TCPProvider } from '../services/TCPProvider'
import ConnectionScreen from '../screens/ConnectionScreen'
import SendScreen from '../screens/SendScreen'
import ReceiveScreen from '../screens/ReceiveScreen'
import ReceivedFileScreen from '../screens/ReceivedFileScreen'


const Stack = createNativeStackNavigator()

export default function Navigation() {
    return (
        <TCPProvider>
            <NavigationContainer ref={navigationRef}>

                <Stack.Navigator
                    initialRouteName='Splash'
                    screenOptions={{
                        headerShown: false
                    }}
                >

                    <Stack.Screen name='Splash' component={SplashScreen} />
                    <Stack.Screen name='Home' component={HomeScreen} />
                    <Stack.Screen name='ConnectionScreen' component={ConnectionScreen}/>
                    <Stack.Screen name='SendScreen' component={SendScreen}/>
                    <Stack.Screen name='ReceiveScreen' component={ReceiveScreen}/>
                    <Stack.Screen name='ReceivedFileScreen' component={ReceivedFileScreen}/>


                </Stack.Navigator>

            </NavigationContainer>
        </TCPProvider>
    )
}