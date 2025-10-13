// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '@/api/axios';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'admin' | 'project_officer' | 'csr_head' | 'ngo_partner';
//   organization?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   loginWithOtp: (phoneNumber: string, otp: string, deviceInfo: string) => Promise<boolean>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for existing session
//     const savedUser = localStorage.getItem('cms_user');
//     const token = localStorage.getItem('token');
    
//     if (savedUser && token) {
//       setUser(JSON.parse(savedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     setIsLoading(true);
    
//     try {
//       console.log('AuthContext: Logging in with email:', email);
//       const response = await api.post('/api/auth/login', {
//         email,
//         password
//       });

//       console.log('AuthContext: Login response:', response.data);

//       if (response.data && response.data.token) {
//         const { token, user: userData } = response.data;
        
//         // Store token
//         localStorage.setItem('token', token);
        
//         // Create user session
//         const userSession: User = {
//           id: userData.id || '1',
//           email: userData.email || email,
//           name: userData.name || userData.username || 'User',
//           role: userData.role || 'admin',
//           organization: userData.organization || 'CMS Foundation'
//         };
        
//         console.log('AuthContext: User session created:', userSession);
//         setUser(userSession);
//         localStorage.setItem('cms_user', JSON.stringify(userSession));
//         setIsLoading(false);
//         return true;
//       }
      
//       console.log('AuthContext: No token in response');
//       setIsLoading(false);
//       return false;
//     } catch (error) {
//       console.error('AuthContext: Login error:', error);
//       setIsLoading(false);
//       return false;
//     }
//   };

//   const loginWithOtp = async (phoneNumber: string, otp: string, deviceInfo: string): Promise<boolean> => {
//     setIsLoading(true);
    
//     try {
//       console.log('AuthContext: Verifying OTP for phone:', phoneNumber);
//       const response = await api.post('/api/auth/verify-otp', {
//         phoneNumber,
//         otpCode: otp,
//         deviceInfo
//       });

//       console.log('AuthContext: OTP verification response:', response.data);

//       if (response.data && response.data.token) {
//         const { token, user: userData } = response.data;
        
//         // Store token
//         localStorage.setItem('token', token);
        
//         // Create user session
//         const userSession: User = {
//           id: userData.id || '1',
//           email: userData.email || '',
//           name: userData.name || userData.username || 'User',
//           role: userData.role || 'admin',
//           organization: userData.organization || 'CMS Foundation'
//         };
        
//         console.log('AuthContext: User session created:', userSession);
//         setUser(userSession);
//         localStorage.setItem('cms_user', JSON.stringify(userSession));
//         setIsLoading(false);
//         return true;
//       }
      
//       console.log('AuthContext: No token in OTP response');
//       setIsLoading(false);
//       return false;
//     } catch (error) {
//       console.error('AuthContext: OTP verification error:', error);
//       setIsLoading(false);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('cms_user');
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, loginWithOtp, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'project_officer' | 'csr_head' | 'ngo_partner';
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for demonstration
const dummyUsers = [
  {
    id: '1',
    email: 'admin@cmsfoundation.org',
    password: 'admin123',
    name: 'CMS Admin',
    role: 'admin' as const,
    organization: 'CMS Foundation'
  },
  {
    id: '2',
    email: 'officer@cmsfoundation.org',
    password: 'officer123',
    name: 'Project Officer',
    role: 'project_officer' as const,
    organization: 'CMS Foundation'
  },
  {
    id: '3',
    email: 'head@cmsfoundation.org',
    password: 'head123',
    name: 'CSR Head',
    role: 'csr_head' as const,
    organization: 'CMS Foundation'
  },
  {
    id: '4',
    email: 'ngo@healthfoundation.org',
    password: 'ngo123',
    name: 'Health Care Foundation',
    role: 'ngo_partner' as const,
    organization: 'Health Care Foundation'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('cms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = dummyUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        organization: foundUser.organization
      };
      
      setUser(userSession);
      localStorage.setItem('cms_user', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}