import Link from 'next/link';
import styles from './header.module.css';
import { axiosInstance } from '@/axios';

interface Category {
  id: number;
  name: string;
  path: string;
  subCategories: Category[];
}

export async function getHeader(): Promise<Category[]> {
  const response = await axiosInstance.get<Category[]>('api/browse/category/header')

  return response.data;
}

export async function Header() {
  const headerCategories = await getHeader();

  return (
    <header>
      <h1 className={styles.heading}> WEB SHOP </h1>
      <nav>
        <ul className={styles.nav}>
          {headerCategories.map(({ id, path, name, subCategories }) => (
            <li key={id} className={styles.topLink}>
              <Link className={styles.link} href={`/plp/${path}/${id}`}>
                {name}
              </Link>

              <ul className={styles.dropdownMenu}>
                {subCategories.map(({ id, name, path }) => (
                  <li className={styles.bottomListItem} key={id}>
                    <Link className={styles.bottomLink} href={`/plp/${path}/${id}`}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li></li>
        </ul>
      </nav>
    </header>
  );
}
