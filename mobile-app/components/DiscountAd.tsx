import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

import { ButtonText, Button } from './ui/button';

const DiscountAd = () => {
  const router = useRouter();
  return (
    <View className="mt-12 flex min-h-[200px] w-full flex-col items-center justify-center gap-y-2 bg-black p-4">
      <Text className="font-worksans text-center text-lg font-semibold capitalize tracking-tight text-white/60">
        Use coupon code before it expires!
      </Text>
      <Button size="xl" className="rounded-lg px-6 py-2" onPress={() => router.push('/discount')}>
        <ButtonText className="font-worksans">Discounts</ButtonText>
      </Button>
    </View>
  );
};

export default DiscountAd;
