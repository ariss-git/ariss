import { useParams } from 'react-router-dom';

const UpdateTest = () => {
    const { test_id } = useParams();
    return <div>{test_id}</div>;
};

export default UpdateTest;
