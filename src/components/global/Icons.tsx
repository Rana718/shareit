import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';


interface IconsProps {
    color?: string;
    size: number;
    name: string;
    iconFamily: "Ionicons" | "MaterialIcons" | "MaterialCommunityIcons";
}

export default function Icons({ color, size, name, iconFamily }: IconsProps) {
    return (
        <>
            {iconFamily === "MaterialIcons" && <MaterialIcons name={name} size={RFValue(size)} color={color} />}
            {iconFamily === "MaterialCommunityIcons" && <MaterialCommunityIcons name={name} size={RFValue(size)} color={color} />}
            {iconFamily === "Ionicons" && <Ionicons name={name} size={RFValue(size)} color={color} />}
        </>
    )
}