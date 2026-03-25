import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, SignupScreen, HomeScreen, AccountSettingsScreen, RegisterSchoolScreen, QuickAccessScreen, SchoolPlaceholderScreen } from '../screens';
import { initDb } from '../../db/connection';
import { AuthProvider } from '../contexts';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  AccountSettings: undefined;
  RegisterSchool: undefined;
  QuickAccess: { schoolId: number };
  Staffs: { schoolId: number };
  Students: { schoolId: number };
  Assets: { schoolId: number };
  Invoices: { schoolId: number };
  Classes: { schoolId: number };
  Settings: { schoolId: number };
  SchoolPlaceholder: { moduleName: string; schoolId?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDb();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbInitialized(true);
      }
    };

    initialize();
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="RegisterSchool" component={RegisterSchoolScreen} />
          <Stack.Screen name="QuickAccess" component={QuickAccessScreen} />
          <Stack.Screen name="Staffs" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="Students" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="Assets" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="Invoices" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="Classes" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="Settings" component={SchoolPlaceholderScreen} />
          <Stack.Screen name="SchoolPlaceholder" component={SchoolPlaceholderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AppNavigator;
