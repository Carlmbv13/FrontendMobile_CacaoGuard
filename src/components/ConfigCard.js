import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ConfigCard = ({ title, description, children }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.foreground },
  description: { fontSize: 13, color: colors.mutedForeground, marginTop: 4 },
  content: { marginTop: 16 },
});

export default ConfigCard;
