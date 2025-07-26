import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Linking, Alert } from 'react-native';

import { UserProvider } from './src/context/UserContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingFlow from './src/screens/OnboardingFlow';
import Dashboard from './src/screens/Dashboard';
import AIFoodLogger from './src/screens/AIFoodLogger';
import AICoach from './src/screens/AICoach';
import Profile from './src/screens/Profile';
import { useUser } from './src/context/UserContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AI Coach') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="AI Coach" component={AICoach} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    // Handle deep links for Stripe payment redirects
    const handleDeepLink = (url: string) => {
      if (url.includes('payment-success')) {
        Alert.alert(
          'Payment Successful!',
          'Your subscription has been activated. Welcome to Calorie.Help Pro!',
          [{ text: 'Continue', style: 'default' }]
        );
      } else if (url.includes('payment-cancel')) {
        Alert.alert(
          'Payment Cancelled',
          'Your payment was cancelled. You can try again anytime.',
          [{ text: 'OK', style: 'default' }]
        );
      } else if (url.includes('billing-return')) {
        Alert.alert(
          'Billing Updated',
          'Your billing information has been updated.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    };

    // Handle app opened from deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : !user ? (
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="AIFoodLogger" 
            component={AIFoodLogger}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <OnboardingProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </OnboardingProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
