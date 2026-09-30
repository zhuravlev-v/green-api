import { useNavigate } from 'react-router';

import { LoginForm, useLogin } from '@/features/login';
import type { InstanceCredentials } from '@/entities/instance';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const onSuccess = async (credentials: InstanceCredentials) => {
    await login(credentials);
    await navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
}
