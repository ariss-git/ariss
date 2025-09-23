import { useParams } from 'react-router-dom';

const FetchSingleCourse = () => {
    const { course_id } = useParams();
    return <div>{course_id}</div>;
};

export default FetchSingleCourse;
