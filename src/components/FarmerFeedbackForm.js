import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const confirmationOptions = ['confirmed', 'false-positive', 'unsure'];
const treatmentOptions = ['untreated', 'in-progress', 'treated'];

const FarmerFeedbackForm = ({ onSubmit }) => {
  const [farmName, setFarmName] = useState('');
  const [confirmation, setConfirmation] = useState('confirmed');
  const [treatmentStatus, setTreatmentStatus] = useState('untreated');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!farmName.trim()) return;

    const entry = {
      id: Date.now().toString(),
      farmName: farmName.trim(),
      confirmation,
      treatmentStatus,
      notes: notes.trim(),
      submittedAt: new Date().toLocaleString(),
    };

    onSubmit(entry);
    setSubmitted(true);
    setTimeout(() => {
      setFarmName('');
      setConfirmation('confirmed');
      setTreatmentStatus('untreated');
      setNotes('');
      setSubmitted(false);
    }, 2000);
  };

  const treatmentColor = {
    untreated: colors.destructive,
    'in-progress': colors.warning,
    treated: colors.success,
  };

  if (submitted) {
    return (
      <View style={styles.card}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          <Text style={styles.successText}>Feedback submitted successfully!</Text>
          <View style={[styles.statusBadge, { backgroundColor: treatmentColor[treatmentStatus] + '20' }]}>
            <Text style={[styles.statusText, { color: treatmentColor[treatmentStatus] }]}>
              Treatment: {treatmentStatus}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Farmer Feedback</Text>

      <Text style={styles.label}>Farm Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Hacienda Verde"
        value={farmName}
        onChangeText={setFarmName}
        placeholderTextColor={colors.mutedForeground}
      />

      <Text style={styles.label}>Infection Confirmation</Text>
      <View style={styles.optionRow}>
        {confirmationOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBtn, confirmation === opt && styles.optionBtnActive]}
            onPress={() => setConfirmation(opt)}
          >
            <Text style={[styles.optionText, confirmation === opt && styles.optionTextActive]}>
              {opt.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Treatment Status</Text>
      <View style={styles.optionRow}>
        {treatmentOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionBtn, treatmentStatus === opt && { backgroundColor: treatmentColor[opt] + '20', borderColor: treatmentColor[opt] }]}
            onPress={() => setTreatmentStatus(opt)}
          >
            <Text style={[styles.optionText, treatmentStatus === opt && { color: treatmentColor[opt] }]}>
              {opt.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe what you observed..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        placeholderTextColor={colors.mutedForeground}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Ionicons name="send" size={18} color={colors.primaryForeground} />
        <Text style={styles.submitText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: colors.foreground, marginBottom: 6, marginTop: 12 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  optionBtnActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  optionText: { fontSize: 12, color: colors.mutedForeground, textTransform: 'capitalize' },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 48,
    marginTop: 20,
    gap: 8,
  },
  submitText: { color: colors.primaryForeground, fontSize: 15, fontWeight: '600' },
  successContainer: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  successText: { fontSize: 14, fontWeight: '500', color: colors.foreground },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: '600' },
});

export default FarmerFeedbackForm;
