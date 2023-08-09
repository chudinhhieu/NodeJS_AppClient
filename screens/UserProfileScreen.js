import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'http://192.168.43.16:3000/api';
const API_USERS = API_URL + '/user';

const UserProfileScreen = (props) => {
  const [user, setUser] = useState(null);
  const [id, setID] = useState(null);

  const [avatarFileName, setAvatarFileName] = useState('avatar_default.png');
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const idUser = await AsyncStorage.getItem('userID');
      setID(idUser);
      const response = await axios.get(`${API_USERS}/${idUser}`);
      setUser(response.data.user);
      setAvatarFileName(response.data.user.avatar);
    } catch (error) {
      console.log(error);
    }
  };
  // Trong hàm selectImage
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const imageResult = await ImagePicker.launchImageLibraryAsync();
  
    if (!imageResult.canceled) {
      const selectedImage = imageResult.assets[0];
  
      // Gửi hình ảnh lên máy chủ
      const formData = new FormData();
      formData.append('avatar', {
        uri: selectedImage.uri,
        name: 'avatar.jpg', // Đặt tên tệp ảnh khi gửi lên máy chủ
        type: 'image/jpeg', // Đặt kiểu dữ liệu là hình ảnh JPEG
      });
  
      try {
        const response = await axios.put(`${API_USERS}/change-avatar/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Cập nhật tên tệp hình ảnh mới trong state
        setAvatarFileName(response.data.user.avatar);
      } catch (error) {
        console.log(error);
      }
    }
  };
  

  const handleChangePassword = () => {
    // Xử lý sự kiện khi nhấn nút "Đổi mật khẩu" ở đây
    // Ví dụ: chuyển đến màn hình đổi mật khẩu
    props.navigation.navigate('Đổi mật khẩu', { idUser: id });
  };

  const handleLogout = () => {
    // Xử lý sự kiện khi nhấn nút "Đăng xuất" ở đây
    // Ví dụ: xóa thông tin đăng nhập từ AsyncStorage và chuyển về màn hình đăng nhập
    AsyncStorage.removeItem('userID');
    props.navigation.navigate('Login');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <TouchableOpacity onPress={selectImage} >
        <Image
          style={styles.avatar}
          source={{
            uri: `http://192.168.43.16:3000/avatar/${avatarFileName}`,
          }}
        />
        </TouchableOpacity>
        
        <Text style={styles.fullname}>{user.fullname}</Text>
      </View>
      <Text style={styles.ttnd}>Thông tin người dùng</Text>
      <Text style={styles.text}>Tài khoản: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>

      {/* View cha bao bọc hai nút */}
      <View style={styles.buttonContainer}>
        {/* Nút "Đổi mật khẩu" */}
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        {/* Nút "Đăng xuất" */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  user: {
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  fullname: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ttnd: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute', // Bố trí tuyệt đối
    bottom: 16, 
    left: 16, 
    right: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  button: {
    backgroundColor: '#57abff',
    padding: 10,
    borderRadius: 5,
    width: '48%', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserProfileScreen;
