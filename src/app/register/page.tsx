'use client';

import { useForm } from 'react-hook-form';
import { axiosInstance } from '@/axios';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

import styles from './page.module.css';

type LoginFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
};

export async function createAccount(loginForm: LoginFormData): Promise<void> {
  const { confirmPassword, ...body } = loginForm;
  await axiosInstance.post<void[]>('api/account/register', body);
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    await createAccount(data);
    router.push('/login?newAccount=true');
  });

  return (
    <div className={styles.container}>
      <h3>Create an Account</h3>
      <form onSubmit={onSubmit}>
        <input
          className={styles.inputField}
          {...register('email')}
          placeholder="email"
        />
        <div className={styles.nameGroup}>
          <input
            className={styles.inputField}
            {...register('firstName')}
            placeholder="name"
          />
          <input
            className={styles.inputField}
            {...register('lastName')}
            placeholder="last name"
          />
        </div>
        <input
          className={styles.inputField}
          {...register('phoneNumber')}
          placeholder="phone number (recommended)"
        />
        <input
          className={`${styles.inputField} ${styles.password}`}
          {...register('password')}
          placeholder="password"
          type="password"
        />
        <input
          className={styles.inputField}
          {...register('confirmPassword')}
          placeholder="confirm password"
          type="password"
        />
        <button className={styles.btn} type="submit">
          Create Account
        </button>
      </form>
      <p className={styles.alreadyHaveAccount}>
        Already have an account?{' '}
        <Link href="/login" className={styles.signIn}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
