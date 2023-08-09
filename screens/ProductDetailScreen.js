import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.43.16:3000/api';
const API_PRODUCTS = API_URL + '/products';

const ProductDetailScreen = ({ route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState(null);

  // Lấy thông tin sản phẩm từ route.params.productId
  const productId = route.params?.productId;

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của sản phẩm dựa vào productId
    axios
      .get(`${API_PRODUCTS}/${productId}`)
      .then((response) => {
        setProductData(response.data.product); // Lưu dữ liệu vào state
        setIsLoading(false); // Đã lấy dữ liệu thành công, isLoading = false
      })
      .catch((error) => {
        console.error('Error fetching product detail:', error);
        setIsLoading(false); // Có lỗi xảy ra, isLoading = false
      });
  }, [productId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!productData) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin sản phẩm.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
            style={styles.productImage}
            source={{ uri: `http://192.168.43.16:3000/uploads/${productData.image}` }}
          />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productData.name}</Text>
        <Text style={styles.productPrice}>{productData.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
        <Text style={styles.ttkt}>Thông số kĩ thuật</Text>
        <Text style={styles.productDescription}>{productData.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  productImage: {
    marginTop:50,
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  productInfo: {
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom:5
  },
  productPrice: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
  },
  ttkt:{
    fontSize:18,
    fontWeight: 'bold',
    marginBottom:5,
  }
});

export default ProductDetailScreen;
