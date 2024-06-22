'use client';

import { useForm } from 'react-hook-form';
import { axiosInstance } from '@/axios';

import styles from './page.module.css';

type LoginFormData = {
  email: string;
  password: string;
};

async function login(loginForm: LoginFormData): Promise<void> {
  await axiosInstance.post<void[]>('api/account/register', loginForm);
}

export default function LoginPage() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const onSubmit = handleSubmit((data) => login(data));
  // firstName and lastName will have correct type

  return (
    <form onSubmit={onSubmit}>
      <label>email</label>
      <input {...register('email')} />
      <label>password</label>
      <input {...register('password')} />
      <button type="submit">Login</button>
    </form>
  );
}
