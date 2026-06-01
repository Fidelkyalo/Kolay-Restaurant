import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRole } from '../hooks/useRole';

export default function AdminEntry() {
    const navigate = useNavigate();
    useEffect(() => {
        setRole('admin');
        navigate('/dashboard', { replace: true });
    }, []);
    return null;
}
