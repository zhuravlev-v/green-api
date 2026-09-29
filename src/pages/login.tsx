import { useNavigate } from 'react-router';
import { LoginForm } from '@/features/login';
import { useUser } from '@/entities/user';
import type { UserCredentialsRequest } from '@/entities/user';

export default function LoginPage() {
  const navigate = useNavigate();
  const setCredentials = useUser((state) => state.setCredentials);

  const onSuccess = (credentials: UserCredentialsRequest) => {
    setCredentials(credentials);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
}
