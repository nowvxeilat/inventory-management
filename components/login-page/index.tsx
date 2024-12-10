"use client";

import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LoginPageProps {
  onLogin: () => void;
}

const CORRECT_PASSWORD = '7198258';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPassword = password.trim();
    console.log('Entered password:', trimmedPassword);
    console.log('Correct password:', CORRECT_PASSWORD);
    console.log('Length of entered:', trimmedPassword.length);
    console.log('Length of correct:', CORRECT_PASSWORD.length);
    console.log('Are equal?', trimmedPassword === CORRECT_PASSWORD);
    
    if (trimmedPassword === CORRECT_PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">כניסה למערכת מלאי</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPassword(value);
                setError(false);
              }}
              className={`w-full text-center text-2xl tracking-wider ${error ? 'border-red-500' : ''}`}
              placeholder="הכנס סיסמה"
              dir="ltr"
              maxLength={7}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-center">סיסמה שגויה</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            כניסה
          </Button>
        </form>
      </div>
    </div>
  );
}
