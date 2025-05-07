import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, ActivityIndicator } from 'react-native';

import { getAllActiveCourse } from '~/api/learnServices';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { ChevronDownIcon, ChevronUpIcon } from '~/components/ui/icon';

interface CourseData {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

const Learn = () => {
  const router = useRouter();
  const [data, setData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveCourse();
      console.log(response.data);
      setData(response.data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
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
        <Text className="font-posterama text-lg font-semibold uppercase text-white">Courses</Text>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex min-h-screen w-full flex-1 flex-col gap-y-2 bg-transparent"
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        {data.map((course) => (
          <Accordion
            key={course.id}
            size="md"
            variant="filled"
            type="single"
            isCollapsible
            isDisabled={false}
            className="m-5 w-[90%] rounded border border-outline-200">
            <AccordionItem value={course.id}>
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <View className="flex w-full flex-col items-start justify-start gap-y-4">
                          <AccordionTitleText className="font-worksans text-xl font-extrabold">
                            Course: {course.title}
                          </AccordionTitleText>
                          <AccordionTitleText
                            onPress={() =>
                              router.push({
                                pathname: '/learn/read-content/[course_id]',
                                params: { course_id: course.id },
                              })
                            }
                            className="mt-6 rounded bg-stone-200 px-6 py-2 text-stone-800 shadow">
                            Get Started
                          </AccordionTitleText>
                        </View>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} className="absolute right-10 ml-0" />
                        ) : (
                          <AccordionIcon as={ChevronDownIcon} className="absolute right-10 ml-0" />
                        )}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <AccordionContentText className="font-worksans text-lg text-stone-400">
                  {course.description}
                </AccordionContentText>
                <AccordionContentText className="mt-10 font-worksans text-stone-500">
                  {course.updatedAt.split('T')[0]}
                </AccordionContentText>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </ScrollView>
    </View>
  );
};

export default Learn;
