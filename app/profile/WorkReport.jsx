import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const completedServices = [
  { id: '1', title: 'Service 1', amount: 500 },
  { id: '2', title: 'Service 2', amount: 700 },
  // Add more completed services as needed
];

// Calculate the total money earned
const totalEarned = completedServices.reduce((sum, service) => sum + service.amount, 0);

const WorkReport = () => {
  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Total Services: {completedServices.length}</Text>
          <Text style={styles.statText}>Earned Amount: ₹ {totalEarned}</Text>
        </View>
      </View>

      {/* Completed Services List */}
      <FlatList
        data={completedServices}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceAmount}>₹ {item.amount}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Completed</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9', // Light gray background similar to dashboard
    padding: 16,
  },
  summaryContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background for the summary section
    borderRadius: 12,
    elevation: 4, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#00A8A6', // Dashboard accent color
  },
  stats: {
    marginTop: 12,
  },
  statText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333', // Dark gray for stats text
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    padding: 16,
    backgroundColor: '#F5F6F8', // Light gray background for card content
  },
  serviceTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#00A8A6', // Dashboard accent color
  },
  serviceAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    marginTop: 4,
  },
  cardFooter: {
    padding: 12,
    backgroundColor: '#00A8A6', // Dashboard accent color
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF', // White text color
  },
});

export default WorkReport;
