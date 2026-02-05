import { useNavigate, useParams } from 'react-router-dom';
import { SegmentForm } from '../components/SegmentForm';

export default function CustomerSegmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return <SegmentForm segmentId={id} onBack={() => navigate(-1)} />;
}