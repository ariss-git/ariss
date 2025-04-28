import { Text, TouchableOpacity, FlatList, Image, View, StyleSheet } from 'react-native';

interface Subcategory {
  subcategory_id: string;
  subcategory_name: string;
  subcategory_image: string;
}

interface SubcategoryListProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelect: (subcategoryId: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  selectedSubcategory,
  onSelect,
}) => {
  return (
    <FlatList
      data={subcategories}
      keyExtractor={(item) => item.subcategory_id}
      contentContainerStyle={{ padding: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelect(item.subcategory_id)}
          style={{ marginBottom: 16 }}>
          {/* Shadow Container */}
          <View
            style={[
              styles.shadowContainer,
              item.subcategory_id === selectedSubcategory && { backgroundColor: '#e5e7eb' }, // light gray for selected
            ]}>
            <Image
              source={{ uri: item.subcategory_image }}
              resizeMode="cover"
              style={styles.image}
            />
            <Text style={styles.subcategoryName}>{item.subcategory_name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  subcategoryName: {
    marginTop: 8,
    fontFamily: 'WorkSans',
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
});

export default SubcategoryList;
