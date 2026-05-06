import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAlerts, updateAlertStatus } from '../services/api';
import colors from '../theme/colors';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const response = await getAlerts();
      setAlerts(response.data.results || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAlertStatus(id, status);
      loadAlerts();
      Alert.alert('Updated', `Alert marked as ${status}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update');
    }
  };

  const getAlertColor = (severity) => {
    if (severity === 'critical') return '#ffebee';
    if (severity === 'warning') return '#fff3e0';
    return '#e8f5e9';
  };

  useEffect(() => { loadAlerts(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚨 Alerts</Text>
      </View>

      <ScrollView>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyText}>No alerts</Text>
            <Text style={styles.emptySubtext}>Your farm is healthy!</Text>
          </View>
        ) : (
          alerts.map(alert => (
            <View key={alert.id} style={[styles.alertCard, { backgroundColor: getAlertColor(alert.severity) }]}>
              <Text style={styles.alertSeverity}>⚠️ {alert.severity.toUpperCase()}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertDate}>{new Date(alert.created_at).toLocaleString()}</Text>
              <Text style={styles.alertStatus}>Status: {alert.status}</Text>
              {alert.status === 'new' && (
                <View style={styles.alertButtons}>
                  <TouchableOpacity style={styles.acknowledgeButton} onPress={() => handleUpdateStatus(alert.id, 'acknowledged')}>
                    <Text style={styles.buttonText}>Acknowledge</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resolveButton} onPress={() => handleUpdateStatus(alert.id, 'resolved')}>
                    <Text style={styles.buttonText}>Resolve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  alertCard: { margin: 10, padding: 15, borderRadius: 10, elevation: 2 },
  alertSeverity: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  alertMessage: { fontSize: 14, marginBottom: 5 },
  alertDate: { fontSize: 12, color: colors.gray, marginBottom: 5 },
  alertStatus: { fontSize: 12, fontStyle: 'italic', marginBottom: 10 },
  alertButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  acknowledgeButton: { backgroundColor: colors.secondary, padding: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  resolveButton: { backgroundColor: colors.success, padding: 10, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', padding: 50 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.gray },
  emptySubtext: { fontSize: 14, color: colors.gray, marginTop: 10 },
});