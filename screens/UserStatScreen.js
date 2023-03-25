import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from "../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";
import { PieChart } from 'react-native-svg-charts';
import UserPieChart from "../components/UserPieChart";




function UserStatScreen({navigation}) {
    const data = {
        doctors: 10,
        customers: 50,
        employees: 20,
      };


      

    useEffect(() => {
        
    }, []);


    return ( 
        <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>

            {/* Add Screen Title */}
            <Header title={"Users Stats"} navigation={navigation} />

            <View style={{flex:0.9}}>
          
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UserPieChart data={data} />
    </View>

            </View>
           
        </ImageBackground>
        
     );
}

export default UserStatScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    

  });