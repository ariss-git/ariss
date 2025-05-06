import { Text, ScrollView, View } from 'react-native';

const Ledger = () => {
  return (
    <ScrollView
      className="flex min-h-screen w-full flex-1 flex-col gap-y-10 bg-transparent"
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text className="text-stone-500">You have not placed any orders yet</Text>
    </ScrollView>
  );
};

export default Ledger;
