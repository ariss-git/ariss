// import Ionicons from '@expo/vector-icons/Ionicons';
// import { View, TouchableOpacity, TextInput } from 'react-native';

// const Search = () => {
//   return (
//     <View className="flex min-h-screen w-full items-center justify-between bg-white px-6 py-4">
//       <TouchableOpacity className="relative mt-4 flex w-full items-center rounded-full bg-gray-100 px-6 py-4">
//         {/* Search Icon */}
//         <Ionicons
//           name="search-outline"
//           size={30}
//           color="black"
//           style={{ position: 'absolute', left: 14, top: 14 }}
//         />

//         {/* Search Input */}
//         <TextInput
//           placeholder="Search for product and more..."
//           placeholderTextColor="black"
//           className="w-full flex-1 pl-9 text-lg text-black"
//         />
//       </TouchableOpacity>
//       <View />
//     </View>
//   );
// };

// export default Search;

import { View, ActivityIndicator } from 'react-native';

const Search = () => {
  return (
    <View className="flex min-h-screen w-full items-center justify-center">
      <ActivityIndicator
        className="flex w-full items-center justify-center text-center"
        size="large"
        color="black"
      />
    </View>
  );
};

export default Search;
