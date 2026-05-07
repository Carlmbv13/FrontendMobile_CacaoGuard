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
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.212:8000/api'; // CHANGE TO YOUR IP

export default function FarmsScreen() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newFarm, setNewFarm] = useState({ name: '', location: '', size_hectares: '' });
  const [editFarm, setEditFarm] = useState({ 
    id: null, 
    name: '', 
    location: '', 
    size_hectares: '',
    health_score: 100,
    risk_level: 'Low'
  });

  const loadFarms = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/farms/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setFarms(data.results || data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const createFarm = async () => {
    if (!newFarm.name || !newFarm.location) {
      Alert.alert('Error', 'Please enter farm name and location');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/farms/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFarm.name,
          location: newFarm.location,
          size_hectares: parseFloat(newFarm.size_hectares) || 0,
          health_score: 100,
          risk_level: 'Low',
        }),
      });
      
      if (response.ok) {
        setModalVisible(false);
        setNewFarm({ name: '', location: '', size_hectares: '' });
        loadFarms();
        Alert.alert('Success', 'Farm created successfully!');
      } else {
        Alert.alert('Error', 'Failed to create farm');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create farm');
    }
  };

  const updateFarm = async () => {
    if (!editFarm.name || !editFarm.location) {
      Alert.alert('Error', 'Please enter farm name and location');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/farms/${editFarm.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFarm.name,
          location: editFarm.location,
          size_hectares: parseFloat(editFarm.size_hectares) || 0,
          health_score: editFarm.health_score || 100,
          risk_level: editFarm.risk_level || 'Low',
        }),
      });
      
      if (response.ok) {
        setEditModalVisible(false);
        setEditFarm({ id: null, name: '', location: '', size_hectares: '', health_score: 100, risk_level: 'Low' });
        loadFarms();
        Alert.alert('Success', 'Farm updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update farm');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update farm');
    }
  };

  const deleteFarm = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this farm?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('access_token');
            await fetch(`${API_URL}/farms/${id}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
            });
            loadFarms();
            Alert.alert('Success', 'Farm deleted successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete farm');
          }
        },
      },
    ]);
  };

  const openEditModal = (farm) => {
    setEditFarm({
      id: farm.id,
      name: farm.name,
      location: farm.location,
      size_hectares: farm.size_hectares ? farm.size_hectares.toString() : '',
      health_score: farm.health_score || 100,
      risk_level: farm.risk_level || 'Low',
    });
    setEditModalVisible(true);
  };

  useEffect(() => { loadFarms(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌾 Farms</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {farms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>No farms yet</Text>
            <Text style={styles.emptySubtext}>Tap + Add to create your first farm</Text>
          </View>
        ) : (
          farms.map(farm => (
            <View key={farm.id} style={styles.farmCard}>
              <View style={styles.farmHeader}>
                <Text style={styles.farmName}>{farm.name}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => openEditModal(farm)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteFarm(farm.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.farmDetail}>📍 {farm.location}</Text>
              <Text style={styles.farmDetail}>📏 {farm.size_hectares} hectares</Text>
              <View style={styles.healthContainer}>
                <View style={styles.healthBadge}>
                  <Text style={styles.healthText}>💚 Health: {farm.health_score}%</Text>
                </View>
                <View style={[styles.riskBadge, farm.risk_level === 'Critical' ? styles.criticalRiskBg : styles.normalRiskBg]}>
                  <Text style={styles.riskText}>⚠️ Risk: {farm.risk_level}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Farm Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌾 New Farm</Text>
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Farm Name *" 
              placeholderTextColor="#999"
              value={newFarm.name} 
              onChangeText={text => setNewFarm({...newFarm, name: text})} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Location *" 
              placeholderTextColor="#999"
              value={newFarm.location} 
              onChangeText={text => setNewFarm({...newFarm, location: text})} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Size (hectares)" 
              placeholderTextColor="#999"
              value={newFarm.size_hectares} 
              onChangeText={text => setNewFarm({...newFarm, size_hectares: text})} 
              keyboardType="numeric" 
            />
            
            <TouchableOpacity style={styles.modalButton} onPress={createFarm}>
              <Text style={styles.modalButtonText}>Create Farm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Farm Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Edit Farm</Text>
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Farm Name *" 
              placeholderTextColor="#999"
              value={editFarm.name} 
              onChangeText={text => setEditFarm({...editFarm, name: text})} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Location *" 
              placeholderTextColor="#999"
              value={editFarm.location} 
              onChangeText={text => setEditFarm({...editFarm, location: text})} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Size (hectares)" 
              placeholderTextColor="#999"
              value={editFarm.size_hectares} 
              onChangeText={text => setEditFarm({...editFarm, size_hectares: text})} 
              keyboardType="numeric" 
            />
            
            <Text style={styles.modalLabel}>Risk Level:</Text>
            <View style={styles.riskSelector}>
              {['Low', 'Medium', 'High', 'Critical'].map(risk => (
                <TouchableOpacity
                  key={risk}
                  style={[
                    styles.riskOption,
                    editFarm.risk_level === risk && styles.riskOptionSelected,
                    risk === 'Critical' && styles.criticalOption
                  ]}
                  onPress={() => setEditFarm({...editFarm, risk_level: risk})}
                >
                  <Text style={[
                    styles.riskOptionText,
                    editFarm.risk_level === risk && styles.riskOptionTextSelected
                  ]}>{risk}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.modalButton} onPress={updateFarm}>
              <Text style={styles.modalButtonText}>Update Farm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    backgroundColor: '#2e7d32', 
    padding: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  addButton: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  addButtonText: { 
    color: '#2e7d32', 
    fontWeight: 'bold' 
  },
  
  farmCard: { 
    backgroundColor: '#fff', 
    margin: 10, 
    padding: 15, 
    borderRadius: 10, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  farmHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  farmName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    flex: 1 
  },
  farmDetail: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 5 
  },
  
  actionButtons: { 
    flexDirection: 'row', 
    gap: 10 
  },
  editButton: { 
    backgroundColor: '#2196f3', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 5, 
    marginRight: 5 
  },
  editButtonText: { 
    color: '#fff', 
    fontSize: 12 
  },
  deleteButton: { 
    backgroundColor: '#f44336', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 5 
  },
  deleteButtonText: { 
    color: '#fff', 
    fontSize: 12 
  },
  
  healthContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  healthBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  healthText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#4caf50' 
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  riskText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  criticalRiskBg: { 
    backgroundColor: '#f44336' 
  },
  normalRiskBg: { 
    backgroundColor: '#ff9800' 
  },
  
  emptyState: { 
    alignItems: 'center', 
    padding: 50 
  },
  emptyEmoji: { 
    fontSize: 64, 
    marginBottom: 20 
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#666' 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 10 
  },
  
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    margin: 20, 
    borderRadius: 10, 
    padding: 20 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#2e7d32'
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5,
    color: '#333',
  },
  modalInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: { 
    backgroundColor: '#2e7d32', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },
  modalButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  modalCancel: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalCancelText: { 
    textAlign: 'center', 
    marginTop: 5, 
    color: '#666',
    fontSize: 14,
  },
  
  riskSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  riskOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  riskOptionSelected: {
    backgroundColor: '#2e7d32',
  },
  criticalOption: {
    // No special styling needed
  },
  riskOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  riskOptionTextSelected: {
    color: '#fff',
  },
});