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
    setLoading(true);
    try {
      const [farmsRes, scansRes] = await Promise.all([getFarms(), getScans()]);
      console.log('Farms loaded:', farmsRes.data);
      console.log('Scans loaded:', scansRes.data);
      setFarms(farmsRes.data.results || farmsRes.data || []);
      setScans(scansRes.data.results || scansRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScan = async () => {
    if (!newScan.farm) {
      Alert.alert('Error', 'Please select a farm');
      return;
    }
    if (!newScan.zone_name) {
      Alert.alert('Error', 'Please enter zone name');
      return;
    }
    if (!newScan.confidence) {
      Alert.alert('Error', 'Please enter confidence percentage');
      return;
    }
    
    try {
      const scanData = {
        farm: parseInt(newScan.farm),
        zone_name: newScan.zone_name,
        severity: newScan.severity,
        confidence: parseFloat(newScan.confidence),
        affected_area: parseFloat(newScan.affected_area) || 0,
      };
      console.log('Creating scan:', scanData);
      
      await createScan(scanData);
      
      setModalVisible(false);
      setNewScan({ farm: '', zone_name: '', severity: 'Healthy', confidence: '', affected_area: '' });
      loadData(); // Refresh the list
      Alert.alert('Success', 'Scan recorded successfully!');
    } catch (error) {
      console.error('Error creating scan:', error);
      Alert.alert('Error', 'Failed to create scan: ' + (error.response?.data?.detail || error.message));
    }
  };

  const openModal = () => {
    // Refresh farms list when opening modal
    const refreshFarms = async () => {
      try {
        const farmsRes = await getFarms();
        setFarms(farmsRes.data.results || farmsRes.data || []);
      } catch (error) {
        console.error('Error refreshing farms:', error);
      }
    };
    refreshFarms();
    setModalVisible(true);
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading farms and scans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔬 Scans</Text>
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>+ New Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubtext}>Tap + New Scan to record disease scans</Text>
          </View>
        ) : (
          scans.map(scan => (
            <View key={scan.id} style={styles.scanCard}>
              <Text style={styles.scanZone}>{scan.zone_name}</Text>
              <SeverityBadge severity={scan.severity} />
              <Text style={styles.scanConfidence}>Confidence: {scan.confidence}%</Text>
              <Text style={styles.scanArea}>Affected: {scan.affected_area} m²</Text>
              <Text style={styles.scanDate}>Date: {new Date(scan.date).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Scan</Text>
            
            <Text style={styles.modalLabel}>Select Farm:</Text>
            {farms.length === 0 ? (
              <View style={styles.noFarmsContainer}>
                <Text style={styles.noFarmsText}>No farms available</Text>
                <TouchableOpacity 
                  style={styles.createFarmButton}
                  onPress={() => {
                    setModalVisible(false);
                    // Navigate to Farms screen - you may need to implement this
                    Alert.alert('Info', 'Please create a farm first in the Farms tab');
                  }}
                >
                  <Text style={styles.createFarmButtonText}>Create a Farm First</Text>
                </TouchableOpacity>
              </View>
            ) : (
              farms.map(farm => (
                <TouchableOpacity 
                  key={farm.id} 
                  style={[
                    styles.farmOption, 
                    newScan.farm === farm.id && styles.farmOptionSelected
                  ]} 
                  onPress={() => setNewScan({...newScan, farm: farm.id})}
                >
                  <Text style={[
                    styles.farmOptionText,
                    newScan.farm === farm.id && styles.farmOptionTextSelected
                  ]}>
                    🌾 {farm.name} - {farm.location}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TextInput 
              style={styles.modalInput} 
              placeholder="Zone Name *" 
              placeholderTextColor="#999"
              value={newScan.zone_name} 
              onChangeText={text => setNewScan({...newScan, zone_name: text})} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Confidence % (0-100) *" 
              placeholderTextColor="#999"
              value={newScan.confidence} 
              onChangeText={text => setNewScan({...newScan, confidence: text})} 
              keyboardType="numeric" 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Affected Area (m²)" 
              placeholderTextColor="#999"
              value={newScan.affected_area} 
              onChangeText={text => setNewScan({...newScan, affected_area: text})} 
              keyboardType="numeric" 
            />

            <Text style={styles.modalLabel}>Severity:</Text>
            <View style={styles.severityRow}>
              {['Healthy', 'Mild', 'Moderate', 'Severe'].map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[
                    styles.severityOption, 
                    newScan.severity === s && styles.severitySelected
                  ]} 
                  onPress={() => setNewScan({...newScan, severity: s})}
                >
                  <Text style={[
                    styles.severityOptionText,
                    newScan.severity === s && styles.severityOptionTextSelected
                  ]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleCreateScan}>
              <Text style={styles.modalButtonText}>Record Scan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
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
  
  scanCard: { backgroundColor: colors.white, margin: 10, padding: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  scanZone: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  scanConfidence: { fontSize: 14, color: colors.gray, marginTop: 5 },
  scanArea: { fontSize: 14, color: colors.gray, marginTop: 5 },
  scanDate: { fontSize: 12, color: colors.gray, marginTop: 5 },
  
  emptyState: { alignItems: 'center', padding: 50 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.gray },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 10 },
  
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: colors.white, margin: 20, borderRadius: 10, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: colors.primary },
  modalLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: colors.black },
  modalInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  
  farmOption: { backgroundColor: colors.lightGray, padding: 12, borderRadius: 8, marginBottom: 8 },
  farmOptionSelected: { backgroundColor: colors.primary },
  farmOptionText: { fontSize: 14, color: colors.black },
  farmOptionTextSelected: { color: colors.white, fontWeight: 'bold' },
  
  noFarmsContainer: { alignItems: 'center', padding: 20, backgroundColor: colors.lightGray, borderRadius: 8, marginBottom: 15 },
  noFarmsText: { color: colors.gray, marginBottom: 10 },
  createFarmButton: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  createFarmButtonText: { color: colors.white, fontSize: 12 },
  
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  severityOption: { backgroundColor: colors.lightGray, padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  severitySelected: { backgroundColor: colors.primary },
  severityOptionText: { fontSize: 12, color: colors.black },
  severityOptionTextSelected: { color: colors.white, fontWeight: 'bold' },
  
  modalButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  modalButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  modalCancel: { padding: 12, alignItems: 'center', marginTop: 10 },
  modalCancelText: { color: colors.gray, fontSize: 14 },
});