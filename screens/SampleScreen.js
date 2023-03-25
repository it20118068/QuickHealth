import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React,{useEffect, useState} from "react";
import Header from "../components/Header";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native";
import { TextInput } from "react-native";

function SampleScreen({navigation}) {


    useEffect(() => {
        
    }, []);


    return ( 
        <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={{flex:1}}>

            {/* Add Screen Title */}
            <Header title={"Screen Title"} navigation={navigation} />

            <View style={{flex:0.9}}>
          
               {/* Your Design */}


            </View>
           
        </ImageBackground>
        
     );
}

export default SampleScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor:'#54C1FF',
      justifyContent:"center",
      alignItems:"center",
    },
    

  });