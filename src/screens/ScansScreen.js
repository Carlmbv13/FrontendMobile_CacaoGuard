import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { getFarms, getScans, createScan } from '../services/api';
import SeverityBadge from '../components/SeverityBadge';
import colors from '../theme/colors';

export default function ScansScreen() {
  const [farms, setFarms] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newScan, setNewScan] = useState({ farm: '', zone_name: '', severity: 'Healthy', confidence: '', affected_area: '' });

  const loadData = async () => {
    try {
      const [farmsRes, scansRes] = await Promise.all([getFarms(), getScans()]);
      setFarms(farmsRes.data.results || farmsRes.data);
      setScans(scansRes.data.results || scansRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScan = async () => {
    if (!newScan.farm || !newScan.zone_name || !newScan.confidence) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }
    try {
      await createScan({
        farm: parseInt(newScan.farm),
        zone_name: newScan.zone_name,
        severity: newScan.severity,
        confidence: parseFloat(newScan.confidence),
        affected_area: parseFloat(newScan.affected_area) || 0,
      });
      setModalVisible(false);
      setNewScan({ farm: '', zone_name: '', severity: 'Healthy', confidence: '', affected_area: '' });
      loadData();
      Alert.alert('Success', 'Scan recorded!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create scan');
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔬 Scans</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ New Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyText}>No scans yet</Text>
          </View>
        ) : (
          scans.map(scan => (
            <View key={scan.id} style={styles.scanCard}>
              <Text style={styles.scanZone}>{scan.zone_name}</Text>
              <SeverityBadge severity={scan.severity} />
              <Text style={styles.scanConfidence}>Confidence: {scan.confidence}%</Text>
              <Text style={styles.scanArea}>Affected: {scan.affected_area} m²</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Scan</Text>
            
            <Text style={styles.modalLabel}>Select Farm:</Text>
            {farms.map(farm => (
              <TouchableOpacity key={farm.id} style={[styles.farmOption, newScan.farm === farm.id && styles.farmOptionSelected]} onPress={() => setNewScan({...newScan, farm: farm.id})}>
                <Text>{farm.name}</Text>
              </TouchableOpacity>
            ))}

            <TextInput style={styles.modalInput} placeholder="Zone Name" value={newScan.zone_name} onChangeText={text => setNewScan({...newScan, zone_name: text})} />
            <TextInput style={styles.modalInput} placeholder="Confidence %" value={newScan.confidence} onChangeText={text => setNewScan({...newScan, confidence: text})} keyboardType="numeric" />
            <TextInput style={styles.modalInput} placeholder="Affected Area (m²)" value={newScan.affected_area} onChangeText={text => setNewScan({...newScan, affected_area: text})} keyboardType="numeric" />

            <Text style={styles.modalLabel}>Severity:</Text>
            <View style={styles.severityRow}>
              {['Healthy', 'Mild', 'Moderate', 'Severe'].map(s => (
                <TouchableOpacity key={s} style={[styles.severityOption, newScan.severity === s && styles.severitySelected]} onPress={() => setNewScan({...newScan, severity: s})}>
                  <Text style={styles.severityOptionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleCreateScan}><Text style={styles.modalButtonText}>Record Scan</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  addButton: { backgroundColor: colors.white, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: colors.primary, fontWeight: 'bold' },
  scanCard: { backgroundColor: colors.white, margin: 10, padding: 15, borderRadius: 10, elevation: 2 },
  scanZone: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  scanConfidence: { fontSize: 14, color: colors.gray, marginTop: 5 },
  scanArea: { fontSize: 14, color: colors.gray, marginTop: 5 },
  emptyState: { alignItems: 'center', padding: 50 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.gray },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: colors.white, margin: 20, borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  modalInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 15 },
  farmOption: { backgroundColor: colors.lightGray, padding: 12, borderRadius: 8, marginBottom: 8 },
  farmOptionSelected: { backgroundColor: colors.primary },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  severityOption: { backgroundColor: colors.lightGray, padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  severitySelected: { backgroundColor: colors.primary },
  severityOptionText: { fontSize: 12 },
  modalButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  modalButtonText: { color: colors.white, fontWeight: 'bold' },
  modalCancel: { padding: 12, alignItems: 'center', marginTop: 10 },
  modalCancelText: { color: colors.gray },
});