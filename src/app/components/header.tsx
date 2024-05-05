import Link from 'next/link';
import styles from './header.module.css';

interface Category {
  id: number;
  name: string;
  path: string;
  subCategories: Category[];
}

async function getData(): Promise<Category[]> {
  const res = await fetch('https://web-shop.dev/api/browse/category/header');

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function Header() {
  const headerCategories = await getData();

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
