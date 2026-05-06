import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SeverityBadge({ severity }) {
  const getColor = () => {
    switch (severity) {
      case 'Severe': return '#f44336';
      case 'Moderate': return '#ff9800';
      case 'Mild': return '#ffc107';
      default: return '#4caf50';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }]}>
      <Text style={styles.text}>{severity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});