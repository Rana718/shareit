import React from 'react';
import { Text, Platform, StyleSheet, StyleProp, TextStyle, TextProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/Constants';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';
type PlatformType = 'android' | 'ios';

interface CustomTextProps extends TextProps {
    variant?: Variant;
    fontFamily?: 'Okra-Bold' | 'Okra-Regular' | 'Okra-Medium' | 'Okra-Light' | 'Okra-Black';
    fontSize?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    numberOfLines?: number;
}

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
    h1: { android: 24, ios: 22 },
    h2: { android: 22, ios: 20 },
    h3: { android: 20, ios: 18 },
    h4: { android: 18, ios: 16 },
    h5: { android: 16, ios: 14 },
    h6: { android: 12, ios: 10 },
    h7: { android: 10, ios: 9 },
};

export default function CustomText({
    variant,
    fontFamily = 'Okra-Regular',
    fontSize,
    color,
    style,
    children,
    numberOfLines,
    onLayout,
    ...props
}: CustomTextProps) {
    const platform: PlatformType = Platform.OS as PlatformType;

    const computedFontSize = RFValue(
        fontSize || (variant ? fontSizeMap[variant][platform] : 12)
    );

    return (
        <Text
            onLayout={onLayout}
            style={[
                styles.text,
                { color: color || Colors.text, fontSize: computedFontSize, fontFamily },
                style,
            ]}
            numberOfLines={numberOfLines}
            {...props}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
    },
});
