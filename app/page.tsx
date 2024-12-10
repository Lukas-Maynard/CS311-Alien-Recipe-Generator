import Link from 'next/link';
import styles from './home/page.module.css'; // Import custom styles

const HomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Alien Recipe Generator</h1>
        <p>Your intergalactic cooking assistant!</p>
      </header>
      
      <section className={styles.intro}>
        <p>
          Welcome to the Alien Recipe Generator! Get ready to discover new, out-of-this-world recipes using ingredients from across the universe.
        </p>
      </section>

      <section className={styles.navigation}>
        <h2>What would you like to do today?</h2>
        <div className={styles.links}>
          <Link href="/generate-recipe" className={styles.link}>
            <button className={styles.button}>Generate a New Recipe</button>
          </Link>
          <Link href="/search-recipes" className={styles.link}>
            <button className={styles.button}>Search for Recipes</button>
          </Link>
          <Link href="/ingredients" className={styles.link}>
            <button className={styles.button}>Manage Ingredients</button>
          </Link>
          <Link href="/cooking-methods" className={styles.link}>
            <button className={styles.button}>Manage Cooking Methods</button>
          </Link>
          <Link href="/cooking-steps" className={styles.link}>
            <button className={styles.button}>Manage Cooking Steps</button>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Alien Recipe Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
