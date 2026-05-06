import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const DataTable = ({ columns, data, emptyMessage = 'No data available.' }) => {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {columns.map((col) => (
        <View key={col.key} style={[styles.cell, { flex: col.flex || 1 }]}>
          {col.render ? col.render(item) : (
            <Text style={styles.cellText}>{item[col.key]}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <View key={col.key} style={[styles.cell, { flex: col.flex || 1 }]}>
            <Text style={styles.headerText}>{col.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 13,
    color: colors.foreground,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});

export default DataTable;
