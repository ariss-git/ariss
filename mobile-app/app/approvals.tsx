import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import {
  approveTechnician,
  deleteTechnician,
  disapproveTechnician,
  getTechnicianProfileForDealer,
} from '~/api/approvalServices';
import { dealerProfile } from '~/api/authServices';
import { useAuthStore } from '~/store/auth';

type TechData = {
  tech_id: string;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  isPassed: boolean;
  usertype: string;
  isApproved: boolean;
  createdAt: string;
  dealerid: string;
};

const Approval = () => {
  const [technicianData, setTechnicianData] = useState<TechData[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { token } = useAuthStore.getState();

  const router = useRouter();

  if (!token) {
    throw new Error('Token not found');
  }

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(false);
      try {
        const user = await dealerProfile(token);
        setUserData(user.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fetchTechnicians = async () => {
    if (!userData?.dealer_id) return; // Prevent fetching with undefined dealer_id

    setLoading(true);
    try {
      const response = await getTechnicianProfileForDealer(userData.dealer_id);
      console.log(response.data);
      setTechnicianData(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [userData]); // <-- Notice this! it depends on userData now

  if (loading || !userData || !technicianData) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const handleDelete = async (tech_id: string) => {
    if (!tech_id) return;
    setLoading(true);
    try {
      await deleteTechnician(tech_id);
      alert('Techinician Deleted');
      fetchTechnicians();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (dealer_id: string, tech_id: string) => {
    if (!dealer_id || !tech_id) return;
    setLoading(true);
    try {
      await approveTechnician(dealer_id, tech_id);
      alert('Technician Approved');
      fetchTechnicians();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisapproval = async (dealer_id: string, tech_id: string) => {
    if (!dealer_id || !tech_id) return;
    setLoading(true);
    try {
      await disapproveTechnician(dealer_id, tech_id);
      alert('Technician Disapproved');
      fetchTechnicians();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Tabs */}
      <View className="w-full flex-row bg-stone-200">
        {/* Active Tab - Technicians */}
        <TouchableOpacity
          onPress={() => router.push('/approvals')}
          className="flex-1 items-center justify-center border-b-4 border-black bg-white py-4">
          <Text className="font-worksans text-lg font-extrabold text-black">Technicians</Text>
        </TouchableOpacity>

        {/* Inactive Tab - Back Office */}
        <TouchableOpacity
          onPress={() => router.push('/approvals/backoffices')}
          className="flex-1 items-center justify-center py-4">
          <Text className="font-worksans text-lg font-semibold text-stone-500">Back Office</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        <View className="flex min-h-screen w-full flex-col items-start justify-start gap-y-6 bg-stone-100 p-4">
          <View className="flex w-full flex-row items-center justify-start gap-x-4">
            <TouchableOpacity onPress={() => router.push('/setting/profile')}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text className="font-worksans text-2xl font-extrabold text-black">
              {userData?.business_name}({total}):
            </Text>
          </View>
          {technicianData.map((tech, idx) => (
            <View
              key={idx}
              className="flex w-full flex-col items-start justify-start gap-y-2 rounded-2xl bg-white p-6 shadow-md shadow-black/10">
              <Text className="font-worksans text-stone-800">
                Name: {tech.first_name} {tech.last_name}
              </Text>
              <Text className="font-worksans text-stone-800">Phone: {tech.phone}</Text>
              <Text className="font-worksans text-stone-800">Email: {tech.email}</Text>
              <Text className="font-worksans text-stone-800">
                Registered on: {tech.createdAt.split('T')[0]}
              </Text>
              <Text className="font-worksans text-stone-800">Usertype: {tech.usertype}</Text>
              <Text className="font-worksans text-stone-800">
                Status: {tech.isApproved ? 'Approved' : 'Not Approved'}
              </Text>

              <View className="mt-6 flex w-full flex-row items-center justify-between">
                <TouchableOpacity className="rounded-full bg-stone-800 px-6 py-2">
                  {tech.isApproved ? (
                    <Text
                      className="text-stone-200"
                      onPress={() => handleDisapproval(userData?.dealer_id, tech.tech_id)}>
                      Disapprove
                    </Text>
                  ) : (
                    <Text
                      className="text-stone-200"
                      onPress={() => handleApproval(userData?.dealer_id, tech.tech_id)}>
                      Approve
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(tech.tech_id)}
                  className="rounded-full bg-red-600 px-6 py-2">
                  <Text className="text-stone-200">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Approval;
