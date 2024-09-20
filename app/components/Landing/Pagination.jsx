import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Dot from './Dot'

const   Pagination = ({data,buttonVal}) => {
  return (
    <View style={[styles.paginationContainer]}>
          {data.map((_, index) => {
              return <Dot index={index} buttonVal={buttonVal} key={index}/>
        })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    paginationContainer: {
        position: 'absolute',
        bottom: 70,
        flexDirection: 'row',
        marginHorizontal: 5,
        borderRadius: 5,
    }
})