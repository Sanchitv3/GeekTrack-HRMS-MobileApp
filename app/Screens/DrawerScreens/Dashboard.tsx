import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Dashboard = () => {
  return (
    <View style={styles.Main}>
      <Text>Dashboard</Text>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  Main:{
    marginTop:120
  }
})