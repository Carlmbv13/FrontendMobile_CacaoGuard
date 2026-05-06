import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function FarmHealthCard({ health, riskLevel }) {
  const getRiskColor = () => {
    if (riskLevel === 'Critical') return colors.danger;
    if (riskLevel === 'High') return colors.warning;
    if (riskLevel === 'Medium') return colors.secondary;
    return colors.success;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.healthScore}>{health}%</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${health}%`, backgroundColor: getRiskColor() }]} />
      </View>
      <Text style={[styles.risk, { color: getRiskColor() }]}>Risk: {riskLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  healthScore: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  risk: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});