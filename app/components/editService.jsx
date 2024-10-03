import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
];

const EditService = () => {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();

  const [service, setService] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setService(data);
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(data.price ? data.price.toString() : '');
        setCategory(data.category || categories[0]);
        setLocation(data.location || '');
        if (data.image) {
          setImage(`data:image/jpeg;base64,${data.image}`);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const handleUpdateService = async () => {
    if (!name || !description || !price || !category || !location) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      const token = await getItem("token");

      // Convert image to Base64 and resize
      let base64Image = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise((resolve) => {
          reader.onloadend = async () => {
            const resizedImage = await resizeImage(reader.result);
            base64Image = resizedImage;
            resolve();
          };
        });
      }

      const body = {
        name,
        description,
        price,
        category,
        address: location,
        image: base64Image,
      };

      const response = await fetch(`http://172.20.10.7:5000/updateService/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        router.back();
      } else {
        Alert.alert('Error', 'Failed to update the service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'An error occurred while updating the service');
    } finally {
      setLoading(false);
    }
  };

  const resizeImage = async (uri) => {
    let imageInfo = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    // Check size and resize if necessary
    while (imageInfo.base64 && Buffer.from(imageInfo.base64, 'base64').length > 500 * 1024) {
      imageInfo = await ImageManipulator.manipulateAsync(
        imageInfo.uri,
        [{ resize: { width: imageInfo.width * 0.9 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
    }

    return imageInfo.base64;
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
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'An error occurred while fetching the address');
    }
  };

  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access camera was denied');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library was denied');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImage(`data:image/jpeg;base64,${resizedImage}`); // Set the resized image as Base64
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Edit Service</Text>
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
            multiline
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
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage('gallery')}>
              <Text style={styles.imagePickerText}>Pick from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage('camera')}>
              <Text style={styles.imagePickerText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <TouchableOpacity style={styles.submitButton} onPress={handleUpdateService}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F7',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#333',
    backgroundColor: '#FFF',
  },
  pickerContainer: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationInput: {
    flex: 1,
  },
  locationIcon: {
    marginLeft: 10,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imagePickerButton: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditService;
