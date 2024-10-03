import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getItem } from "../../utils/AsyncStorage";

const AssignedTask = () => {
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchProfile = async () => {
    setLoading(true);
    const token = await getItem("token");

    try {
      const response = await axios.get(
        "https://fixkar.onrender.com/assigned-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.requests) {
        setAccepted(response.data.requests);
      } else {
        console.error("No request found");
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const AcceptRequest = async (requestId) => {
    setLoading(true);

    console.log("requestId:", requestId);
    const token = await getItem("token");

    try {
      const response = await axios.put(
        `https://fixkar.onrender.com/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       
      console.log("response:", response.data);

      if (response.data.status==="accepted") { // Adjust this based on your API response structure
        Alert.alert("Success", "Request accepted successfully!");
        fetchProfile();

         // Reload tasks
      } else {
        Alert.alert("Error", "Failed to accept the request.");
      }
    } catch (error) {
      console.error("Error Accepting Task:", error);
      Alert.alert("Error", "An error occurred while accepting the task.");
    } finally {
      setLoading(false);
    }
  };

  const DeclineRequest = async (requestId) => {
    setLoading(true);

    console.log("requestId:", requestId);
    const token = await getItem("token");

    try {
      const response = await axios.delete(
        `https://fixkar.onrender.com/decline/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       
      if (response.status === 200) { // Adjust this based on your API response structure
        Alert.alert("Success", "Request declined successfully!");
        fetchProfile();
         // Reload tasks
      } else {
        Alert.alert("Error", "Failed to mark declined the request.");
      }
    } catch (error) {
      console.error("Error declining Task:", error);
      Alert.alert("Error", "An error occurred while declining the task.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const toggleDetails = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003B5C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {accepted.length === 0 ? (
        <View style={[styles.body, styles.acceptedBody]}>
          <Text style={styles.sectionHeader}>{t("common.acceptedTasks")}</Text>
          <Text style={styles.bodyText}>
            {t("common.acceptedTasksDescription")}
          </Text>
        </View>
      ) : (
        accepted.map((task) => (
          <View key={task._id} style={styles.taskContainer}>
            <Text style={styles.labelText}>Service Name: </Text>
            <Text style={styles.taskText}>{task.serviceId.name}</Text>
            <Text style={styles.labelText}>Category: </Text>
            <Text style={styles.taskText}>{task.serviceId.category}</Text>
            <Text style={styles.labelText}>User Name: </Text>
            <Text style={styles.taskText}>{task.userId.name}</Text>
            <Text style={styles.labelText}>Status: </Text>
            <Text style={styles.taskText}>{task.status}</Text>
            {expandedTaskId === task._id && (
              <View style={styles.detailsContainer}>
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${task.serviceId.image}`,
                  }}
                  style={styles.serviceImage}
                />
                <Text style={styles.labelText}>Description:</Text>
                <Text style={styles.taskText}>
                  {task.serviceId.description}
                </Text>
                <Text style={styles.labelText}>Price: </Text>
                <Text style={styles.taskText}>${task.serviceId.price}</Text>
                <Text style={styles.labelText}>Location: </Text>
                <Text style={styles.taskText}>{task.serviceId.location}</Text>
                <Text style={styles.labelText}>Phone Number: </Text>
                <Text style={styles.taskText}>{task.userId.phone}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.taskButton}
              onPress={() => toggleDetails(task._id)} // Toggle details instead of navigating
            >
              <Text style={styles.buttonText}>
                {expandedTaskId === task._id ? "View Less" : "View More"}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => DeclineRequest(task._id)}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => AcceptRequest(task._id)} // Call AcceptRequest with the task ID
              >
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAF8F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  labelText: {
    fontSize: 16,
    color: "#003B5C", // Dark color for labels
    fontFamily: "Poppins-Bold",
  },
  taskText: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Poppins-Regular",
  },
  taskButton: {
    marginTop: 10,
    backgroundColor: "#00A8A6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6B6B", // Reddish color for cancel
  },
  acceptButton: {
    backgroundColor: "#4CAF50", // Greenish color for accept
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    elevation: 1,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 5,
  },
  acceptedBody: {
    borderLeftWidth: 5,
    borderLeftColor: "#00A8A6",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003B5C",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  bodyText: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Poppins-Regular",
  },
});

export default AssignedTask;
