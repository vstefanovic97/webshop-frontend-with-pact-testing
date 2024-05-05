import styles from './ImageShowcase.module.css';

export default function ImageShowCase({ images, className }: { images: string[], className: string }) {
  return (
    <div className={`${styles.container} ${className}`}>
      {images.map((image, i) => (
        <img
          key={image}
          className={i === 2 ? styles.largeImg : styles.image}
          src={image}
          alt="don't have"
        />
      ))}
    </div>
  );
}
