import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from "@react-native-material/core";
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.43.16:3000/api/user';

const LoginScreen = (props) => {
    const { navigation } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState([]);

    const [rememberPassword, setRememberPassword] = useState(false);

    useEffect(() => {
        checkRememberPassword();
        downloadData();
    }, []);
 // Cập nhật dữ liệu từ server
 const updateDataFromServer = async () => {
    try {
      const response = await fetch(API_URL);
      const apiData = await response.json();
      setData(apiData.list);
    } catch (error) {
      console.log(error);
    }
  };

  // Sử dụng useFocusEffect để thêm navigation listener
  useFocusEffect(
    React.useCallback(() => {
      // Gọi hàm cập nhật dữ liệu từ server khi màn hình được focus
      updateDataFromServer();
    }, [])
  );
    const checkRememberPassword = async () => {
        try {
            const value = await AsyncStorage.getItem('rememberPassword');
            setRememberPassword(value === 'true');
        } catch (error) {
            console.log(error);
        }
    };

    const downloadData = async () => {
        try {
            const response = await fetch(API_URL);
            const apiData = await response.json();
            setData(apiData.list);
        } catch (error) {
            console.log(error);
        }
    };
    const handleLogin = async () => {
        if (username.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập tài khoản');
        } else if (password.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu');
        } else {
            if (data.length > 0) {
                const matchedItem = data.find(item => item.username === username && item.password === password && item.role == 'user');
                const isMatch = !!matchedItem;
                if (isMatch) {
                    if (rememberPassword) {
                        try {
                            // Lưu trạng thái nhớ mật khẩu và thông tin tài khoản, mật khẩu vào AsyncStorage
                            await AsyncStorage.setItem('rememberPassword', 'true');
                            await AsyncStorage.setItem('username', username);
                            await AsyncStorage.setItem('password', password);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        try {
                            // Xóa trạng thái nhớ mật khẩu và thông tin tài khoản, mật khẩu khỏi AsyncStorage
                            await AsyncStorage.removeItem('rememberPassword');
                            await AsyncStorage.removeItem('username');
                            await AsyncStorage.removeItem('password');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (matchedItem._id) {
                        await AsyncStorage.setItem('userID', matchedItem._id.toString());
                        navigation.navigate('ProductList');
                    } else {
                        Alert.alert('Thông báo', 'Lỗi xác nhận thông tin người dùng');
                    }
                } else {
                    Alert.alert("Thông báo","Tài khoản không hợp lệ");
                }
            } else {
                // Nếu dữ liệu chưa tải xuống, bạn có thể thông báo cho người dùng hoặc tải lại trang
                Alert.alert('Thông báo', 'Không thể tải dữ liệu, vui lòng thử lại sau');
            }
        }
    };


    useEffect(() => {
        const getStoredCredentials = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedPassword = await AsyncStorage.getItem('password');
                if (storedUsername && storedPassword) {
                    setUsername(storedUsername);
                    setPassword(storedPassword);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (rememberPassword) {
            getStoredCredentials();
        }
    }, [rememberPassword]);

    


    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={require('../assets/images/logo.png')} />
            <TextInput
                variant='outlined'
                label='Tài khoản'
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                secureTextEntry
                variant='outlined'
                label='Mật khẩu'
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.checkboxContainer}>
                <CheckBox
                    title='Nhớ mật khẩu'
                    checked={rememberPassword}
                    onPress={() => setRememberPassword(!rememberPassword)}
                    containerStyle={styles.checkbox}
                />
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.btnDN}>
                <Text style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 17
                }}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.textDNK}>
                <View style={styles.divider} />
                <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.viewDNK}>
                <TouchableOpacity style={styles.btnDNK}>
                    <Image style={styles.icon} source={require('../assets/images/facebook.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDNK}>
                    <Image style={styles.icon} source={require('../assets/images/google.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDNK}>
                    <Image style={styles.icon} source={require('../assets/images/apple.png')} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('Register',{downloadData:downloadData})} style={styles.btnDK}>
                <Text style={styles.btnText}>Đăng ký</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFFF',
        alignItems: 'center'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginStart: 23,        
        marginTop:15,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0
    },
    logo: {
        width: 200,
        height: 200,
        marginVertical: 50,
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: 'gray',
        marginTop:20,
    },
    btnDN: {
        width: "80%",
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#57abff',
        marginBottom: 20,
        marginTop: 30,
    },
    btnText: {
        fontWeight: 'bold',
        color: '#57abff',
        fontSize: 17
    },
    btnDK: {
        width: "80%",
        height: 50,
        borderRadius: 5,
        borderColor: '#57abff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 20
    },
    viewDNK: {
        flex: 1,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    btnDNK: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        padding: 7,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 40,
        height: 40
    },
    textDNK: {
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    divider: {
        width: '21%',
        height: 1,
        backgroundColor: 'gray'
    },
    orText: {
        fontSize: 16
    }
});

export default LoginScreen;
