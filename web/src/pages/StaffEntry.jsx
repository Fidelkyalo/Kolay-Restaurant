import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRole } from '../hooks/useRole';

export default function StaffEntry() {
    const navigate = useNavigate();
    useEffect(() => {
        setRole('staff');
        navigate('/dashboard', { replace: true });
    }, []);
    return null;
}
