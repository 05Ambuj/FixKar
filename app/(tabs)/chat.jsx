import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  ScrollView, 
  Modal, 
  KeyboardAvoidingView, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

// Online/Offline Indicator Component
const StatusIndicator = ({ status }) => {
  const isOnline = status === 'online';
  return (
    <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#34C759' : '#A9A9A9' }]} />
  );
};

const ChatPage = () => {
  const [activeUserId, setActiveUserId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [tabAnimation] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollViewRef = useRef(null);

  const users = [
    { id: '1', name: 'John Doe', phone: '+1234567890', status: 'online', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '2', name: 'Jane Smith', phone: '+0987654321', status: 'offline', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Bob Johnson', phone: '+1122334455', status: 'online', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Alice Johnson', phone: '+9988776655', status: 'offline', avatar: 'https://i.pravatar.cc/150?img=5 ' },
    // Add more users as needed
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (userId) => {
    setActiveUserId(userId);
    animateTabTransition();
  };

  const handleBackToUserList = () => {
    setActiveUserId(null);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        text: messageInput,
        fromProvider: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prevHistory => ({
        ...prevHistory,
        [activeUserId]: [...(prevHistory[activeUserId] || []), newMessage],
      }));
      setMessageInput('');
      setTyping(false);
    }
  };

  const animateTabTransition = () => {
    Animated.timing(tabAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => tabAnimation.setValue(0));
  };

  const tabAnimationStyle = {
    opacity: tabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
    }),
  };

  const openWhatsApp = () => {
    const phone = '+917779845889';
    const message = 'Hello, I would like to connect with you.';
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${message}`).catch(() => {
      alert('WhatsApp is not installed on your device');
    });
    setModalVisible(false);
  };

  const makeCall = () => {
    const phone = '+917779845889';
    Linking.openURL(`tel:${phone}`).catch(() => {
      alert('Unable to make a call');
    });
    setModalVisible(false);
  };

  const sendTextMessage = () => {
    const phone = '+917779845889';
    const message = 'Hello, I would like to connect with you.';
    Linking.openURL(`sms:${phone}?body=${message}`).catch(() => {
      alert('Unable to send SMS');
    });
    setModalVisible(false);
  };

  const handleTyping = (text) => {
    setMessageInput(text);
    setTyping(text.length > 0);
  };

  // Auto-scroll to the latest message when chatHistory updates
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory, activeUserId]);

  return (
    <View style={styles.container}>
      {/* Top Section with Search and Mic Icon */}
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="#00A8A6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#fff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={24} color="#00A8A6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User List and Chat Window */}
      {activeUserId === null ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserSelect(item.id)}
            >
              {/* User Avatar */}
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              {/* User Name and Status Indicator */}
              <View style={styles.userInfo}>
                <Text style={styles.userText}>{item.name}</Text>
                <View style={styles.statusContainer}>
                  <StatusIndicator status={item.status} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Animated.View style={[styles.chatContainer, tabAnimationStyle]}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleBackToUserList} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={24} color="#00A8A6" />
            </TouchableOpacity>
            {/* Chat Header with User Info */}
            <View style={styles.chatHeaderInfo}>
              <Image 
                source={{ uri: users.find(user => user.id === activeUserId)?.avatar }} 
                style={styles.chatAvatar} 
              />
              <View style={styles.chatUserInfo}>
                <Text style={styles.chatHeaderText}>
                  {users.find(user => user.id === activeUserId)?.name}
                </Text>
                <View style={styles.statusContainer}>
                  <StatusIndicator status={users.find(user => user.id === activeUserId)?.status} />
                  <Text style={styles.statusText}>
                    {users.find(user => user.id === activeUserId)?.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView 
            contentContainerStyle={styles.messageList} 
            ref={scrollViewRef}
          >
            {chatHistory[activeUserId]?.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.fromProvider ? styles.providerMessage : styles.userMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </View>
            ))}
            {typing && (
              <View style={styles.typingIndicatorContainer}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#00A8A6" />
              </View>
            )}
          </ScrollView>

          {/* Message Input */}
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={24} color="#00A8A6" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#CDCDE0"
                value={messageInput}
                onChangeText={handleTyping}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Ionicons name="send-outline" size={24} color="#00A8A6" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* Modal for Connect Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Connect Options</Text>
                <TouchableOpacity onPress={openWhatsApp} style={styles.modalButton}>
                  <Ionicons name="logo-whatsapp" size={24} color="#075E54" style={styles.icon} />
                  <Text style={styles.modalButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={makeCall} style={styles.modalButton}>
                  <Ionicons name="call-outline" size={24} color="#075E54" style={styles.icon} />
                  <Text style={styles.modalButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={sendTextMessage} style={styles.modalButton}>
                  <Ionicons name="chatbox-outline" size={24} color="#075E54" style={styles.icon} />
                  <Text style={styles.modalButtonText}>Text</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.closeButton]}>
                  <Ionicons name="close-outline" size={24} color="#075E54" style={styles.icon} />
                  <Text style={[styles.modalButtonText, styles.closeButtonText]}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F7',
  },
  topSection: {
    padding: 16,
    backgroundColor: '#99D6D4',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  connectButton: {
    backgroundColor: '#00A8A6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FAF8F7',
    
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4B4B68',
  },
  backButton: {
    marginRight: 10,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatUserInfo: {
    flexDirection: 'column',
  },
  chatHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  providerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#B2E1DF',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
  },
  messageText: {
    color: 'black',
    fontSize: 16,
  },
  timestamp: {
    color: 'black',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  typingIndicator: {
    color: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontSize: 14,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B4B68',
    padding: 10,
  },
  emojiButton: {
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    color: 'black',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00A8A6',
    
    borderRadius: 30,
    marginHorizontal: 10,
  },
  sendButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#00A8A6',
  },
  modalButtonText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#fff',
  },
  icon: {
    marginRight: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'black',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatPage;