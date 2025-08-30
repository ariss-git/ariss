import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black', height: 65, paddingTop: 6 },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12, marginTop: 2, fontFamily: 'WorkSans' },
      }}>
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size} color={color} />,
        }}
      />

      {/* Orders */}
      <Tabs.Screen
        name="order"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="box" size={size} color={color} />,
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="setting/profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        }}
      />

      {/* Learn */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="book" size={size} color={color} />,
        }}
      />

      {/* Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
