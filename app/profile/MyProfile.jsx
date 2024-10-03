import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getItem } from '../../utils/AsyncStorage';
import { useRouter } from 'expo-router';

const MyProfile = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('myProfile.errorTitle'), t('myProfile.cameraPermission'));
      }
    })();
  }, []);

  const pickImage = async () => {
    setModalVisible(false);
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const processedImage = await resizeImage(result.assets[0].uri);
      setProfileAvatar(processedImage);
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    try {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled) {
        const processedImage = await resizeImage(result.assets[0].uri);
        setProfileAvatar(processedImage);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorCamera'));
    }
  };

  const resizeImage = async (uri) => {
    let fileSizeInKB;
    let newUri = uri;

    do {
      const manipResult = await ImageManipulator.manipulateAsync(newUri, [{ resize: { width: 500 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });
      newUri = manipResult.uri;
      const fileInfo = await FileSystem.getInfoAsync(newUri);
      fileSizeInKB = fileInfo.size / 1024;
    } while (fileSizeInKB > 500);

    return newUri;
  };

  const validateInput = () => {
    if (name.length < 5 || name.length > 25) {
      Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorNameLength'));
      return false;
    }

    // Email is optional, so we only validate if it's not empty
    if (email.length > 0 && (email.length < 5 || email.length > 25)) {
      Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorEmailLength'));
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    Alert.alert(
      t('myProfile.confirmTitle'),
      t('myProfile.confirmMessage'),
      [
        { text: t('myProfile.cancel'), style: 'cancel' },
        { text: t('myProfile.confirm'), onPress: saveProfile },
      ]
    );
  };

  const saveProfile = async () => {
    try {
      const token = await getItem('token');
      if (!token) {
        Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorToken'));
        return;
      }

      const profileData = {
        name: name || undefined,
        email: email || undefined,
        image: profileAvatar || undefined,
      };

      const response = await axios.put('https://fixkar.onrender.com/updateProvider', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert(t('myProfile.successTitle'), t('myProfile.successMessage'));
        router.back();
      } else {
        Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorUpdate'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('myProfile.errorTitle'), t('myProfile.errorUpdate'));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {profileAvatar ? (
              <Image source={{ uri: profileAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{t('myProfile.pickAvatar')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('myProfile.chooseImageSource')}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
              <Text style={styles.modalButtonText}>{t('myProfile.uploadFromGallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
              <Text style={styles.modalButtonText}>{t('myProfile.takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>{t('myProfile.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.namePlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('myProfile.emailPlaceholder')}
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('myProfile.saveProfile')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#B0B0B0',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: '#00A8A6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '80%',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
  },
  modalCloseText: {
    color: '#007BFF',
  },
  textInput: {
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  button: {
    backgroundColor: '#00A8A6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default MyProfile;
