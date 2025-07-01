import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PatientDashboard from '../screens/patient/PatientDashboard';
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';
import DoctorAppointmentsScreen from '../screens/doctor/DoctorAppointmentsScreen';
import DoctorPrescriptionsScreen from '../screens/doctor/DoctorPrescriptionsScreen';
import DoctorPatientRecordsScreen from '../screens/doctor/DoctorPatientRecordsScreen';
import DoctorMessagesScreen from '../screens/doctor/DoctorMessagesScreen';
import BookAppointment from '../screens/patient/BookAppointment';
import MyAppointments from '../screens/patient/MyAppointments';
import Prescriptions from '../screens/patient/Prescriptions';
import LabResults from '../screens/patient/LabResults';
import Payments from '../screens/patient/Payments';
import ManageUsers from '../screens/admin/ManageUsers';
import AddUser from '../screens/admin/AddUser';
import HospitalConfig from '../screens/admin/HospitalConfig';
import Departments from '../screens/admin/Departments';
import AllAppointments from '../screens/admin/AllAppointments';
import RevenueReports from '../screens/admin/RevenueReports';
import UserAnalytics from '../screens/admin/UserAnalytics';
import AppointmentAnalytics from '../screens/admin/AppointmentAnalytics';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="DoctorAppointmentsScreen" component={DoctorAppointmentsScreen} />
        <Stack.Screen name="DoctorPrescriptionsScreen" component={DoctorPrescriptionsScreen} />
        <Stack.Screen name="DoctorPatientRecordsScreen" component={DoctorPatientRecordsScreen} />
        <Stack.Screen name="DoctorMessagesScreen" component={DoctorMessagesScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointment} />
        <Stack.Screen 
          name="MyAppointments" 
          component={MyAppointments} 
          options={{ headerShown: true }} // Ensure header is visible
        />
        <Stack.Screen name="Prescriptions" component={Prescriptions} />
        <Stack.Screen name="LabResults" component={LabResults} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="HospitalConfig" component={HospitalConfig} />
        <Stack.Screen name="Departments" component={Departments} />
        <Stack.Screen name="AllAppointments" component={AllAppointments} />
        <Stack.Screen name="RevenueReports" component={RevenueReports} />
        <Stack.Screen name="UserAnalytics" component={UserAnalytics} />
        <Stack.Screen name="AppointmentAnalytics" component={AppointmentAnalytics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
