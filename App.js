// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductListScreen from './screens/ProductListScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SplashScreen from './screens/SplashScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen options={{ headerShown: false }} name="Splash" component={SplashScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ProductList" component={ProductListScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen  name="Thông tin người dùng" component={UserProfileScreen} />
        <Stack.Screen  name="Chi tiết sản phẩm" component={ProductDetailScreen} />
        <Stack.Screen  name="Đổi mật khẩu" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
