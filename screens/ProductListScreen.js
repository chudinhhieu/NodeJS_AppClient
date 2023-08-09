import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.43.16:3000/api';
const API_PRODUCTS = API_URL + '/products';
const API_CATEGORIES = API_URL + '/categories';
const API_USER = API_URL + '/user';

const ProductListScreen = (props) => {
  const { navigation } = props;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [idUser, setIdUser] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState('avatar_default.png'); // State để lưu tên tệp hình đại diện của người dùng

  useEffect(() => {
    getIdUserFromStorage();
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    axios.get(API_PRODUCTS)
      .then((response) => {
        setProducts(response.data.list);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      });

    // Gọi API để lấy danh sách thể loại
    axios.get(API_CATEGORIES)
      .then((response) => {
        setCategories(response.data.list);
        if (response.data.list.length > 0) {
          setSelectedCategory(response.data.list[0]._id);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
      });
  }, []);

  useEffect(() => {
    // Gọi API để lấy thông tin người dùng và cập nhật tên tệp hình đại diện
    if (idUser) {
      axios
        .get(API_USER + `/${idUser}`)
        .then((response) => {
          setAvatarFileName(response.data.user.avatar);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        });
    }
  }, [idUser]);

  const getIdUserFromStorage = async () => {
    try {
      const idUser = await AsyncStorage.getItem('userID');
      setIdUser(idUser);
    } catch (error) {
      console.log(error);
    }
  };

  const renderProductItem = ({ item }) => {
    const formattedPrice = item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          navigation.navigate('Chi tiết sản phẩm', { productId: item._id });
        }}
      >
        <View style={styles.productItemContainer}>
          <Image
            style={styles.productImage}
            source={{ uri: `http://192.168.43.16:3000/uploads/${item.image}` }}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{formattedPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 0.3, borderColor: 'gray' }}>
        <Text style={{ fontSize: 26, color: '#57abff', fontWeight: 'bold' }}>PolyStrore</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Thông tin người dùng')}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 25 }}
            source={{
              uri: `http://192.168.43.16:3000/avatar/${avatarFileName}`,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 10, borderWidth: 1, borderRadius: 10 }}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <Picker.Item key={category._id} label={category.name} value={category._id} />
          ))}
        </Picker>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên sản phẩm..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      {products.filter((product) => product.id_category === selectedCategory && product.name.toLowerCase().includes(searchText.toLowerCase())).length === 0 && (
        <Text style={styles.noProductText}>Không có sản phẩm</Text>
      )}
      <FlatList
        data={products.filter((product) => product.id_category === selectedCategory && product.name.toLowerCase().includes(searchText.toLowerCase()))}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  noProductText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  productItemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    padding: 6,
  },
  productImage: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-around'
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  productPrice: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold'
  },
  searchContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
  },
});

export default ProductListScreen;
