import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className, ...rest}: ButtonProps) => {
  return (
    <button
    {...rest}
    className={clsx(
      'w-full flex h-10 items-center justify-center rounded-md bg-lime-500 px-4 text-sm font-semibold text-gray-800 transition-colors hober:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500 active:bg-lime-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      className
    )}
    >
      {children}
    </button>
  );
}