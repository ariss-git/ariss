import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  useWindowDimensions,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import { getSingleCourse } from '~/api/learnServices';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '~/components/ui/alert-dialog';
import { Button, ButtonText } from '~/components/ui/button';

interface CourseData {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  content: string;
}

const ReadContent = () => {
  const router = useRouter();
  const { course_id } = useLocalSearchParams();
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const response = await getSingleCourse(course_id as string);
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, []);

  if (loading && !data) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center bg-stone-100">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="w-full flex-1 bg-stone-200">
      <View className="flex-row items-center justify-between bg-black px-4 py-3">
        <TouchableOpacity onPress={() => router.push('/')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text className="font-posterama text-lg font-semibold uppercase text-white">
          {data?.title}
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex min-h-screen w-full flex-1 bg-transparent px-4 py-6"
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <Text className="mb-4 text-lg font-bold">{data?.description}</Text>

        {data?.content && <RenderHtml contentWidth={width} source={{ html: data.content }} />}
      </ScrollView>
      <View className="absolute bottom-6 flex w-full items-center justify-center p-4">
        <TouchableOpacity
          onPress={() => setShowAlertDialog(true)}
          className="w-full rounded bg-stone-800 px-6 py-4 shadow">
          <Text className="text-center font-worksans text-lg font-extrabold text-stone-200 ">
            Take Test
          </Text>
        </TouchableOpacity>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text className="font-semibold text-typography-950">
                Are you sure you want to take this test exam?
              </Text>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-10">
              <Button variant="outline" action="secondary" onPress={handleClose} size="sm">
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button size="sm" onPress={handleClose}>
                <ButtonText>Yes</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </View>
  );
};

export default ReadContent;
