'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '@/axios';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';

type AuthResponse = {
  access_token: string;
};

type LoginFormData = {
  email: string;
  password: string;
};

async function login(loginForm: LoginFormData): Promise<string> {
  const result = await axiosInstance.post<AuthResponse>(
    'api/auth/login',
    loginForm
  );
  return result.data.access_token;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const token = await login(data);
    localStorage.setItem('auth-token', token);
    router.push('/account');
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>SIGN IN</h3>
      <form onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          {...register('email')}
          placeholder="Email"
        />
        <input
          className={styles.inputField}
          {...register('password')}
          placeholder="Password"
          type="password"
        />
        <button className={styles.btn} type="submit">
          Login
        </button>
      </form>

      <p className={styles.noAccountText}>
        Don&apos;t have an account yet? Register <Link className={styles.registerLink} href="/register">here</Link>
      </p>
    </div>
  );
}
