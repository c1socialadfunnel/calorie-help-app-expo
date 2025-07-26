import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';
import { mockAnalyzeFood } from '../services/mockAI';

interface AnalysisResult {
  foodName: string;
  estimatedServingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: number;
  healthInsights: string[];
  ingredients: string[];
}

export default function AIFoodLogger() {
  const navigation = useNavigation();
  const { addFoodLog } = useUser();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [showCamera, setShowCamera] = useState(false);
  const [textDescription, setTextDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const cameraRef = useRef<Camera>(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setShowCamera(false);
        analyzeImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      // Mock AI analysis - in a real app, this would send the image to your AI service
      const result = await mockAnalyzeFood({ imageUri });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async () => {
    if (!textDescription.trim()) {
      Alert.alert('Error', 'Please enter a food description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await mockAnalyzeFood({ description: textDescription });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
      Alert.alert('Error', 'Failed to analyze description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const logFood = async () => {
    if (!analysisResult) return;

    try {
      await addFoodLog({
        foodName: analysisResult.foodName,
        servingSizeG: parseFloat(analysisResult.estimatedServingSize.replace(/[^\d.]/g, '')) || 100,
        calories: analysisResult.calories,
        proteinG: analysisResult.proteinG,
        carbsG: analysisResult.carbsG,
        fatG: analysisResult.fatG,
        mealType: selectedMealType,
      });

      Alert.alert('Success', 'Food logged successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error logging food:', error);
      Alert.alert('Error', 'Failed to log food. Please try again.');
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Food Logger</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!analysisResult && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Take a Photo</Text>
              <View style={styles.photoOptions}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={32} color="#007AFF" />
                  <Text style={styles.photoButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <Ionicons name="images" size={32} color="#007AFF" />
                  <Text style={styles.photoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Describe Your Food</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Grilled chicken breast with rice and vegetables"
                value={textDescription}
                onChangeText={setTextDescription}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.analyzeButton, !textDescription.trim() && styles.disabledButton]}
                onPress={analyzeText}
                disabled={!textDescription.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.analyzeButtonText}>Analyze Food</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {analysisResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            <View style={styles.resultCard}>
              <Text style={styles.foodName}>{analysisResult.foodName}</Text>
              <Text style={styles.servingSize}>Serving: {analysisResult.estimatedServingSize}</Text>
              <Text style={styles.confidence}>Confidence: {Math.round(analysisResult.confidence * 100)}%</Text>
              
              <View style={styles.nutritionInfo}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Calories:</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.calories}</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Protein:</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.proteinG}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Carbs:</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.carbsG}g</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Fat:</Text>
                  <Text style={styles.nutritionValue}>{analysisResult.fatG}g</Text>
                </View>
              </View>

              {analysisResult.healthInsights.length > 0 && (
                <View style={styles.insights}>
                  <Text style={styles.insightsTitle}>Health Insights:</Text>
                  {analysisResult.healthInsights.map((insight, index) => (
                    <Text key={index} style={styles.insightText}>• {insight}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.mealTypeSection}>
              <Text style={styles.sectionTitle}>Meal Type</Text>
              <View style={styles.mealTypeButtons}>
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                  <TouchableOpacity
                    key={mealType}
                    style={[
                      styles.mealTypeButton,
                      selectedMealType === mealType && styles.selectedMealType,
                    ]}
                    onPress={() => setSelectedMealType(mealType)}
                  >
                    <Text
                      style={[
                        styles.mealTypeText,
                        selectedMealType === mealType && styles.selectedMealTypeText,
                      ]}
                    >
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setAnalysisResult(null)}
              >
                <Text style={styles.secondaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={logFood}>
                <Text style={styles.primaryButtonText}>Log Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  photoButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 16,
  },
  nutritionInfo: {
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#333',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  insights: {
    marginTop: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mealTypeSection: {
    marginTop: 20,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
    minWidth: '22%',
    alignItems: 'center',
  },
  selectedMealType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedMealTypeText: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});
