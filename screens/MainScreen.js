import { View } from "react-native";
import React,{useEffect, useState} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DoctorsScreen from "./DoctorsScreen";
import StaffScreen from "./StaffScreen";
import SampleScreen from "./SampleScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddPrescription from "./Doctor/AddPriscription";
import Prescriptions from "./Doctor/Prescriptions";
import UserStatScreen from "./UserStatScreen";
import DoctorsListView from "./Patient/DoctorsListView";
import PatientReport from "./Patient/PatientReport";
import MyChannelings from "./Patient/MyChannelings";
import LabTestRequests from "./Staff/LabTestRequests";
import ChannellingRequest from "./Staff/ChannellingRequest";
import CreateSchedule from "./Staff/CreateSchedule";
import ViewChannlReq from "./Doctor/ViewChannlReq";




const Tab = createBottomTabNavigator();

function MainScreen({navigation}) {
 
  const[role, setRole] = useState(1);

  useEffect(()=>{
      readAsyncStorage();
      if(role == null){
        navigation.navigate('LoginScreen');
      }
  },[])

  async function readAsyncStorage() {
    setRole(await AsyncStorage.getItem('role'))
  }

 
    return (
        <>

        {/* Admin */}
        {role == 0 &&
          <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle:{
                backgroundColor:'#003d4d',
            }
            }} >
            <Tab.Screen
              name="Doctors"
              component={DoctorsScreen}
              options={{
                tabBarLabel: 'Doctors',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="doctor" color={color}  size={26} />
                ),
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
              }}
            />
            <Tab.Screen
              name="Staff"
              component={StaffScreen}
              options={{
                tabBarLabel: 'Staff',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="view-list" color={color} size={26} />
                ),
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
              }}
            />
            {/* <Tab.Screen
              name="Stat"
              component={UserStatScreen}
              options={{
                tabBarLabel: 'Stat',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="chart-arc" color={color} size={26} />
                ),
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
              }}
            /> */}
          </Tab.Navigator>
          }

          {/* Doctor */}
          {role == 1 &&
            <Tab.Navigator 
            screenOptions={{
              headerShown: false, 
              tabBarStyle:{
                  backgroundColor:'#003d4d',
              }
              }} >
              <Tab.Screen
                name="Prescriptions"
                component={Prescriptions}
                options={{
                  tabBarLabel: 'Prescriptions',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="view-list" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
              <Tab.Screen
                name="Channelings"
                component={ViewChannlReq}
                options={{
                  tabBarLabel: 'Channelings',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="medical-bag" color={color} size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
            </Tab.Navigator>
          }

          {role == 2 &&
            <Tab.Navigator 
            screenOptions={{
              headerShown: false, 
              tabBarStyle:{
                  backgroundColor:'#003d4d',
              }
              }} >
              <Tab.Screen
                name="Channelings"
                component={ChannellingRequest}
                options={{
                  tabBarLabel: 'Channelings',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="medical-bag" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
              <Tab.Screen
                name="Tests"
                component={LabTestRequests}
                options={{
                  tabBarLabel: 'Tests',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="test-tube" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
              <Tab.Screen
                name="Schedules"
                component={CreateSchedule}
                options={{
                  tabBarLabel: 'Schedules',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="av-timer" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
            </Tab.Navigator>
          }


          {role == 3 &&
            <Tab.Navigator 
            screenOptions={{
              headerShown: false, 
              tabBarStyle:{
                  backgroundColor:'#003d4d',
              }
              }} >
              <Tab.Screen
                name="Doctors"
                component={DoctorsListView}
                options={{
                  tabBarLabel: 'Doctors',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="doctor" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
              <Tab.Screen
                name="Reports"
                component={PatientReport}
                options={{
                  tabBarLabel: 'Reports',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="test-tube" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
              <Tab.Screen
                name="Channelings"
                component={MyChannelings}
                options={{
                  tabBarLabel: 'Channelings',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="medical-bag" color={color}  size={26} />
                  ),
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'gray',
                }}
              />
            </Tab.Navigator>
          }
          
        </> 
     );
}

export default MainScreen;