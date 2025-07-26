import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { createCheckoutSession, manageSubscription, deleteAccount } from '../services/api';

export default function Profile() {
  const { user, signOut } = useUser();

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              console.error('Error signing out:', error);
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleUpgrade = async () => {
    try {
      const result = await createCheckoutSession('intensive'); // Default to intensive plan
      await Linking.openURL(result.url);
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      Alert.alert('Error', error.message || 'Failed to start upgrade process');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const result = await manageSubscription();
      await Linking.openURL(result.url);
    } catch (error: any) {
      console.error('Error opening billing portal:', error);
      Alert.alert('Error', error.message || 'Failed to open billing portal');
    }
  };

  const handleDeleteAccount = () => {
    if (user.subscriptionStatus === 'pro') {
      Alert.alert(
        'Cannot Delete Account',
        'Please cancel your subscription before deleting your account.'
      );
      return;
    }

    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure you want to delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      await signOut();
                    } catch (error: any) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', error.message || 'Failed to delete account');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: 'Sedentary',
      low_active: 'Low Active',
      active: 'Active',
      very_active: 'Very Active',
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getPlanTypeText = (plan: string) => {
    const plans = {
      steady: 'Steady',
      intensive: 'Intensive',
      accelerated: 'Accelerated',
    };
    return plans[plan as keyof typeof plans] || plan;
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.profileItem}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );

  const MenuButton = ({ 
    icon, 
    title, 
    onPress, 
    color = '#333',
    showArrow = true 
  }: { 
    icon: string; 
    title: string; 
    onPress: () => void; 
    color?: string;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuButtonLeft}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.menuButtonText, { color }]}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.subscriptionBadge}>
          <Text style={styles.subscriptionText}>
            {user.subscriptionStatus === 'pro' ? 'PRO' : 'FREE'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection title="Personal Information">
          <ProfileItem label="Gender" value={user.gender === 'male' ? 'Male' : 'Female'} />
          <ProfileItem label="Height" value={`${user.heightCm} cm`} />
          <ProfileItem label="Current Weight" value={`${user.currentWeightKg} kg`} />
          <ProfileItem label="Target Weight" value={`${user.targetWeightKg} kg`} />
          <ProfileItem label="Activity Level" value={getActivityLevelText(user.activityLevel)} />
        </ProfileSection>

        <ProfileSection title="Nutrition Plan">
          <ProfileItem label="Plan Type" value={getPlanTypeText(user.planType)} />
          <ProfileItem label="Daily Calorie Target" value={`${user.dailyCalorieTarget} calories`} />
        </ProfileSection>

        <ProfileSection title="Subscription">
          <MenuButton
            icon="card"
            title="Manage Subscription"
            onPress={handleManageSubscription}
          />
          {user.subscriptionStatus === 'free' && (
            <MenuButton
              icon="star"
              title="Upgrade to Pro"
              onPress={handleUpgrade}
              color="#007AFF"
            />
          )}
        </ProfileSection>

        <ProfileSection title="App">
          <MenuButton
            icon="star"
            title="Rate App"
            onPress={() => Alert.alert('Info', 'App store rating would open here.')}
          />
          <MenuButton
            icon="share"
            title="Invite Friends"
            onPress={() => Alert.alert('Info', 'Share functionality would open here.')}
          />
          <MenuButton
            icon="language"
            title="Language"
            onPress={() => Alert.alert('Info', 'Language selection would open here.')}
          />
        </ProfileSection>

        <ProfileSection title="Legal">
          <MenuButton
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => Alert.alert('Info', 'Privacy policy would open here.')}
          />
          <MenuButton
            icon="document-text"
            title="Terms & Conditions"
            onPress={() => Alert.alert('Info', 'Terms & conditions would open here.')}
          />
        </ProfileSection>

        <ProfileSection title="Account">
          <MenuButton
            icon="log-out"
            title="Sign Out"
            onPress={handleSignOut}
            color="#FF6B6B"
            showArrow={false}
          />
          <MenuButton
            icon="trash"
            title="Delete Account"
            onPress={handleDeleteAccount}
            color="#FF3B30"
            showArrow={false}
          />
        </ProfileSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subscriptionBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileLabel: {
    fontSize: 16,
    color: '#333',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
});
