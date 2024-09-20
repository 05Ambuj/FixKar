import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import Animated, { Extrapolation, interpolate, interpolateColor,useAnimatedStyle } from 'react-native-reanimated';

const Dot = ({ index, buttonVal }) => {
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    
    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(
            buttonVal.value,
            [
                (index - 1) * SCREEN_HEIGHT,
                (index) * SCREEN_HEIGHT,
                (index + 1) * SCREEN_HEIGHT   
            ],
            [10, 30, 10],
            Extrapolation.CLAMP
        )

        const opacityAnimation = interpolate(
            buttonVal.value,
            [
                (index - 1) * SCREEN_HEIGHT,
                (index) * SCREEN_HEIGHT,
                (index + 1) * SCREEN_HEIGHT   
            ],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        )

        return {
            width: widthAnimation,
            opacity: opacityAnimation
        }
    })


    const animatedColor = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor
            (buttonVal.value,
                [0, SCREEN_HEIGHT, 2 * SCREEN_HEIGHT],
                ['#fd94b2', '#f8dac2', '#154f40']
        );

        return {
            backgroundColor: backgroundColor,
        }
    });
    return <Animated.View style={[styles.dot,animatedColor,animatedDotStyle]}/>
}

export default Dot;

const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        
    },
})