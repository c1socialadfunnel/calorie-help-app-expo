import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

const { width } = Dimensions.get('window');

const welcomeScreens = [
  {
    icon: 'restaurant',
    title: 'Smart Meal Planning',
    description: 'Get personalized meal recommendations based on your goals and preferences.',
  },
  {
    icon: 'camera',
    title: 'AI Food Analysis',
    description: 'Simply take a photo of your meal and let AI analyze the nutritional content.',
  },
  {
    icon: 'chatbubble',
    title: 'AI Health Coach',
    description: '24/7 nutrition guidance from your personal AI health coach.',
  },
];

export default function WelcomeScreens() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    if (currentScreen < welcomeScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      nextStep(); // This will now go to the auth screen
    }
  };

  const handleSkip = () => {
    nextStep(); // This will now go to the auth screen
  };

  const screen = welcomeScreens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={screen.icon as any} size={80} color="#007AFF" />
        </View>

        <Text style={styles.title}>{screen.title}</Text>
        <Text style={styles.description}>{screen.description}</Text>

        <View style={styles.pagination}>
          {welcomeScreens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentScreen ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentScreen === welcomeScreens.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    backgroundColor: '#e0e0e0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
