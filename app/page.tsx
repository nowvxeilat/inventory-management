"use client";

import { useState } from 'react';
import { InventoryApp } from '../components/inventory-mobile-app';
import { LoginPage } from '../components/login-page';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log('Current login state:', isLoggedIn);

  const handleLogin = () => {
    console.log('Login successful, updating state...');
    setIsLoggedIn(true);
    console.log('State updated to:', true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen">
      <InventoryApp />
    </main>
  );
}
