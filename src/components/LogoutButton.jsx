import { LogOut } from 'lucide-react';
import { logoutUser } from '../api/authService';

const LogoutButton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer';
  
  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md',
  };

  return (
    <button
      onClick={logoutUser}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      title="Sign out"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
};

export default LogoutButton;