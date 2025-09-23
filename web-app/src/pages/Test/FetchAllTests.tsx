import { useEffect, useState } from 'react';
import { getAllQuestions } from '../../api/questionAPI';

interface Tests {
    test_id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    createdAt: string;
    course_id: string;
    course: {
        title: string;
    };
}

const FetchAllTests = () => {
    const [data, setData] = useState<Tests[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAllQuestions = async () => {
            try {
                const response = await getAllQuestions();
                console.log(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadAllQuestions();
    }, []);

    return <div>FetchAllTests</div>;
};

export default FetchAllTests;
