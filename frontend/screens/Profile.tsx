import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '../context/UserContext';
import Navigation from '../components/layout/Navigation';
import { LogOut, Star, Share, Globe, Shield, FileText, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useUser();
  const { toast } = useToast();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: 'Coming Soon',
      description: `${feature} feature will be available in a future update.`,
    });
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

  const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );

  const MenuButton = ({ 
    icon: Icon, 
    title, 
    onClick, 
    variant = 'default' 
  }: { 
    icon: any; 
    title: string; 
    onClick: () => void; 
    variant?: 'default' | 'destructive';
  }) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start h-auto py-3 px-4 ${
        variant === 'destructive' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {title}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {user.subscriptionStatus === 'pro' ? 'PRO' : 'FREE'}
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ProfileItem label="Gender" value={user.gender === 'male' ? 'Male' : 'Female'} />
              <ProfileItem label="Height" value={`${user.heightCm} cm`} />
              <ProfileItem label="Current Weight" value={`${user.currentWeightKg} kg`} />
              <ProfileItem label="Target Weight" value={`${user.targetWeightKg} kg`} />
              <ProfileItem label="Activity Level" value={getActivityLevelText(user.activityLevel)} />
            </CardContent>
          </Card>

          {/* Nutrition Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ProfileItem label="Plan Type" value={getPlanTypeText(user.planType)} />
              <ProfileItem label="Daily Calorie Target" value={`${user.dailyCalorieTarget} calories`} />
            </CardContent>
          </Card>

          {/* App Features */}
          <Card>
            <CardHeader>
              <CardTitle>App</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MenuButton
                icon={Star}
                title="Rate App"
                onClick={() => handleFeatureClick('Rate App')}
              />
              <MenuButton
                icon={Share}
                title="Invite Friends"
                onClick={() => handleFeatureClick('Invite Friends')}
              />
              <MenuButton
                icon={Globe}
                title="Language"
                onClick={() => handleFeatureClick('Language')}
              />
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle>Legal</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MenuButton
                icon={Shield}
                title="Privacy Policy"
                onClick={() => handleFeatureClick('Privacy Policy')}
              />
              <MenuButton
                icon={FileText}
                title="Terms & Conditions"
                onClick={() => handleFeatureClick('Terms & Conditions')}
              />
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MenuButton
                icon={LogOut}
                title="Sign Out"
                onClick={handleSignOut}
              />
              <MenuButton
                icon={Trash2}
                title="Delete Account"
                onClick={() => handleFeatureClick('Delete Account')}
                variant="destructive"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
