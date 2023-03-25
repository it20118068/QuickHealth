import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DoctorsScreen from './screens/DoctorsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/MainScreen';
import StaffScreen from './screens/StaffScreen';
import SampleScreen from './screens/SampleScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import AdminProfileScreen from './screens/AdminProfileScreen';
import AddPrescription from './screens/Doctor/AddPriscription';
import Prescriptions from './screens/Doctor/Prescriptions';
import EditPrescription from './screens/Doctor/EditPrescription';
import DoctorsListView from './screens/Patient/DoctorsListView';
import PatientPrescription from './screens/Patient/PatientPrescription';
import PatientScreen from './screens/Patient/PatientScreen';
import PatientBooking from './screens/Patient/PatientBooking';
import PatientReport from './screens/Patient/PatientReport';
import DoctorsProfile from './screens/Doctor/DoctorsProfile';
import MakeReportRequest from './screens/Patient/MakeReportRequest';
import EditRequest from './screens/Patient/EditRequest';
import MyChannelings from './screens/Patient/MyChannelings';
import LabTestRequests from './screens/Staff/LabTestRequests';
import ChannellingRequest from './screens/Staff/ChannellingRequest';
import CreateSchedule from './screens/Staff/CreateSchedule';
import ViewChannlReq from './screens/Doctor/ViewChannlReq';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>
    <StatusBar hidden={true}/>

    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} >

          {/* Shashika */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />  
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> 
          <Stack.Screen name="MainScreen" component={MainScreen} /> 
          <Stack.Screen name="AdminProfileScreen" component={AdminProfileScreen} /> 
          <Stack.Screen name="DoctorScreen" component={DoctorsScreen} /> 
          <Stack.Screen name="StaffScreen" component={StaffScreen} />  
          <Stack.Screen name="DoctorsListView" component={DoctorsListView} /> 
          <Stack.Screen name="PatientBooking" component={PatientBooking} /> 

          {/* Tharuka */}
          <Stack.Screen name="AddPrescription" component={AddPrescription} /> 
          <Stack.Screen name="EditPrescription" component={EditPrescription} /> 
          <Stack.Screen name="ViewPrescriptions" component={Prescriptions} /> 
          <Stack.Screen name="ViewChannlReq" component={ViewChannlReq} /> 

          {/* Punsisi */}
          <Stack.Screen name="LabTestRequests" component={LabTestRequests} />
          <Stack.Screen name="ChannellingRequest" component={ChannellingRequest} />
          <Stack.Screen name="CreateSchedule" component={CreateSchedule} />

          {/* Bhashitha */}
          <Stack.Screen name="PatientPrescription" component={PatientPrescription} /> 
          <Stack.Screen name="PatientReport" component={PatientReport} /> 
          <Stack.Screen name="PatientScreen" component={PatientScreen} /> 
          <Stack.Screen name="DoctorsProfile" component={DoctorsProfile} /> 
          <Stack.Screen name="MakeReportRequest" component={MakeReportRequest} /> 
          <Stack.Screen name="EditRequest" component={EditRequest} /> 
          <Stack.Screen name="MyChannelings" component={MyChannelings} /> 



          <Stack.Screen name="SampleScreen" component={SampleScreen} /> 
        </Stack.Navigator> 
    </NavigationContainer>  
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
