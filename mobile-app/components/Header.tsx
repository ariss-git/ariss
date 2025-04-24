import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

const Header = () => {
  const router = useRouter();
  return (
    <View className="flex w-full flex-row items-center justify-between bg-black px-6 pb-4 pt-11">
      <View className="flex flex-row items-center justify-center gap-x-4">
        <AntDesign
          name="user"
          size={22}
          color="white"
          onPress={() => router.push('/account/details')}
        />
        <View />
      </View>
      <Text
        onPress={() => router.push('/')}
        className="font-posterama text-5xl uppercase text-white">
        ARISS
      </Text>
      <View className="flex flex-row items-center justify-center gap-x-4">
        <Feather name="search" size={22} color="white" onPress={() => router.push('/search')} />
        <Feather name="heart" size={22} color="white" onPress={() => router.push('/wishlist')} />
      </View>
    </View>
  );
};

export default Header;
