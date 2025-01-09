import { View, Text } from 'react-native';
import React from 'react';

interface BreakerTextProps {
    text: string;
}

export default function BreakerText({ text }: BreakerTextProps) {
    return (
        <View className='flex-row items-center justify-center my-5 w-[100%] px-12'>
            <View className='flex-1 h-0.5 bg-gray-300' />
            <Text className='mx-2 text-xl font-semibold text-white text-center opacity-75'>{text}</Text>
            <View className='flex-1 h-0.5 bg-gray-300' />
        </View>
    );
}
