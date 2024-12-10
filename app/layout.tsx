import React from 'react';
import Link from 'next/link';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Alien Recipe Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header className="header">
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/ingredients">Ingredients</Link></li>
              <li><Link href="/cooking-methods">Cooking Methods</Link></li>
              <li><Link href="/cooking-steps">Cooking Steps</Link></li>
              <li><Link href="/generate-recipe">Generate Recipe</Link></li>
              <li><Link href="/search-recipes">Search Recipes</Link></li>
            </ul>
          </nav>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <p>© 2024 Alien Recipe Generator</p>
        </footer>
      </body>
    </html>
  );
}
