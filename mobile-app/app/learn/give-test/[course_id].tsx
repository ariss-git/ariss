import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

import { getQuestionsForCourse } from '~/api/learnServices';
import { Button, ButtonText } from '~/components/ui/button';
import { CircleIcon } from '~/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '~/components/ui/radio';

const Exams = () => {
  const { course_id } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await getQuestionsForCourse(course_id as string);
        console.log(response.data);
        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleOptionSelect = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  if (loading) {
    return (
      <View className="flex min-h-screen w-full items-center justify-center bg-stone-200">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView className="p-4" contentContainerStyle={{ padding: 16 }}>
      {questions.map((question, index) => (
        <View key={question.id} style={{ marginBottom: 24 }}>
          <Text
            className="font-worksans font-extrabold"
            style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            {index + 1}. {question.text}
          </Text>

          <RadioGroup
            value={answers[question.id]}
            onChange={(val: string) => handleOptionSelect(question.id, val)}>
            <Radio value="A">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} color="black" size="lg" />
              </RadioIndicator>
              <RadioLabel style={{ color: 'black' }} className="text-stone-800">
                {question.optionA}
              </RadioLabel>
            </Radio>

            <Radio value="B">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} color="black" size="lg" />
              </RadioIndicator>
              <RadioLabel style={{ color: 'black' }} className="text-stone-800">
                {question.optionB}
              </RadioLabel>
            </Radio>

            <Radio value="C">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} color="black" fill="black" size="lg" />
              </RadioIndicator>
              <RadioLabel style={{ color: 'black' }} className="text-stone-800">
                {question.optionC}
              </RadioLabel>
            </Radio>

            <Radio value="D">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} color="black" size="lg" />
              </RadioIndicator>
              <RadioLabel style={{ color: 'black' }} className="text-stone-800">
                {question.optionD}
              </RadioLabel>
            </Radio>
          </RadioGroup>
        </View>
      ))}
      <View className="flex w-full items-center justify-center">
        <Button className="w-full bg-stone-800">
          <ButtonText className="text-lg text-stone-200">Submit</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Exams;
