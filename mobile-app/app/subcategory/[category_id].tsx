import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import ProductGrid from '~/components/ProductList';
import SubcategoryList from '~/components/SubcategoryList';

const API_URL = 'https://ariss-production.up.railway.app/api/products/category/sub/filter';

// ✅ Define the expected subcategory type
interface Subcategory {
  subcategory_id: string;
  subcategory_name: string;
  subcategory_image: string; // Ensure this property exists
}

const SubcategoryScreen = () => {
  const { category_id } = useLocalSearchParams();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/${category_id}`);

        // ✅ Ensure all subcategories have an image
        const formattedSubcategories: Subcategory[] = response.data.data.map(
          (subcategory: {
            subcategory_id: string;
            subcategory_name: string;
            subcategory_image?: string;
          }) => ({
            subcategory_id: subcategory.subcategory_id,
            subcategory_name: subcategory.subcategory_name,
            subcategory_image: subcategory.subcategory_image || 'https://via.placeholder.com/150', // Default image
          })
        );

        setSubcategories(formattedSubcategories);

        if (formattedSubcategories.length > 0) {
          setSelectedSubcategory(formattedSubcategories[0].subcategory_id);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [category_id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="w-full flex-1 bg-white">
      <View className="my-6 flex-1 flex-row bg-white">
        {/* Left Panel - Subcategories */}
        <View className="w-[25%] border-r border-stone-300">
          <SubcategoryList
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
            onSelect={(subcategoryId: string) => setSelectedSubcategory(subcategoryId)}
          />
        </View>

        {/* Right Panel - Products */}
        <View className="w-[75%] p-4">
          <ProductGrid subcategory_id={selectedSubcategory} />
        </View>
      </View>
    </View>
  );
};

export default SubcategoryScreen;
