import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next"; // Import translation hook

const Services = () => {
  const { t } = useTranslation(); // Initialize translation
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const router = useRouter();

  const handleSearchChange = debounce((text) => {
    setSearchQuery(text);
  }, 300);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "https://fixkar-services-api-1.onrender.com/api/services/"
      );
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const handleAddService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  const goToAddService = () => {
    router.push({
      pathname: "../components/AddService",
      params: { onAddService: handleAddService },
    });
  };

  const goToEditService = (service) => {
    router.push({
      pathname: "../components/editService",
      params: { service },
    });
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setModalVisible(true);
  };

  const deleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await fetch(
        `https://fixkar-services-api-1.onrender.com/api/services/deleteService/${serviceToDelete._id}`,
        { method: "DELETE" }
      );

      setServices((prevServices) =>
        prevServices.filter((service) => service._id !== serviceToDelete._id)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setModalVisible(false);
      setServiceToDelete(null);
    }
  };

  const goToServiceDetail = (service) => {
    router.push({
      pathname: "../components/EditService",
      params: { service },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text>{t('myServices.loading.loadingMessage')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('myServices.services.headerText')}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('myServices.services.searchPlaceholder')}
          placeholderTextColor="#B2DFDB"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic-outline" size={24} color="#B2DFDB" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.addServiceButton}
        onPress={goToAddService}
      >
        <Text style={styles.addServiceText}>{t('myServices.buttons.addService')}</Text>
        <Ionicons name="add-circle-outline" size={24} color="#1B5E20" />
      </TouchableOpacity>
      <FlatList
        data={services.filter((service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => goToServiceDetail(item)}
          >
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceText}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => goToEditService(item)}
              >
                <Ionicons name="pencil-outline" size={20} color="#1B5E20" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#1B5E20" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noServiceText}>{t('myServices.services.noServicesText')}</Text>
        }
      />

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {t('myServices.services.deleteConfirmation')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={deleteService}
              >
                <Text style={styles.confirmText}>{t('myServices.services.confirm')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>{t('myServices.services.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Services;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F7', // Light cream background
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003B5C', // Deep blue color for text
    fontFamily: 'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    borderRadius: 15,
    backgroundColor: '#FFFFFF', // White background for search container
    padding: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333333', // Darker text color for input
    fontFamily: 'Poppins-Regular',
  },
  micButton: {
    padding: 10,
  },
  addServiceButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00A8A6', // Vibrant teal for button
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#00A8A6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  addServiceText: {
    fontSize: 16,
    marginRight: 10,
    color: '#FFFFFF', // White color for button text
    fontFamily: 'Poppins-Medium',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF', // White background for service item
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  serviceTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  serviceText: {
    color: '#003B5C', // Deep blue color for service name
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  serviceDescription: {
    color: '#666666', // Gray color for description
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 10,
  },
  noServiceText: {
    textAlign: 'center',
    color: '#003B5C', // Deep blue color for no services text
    marginTop: 20,
    fontFamily: 'Poppins-Light',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F7', // Light cream background for loading
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF', // White background for modal
    borderRadius: 15,
    borderColor: '#00A8A6', // Teal border for modal
    borderWidth: 2,
  },
  modalText: {
    color: '#003B5C', // Deep blue color for modal text
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#00A8A6', // Vibrant teal for confirm button
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  confirmText: {
    color: '#FFFFFF', // White color for confirm button text
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#E0E0E0', // Light gray for cancel button
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  cancelText: {
    color: '#003B5C', // Deep blue color for cancel button text
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
});
