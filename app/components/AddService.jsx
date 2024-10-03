import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getItem } from '../../utils/AsyncStorage';

const categories = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Cleaning',
  // Add more categories as needed
];

const AddService = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !description || !price || !category || !location) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    const token = await getItem('token');

    try {
      const base64Image = image ? await processImage(image) : null;

      const response = await fetch('https://fixkar.onrender.com/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
          location,
          image: base64Image,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Service added successfully');
        router.back();
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', errorResponse.message || 'Failed to add service');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the service');
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const imageSize = await getImageSizeInKB(manipulatedImage.uri);
      if (imageSize > 500) {
        return await resizeImageFurther(manipulatedImage.uri);
      }

      return await imageToBase64(manipulatedImage.uri);
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  };

  const imageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  const getImageSizeInKB = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return Math.round(blob.size / 1024);
  };

  const resizeImageFurther = async (uri) => {
    const furtherResizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
    return await imageToBase64(furtherResizedImage.uri);
  };

  const handleLocationPress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        Alert.alert('Error', 'Unable to get address from location');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching the address');
    }
  };

  const pickImage = async (fromCamera = false) => {
    let result;

    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Add New Service</Text>
          <TextInput
            style={styles.input}
            placeholder="Service Name"
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#B0B0B0"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Location"
              placeholderTextColor="#B0B0B0"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.locationIcon} onPress={handleLocationPress}>
              <Ionicons name="location-outline" size={24} color="#B0B0B0" />
            </TouchableOpacity>
          </View>
          <View style={styles.imageButtonContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(false)}>
              <Text style={styles.imageButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(true)}>
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Add Service</Text>
            <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Darker background for better contrast
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 26, // Slightly larger font for the header
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for a brighter contrast
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B0B0B0', // Lighter border for visibility
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
  },
  picker: {
    height: 50,
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationInput: {
    flex: 1,
  },
  locationIcon: {
    paddingLeft: 10,
  },
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFD700', // Gold color for the text
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28A745', // Green color for the submit button
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay during loading
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddService;
