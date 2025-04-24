import { Text, TouchableOpacity, FlatList, Image } from 'react-native';

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
      renderItem={({ item }) => (
        <TouchableOpacity
          className={`border-b p-4 ${
            item.subcategory_id === selectedSubcategory ? 'bg-gray-200' : ''
          }`}
          onPress={() => onSelect(item.subcategory_id)}>
          <Image
            source={{ uri: item.subcategory_image }}
            className="rounded-t-lg"
            resizeMode="cover"
            style={{ width: 80, height: 80 }}
          />
          <Text className="mt-2 text-center font-worksans font-medium text-black">
            {item.subcategory_name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default SubcategoryList;
