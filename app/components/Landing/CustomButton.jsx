import { StyleSheet, Text, View,TouchableWithoutFeedback, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import Animated, { interpolateColor, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';



const CustomButton = ({ handlerPress, buttonVal }) => {
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    
    const animatedColor = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(buttonVal.value, [0, SCREEN_HEIGHT, 2 * SCREEN_HEIGHT], ['#fd94b2', '#f8dac2', '#154f40']
        );
        return {
            backgroundColor: backgroundColor,
        }
    });
    

    const buttonAnimationStyle = useAnimatedStyle(() => {
        return {
            width:
                buttonVal.value === 2 * SCREEN_HEIGHT
                    ? withSpring(260)
                    : withSpring(120),
            height:
                buttonVal.value === 2 * SCREEN_HEIGHT
                    ? withSpring(80)
                    : withSpring(120),

        }
    });

    const arrowAnimationStyle = useAnimatedStyle(() => { 
        return {
            opacity: buttonVal.value === 2 * SCREEN_HEIGHT
            ? withTiming(0):withTiming(1),
            transform: [
                {
                    translateX: buttonVal.value === 2 * SCREEN_HEIGHT
                        ?withTiming(100):withTiming(0),
                    }]
        } 
    });

    const textAnimationStyle = useAnimatedStyle(() => { 
        return {
            opacity: buttonVal.value === 2 * SCREEN_HEIGHT
            ? withTiming(1):withTiming(0),
            transform: [
                {
                    translateX: buttonVal.value === 2 * SCREEN_HEIGHT
                        ?withTiming(0):withTiming(-100),
                    }]
        } 
    });

    return (
        <TouchableWithoutFeedback onPress={handlerPress}>
            <Animated.View style={[styles.container, animatedColor, buttonAnimationStyle]} >

                <Animated.Text style={[styles.textButton,textAnimationStyle]}>Get Started</Animated.Text>
                <Animated.Image style={[arrowAnimationStyle]} source={require('../../../assets/images/ArrowIcon.png')}/>
            </Animated.View>
      </TouchableWithoutFeedback>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1,
        bottom: 100,
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowRadius: 20,
    },
    textButton: {
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
    }
})