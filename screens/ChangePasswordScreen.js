import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.43.16:3000/api';
const API_USERS = API_URL + '/user';
const API_CHANGE_PASSWORD = API_URL + '/user/change-password';

const ChangePasswordScreen = (props) => {
  const { navigation } = props;
  const { idUser } = props.route.params;
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    
    useEffect(() => {
        getUserInfo();
      }, []);
    
      const getUserInfo = async () => {
        try {
          const response = await axios.get(`${API_USERS}/${idUser}`);
          setUser(response.data.user);
        } catch (error) {
          console.log(error);
        }
      };
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (user.password !== oldPassword) {
            setError('Mật khẩu cũ không khớp');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        try {
            await axios.put(`${API_CHANGE_PASSWORD}/${idUser}`, {
                password: newPassword,
            });
            setError('Đổi mật khẩu thành công.');
            navigation.navigate('Login');
            
        } catch (error) {
            setError('Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu cũ.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu cũ"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#57abff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default ChangePasswordScreen;
