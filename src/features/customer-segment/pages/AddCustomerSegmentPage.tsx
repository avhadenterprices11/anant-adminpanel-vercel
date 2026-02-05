import { useNavigate } from 'react-router-dom';
import { SegmentForm } from '../components/SegmentForm';

export default function AddCustomerSegmentPage() {
    const navigate = useNavigate();

    return <SegmentForm onBack={() => navigate(-1)} />;
}