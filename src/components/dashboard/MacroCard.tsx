import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

export default function MacroCard({ title, value, unit, color }: MacroCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {Math.round(value)}{unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorBar: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
