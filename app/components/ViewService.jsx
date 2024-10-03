import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image, // Import Image for service images
} from "react-native";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router"; // Use useLocalSearchParams instead of useSearchParams
import { getItem } from "../../utils/AsyncStorage";

const ViewService = () => {
  const { t } = useTranslation();
  const { serviceId } = useLocalSearchParams(); // Retrieve serviceId using useLocalSearchParams
  const [service, setService] = useState(null);
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      const token = await getItem("token");
      try {
        const response = await fetch(
          `https://fixkar.onrender.com/provider/getService/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setService(data); // Set the service details
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Function to format "updatedAt" to a human-readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t("viewService.loading")}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Service Image */}
      {service.image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${service.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Service Name */}
      <Text style={styles.headerText}>{service.name}</Text>

      {/* Service Category with light background and rounded borders */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{t("Category")}: {service.category}</Text>
      </View>

      {/* Service Price */}
      <Text style={styles.price}>{t("Price")}: ₹{service.price}</Text>

      {/* Service Location */}
      <Text style={styles.location}>{t("Location")}: {service.location}</Text>

      {/* Listed On (updatedAt) */}
      <Text style={styles.listedOn}>{t("Listed On")}: {formatDate(service.updatedAt)}</Text>

      {/* Service Description */}
      <Text style={styles.descriptionTitle}>{t("Description")}</Text>
      <Text style={styles.description}>{service.description}</Text>
    </ScrollView>
  );
};

export default ViewService;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9", // Background color for better readability
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Darker text color for readability
    marginBottom: 10,
  },
  // Category with light background and rounded borders
  categoryContainer: {
    backgroundColor: "#e0f7fa", // Light cyan background
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#00796b", // Slightly darker text to match the background
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745", // Green color for price
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: "#888", // Slightly lighter color for location
    marginBottom: 20,
  },
  listedOn: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    fontStyle: 'italic', // Italic to make the 'Listed On' text stand out
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24, // Better readability for multi-line text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
