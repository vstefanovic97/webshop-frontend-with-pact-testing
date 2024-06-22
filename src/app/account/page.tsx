'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/axios';
import { Loader } from '@/app/components/loader';

type Account = {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  phoneNumber: number;
};

async function getAccount(): Promise<Account> {
  const result = await axiosInstance.get<Account>('api/account/profile');
  return result.data;
}

const useAccount = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccount()
      .then((account) => {
        setAccount(account);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { account, loading };
};

function AccountPage() {
  const router = useRouter();
  const { account, loading } = useAccount();

  useEffect(() => {
    if (!loading && !account) {
      router.push('/login');
      return;
    }
  }, [account, loading, router]);

  if (typeof window === 'undefined' || !account) {
    return <Loader />;
  }

  return 'Account page';
}

export default AccountPage;
