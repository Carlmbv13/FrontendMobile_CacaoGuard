import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDashboardStats } from '../services/api';
import StatCard from '../components/StatCard';
import colors from '../theme/colors';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    loadUser();
    loadStats();
  }, []);

  const loadUser = async () => {
    const user = await AsyncStorage.getItem('username');
    setUsername(user || 'Farmer');
  };

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStats();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welcome, {username}!</Text>
          <Text style={styles.headerSubtitle}>Cacao Disease Monitor</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard value={stats?.total_farms || 0} label="Farms" />
        <StatCard value={stats?.total_scans || 0} label="Scans" />
        <StatCard value={stats?.active_alerts || 0} label="Active Alerts" color={colors.warning} />
        <StatCard value={stats?.critical_alerts || 0} label="Critical" color={colors.danger} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Average Farm Health</Text>
        <Text style={styles.healthScore}>{stats?.avg_health_score?.toFixed(1) || 0}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${stats?.avg_health_score || 0}%` }]} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Distribution</Text>
        <View style={styles.riskContainer}>
          <View style={styles.riskItem}><Text style={styles.riskLabel}>Low</Text><Text style={styles.riskValue}>{stats?.risk_breakdown?.Low || 0}</Text></View>
          <View style={styles.riskItem}><Text style={styles.riskLabel}>Medium</Text><Text style={styles.riskValue}>{stats?.risk_breakdown?.Medium || 0}</Text></View>
          <View style={styles.riskItem}><Text style={styles.riskLabel}>High</Text><Text style={styles.riskValue}>{stats?.risk_breakdown?.High || 0}</Text></View>
          <View style={styles.riskItem}><Text style={styles.riskLabel}>Critical</Text><Text style={styles.riskValue}>{stats?.risk_breakdown?.Critical || 0}</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scan Results</Text>
        <View style={styles.severityContainer}>
          <View style={styles.severityItem}><Text style={styles.severityLabel}>Healthy</Text><Text style={styles.severityValue}>{stats?.severity_breakdown?.Healthy || 0}</Text></View>
          <View style={styles.severityItem}><Text style={styles.severityLabel}>Mild</Text><Text style={styles.severityValue}>{stats?.severity_breakdown?.Mild || 0}</Text></View>
          <View style={styles.severityItem}><Text style={styles.severityLabel}>Moderate</Text><Text style={styles.severityValue}>{stats?.severity_breakdown?.Moderate || 0}</Text></View>
          <View style={styles.severityItem}><Text style={styles.severityLabel}>Severe</Text><Text style={styles.severityValue}>{stats?.severity_breakdown?.Severe || 0}</Text></View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: colors.white, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  section: { backgroundColor: colors.white, margin: 10, padding: 15, borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  healthScore: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.primary },
  progressBar: { width: '100%', height: 10, backgroundColor: colors.lightGray, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 },
  riskContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  riskItem: { alignItems: 'center' },
  riskLabel: { fontSize: 12, color: colors.gray },
  riskValue: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  severityContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  severityItem: { alignItems: 'center' },
  severityLabel: { fontSize: 12, color: colors.gray },
  severityValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
});