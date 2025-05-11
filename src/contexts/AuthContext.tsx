
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: 'customer' | 'staff' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'staff' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => fetchUserRole(currentSession.user.id), 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase.rpc('get_user_role');
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      console.log('User role fetched:', data);
      setUserRole(data as 'customer' | 'staff' | 'admin');
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Sign in successful:', data);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      
      // Redirect based on user role
      if (data.session) {
        await fetchUserRole(data.session.user.id);
        redirectBasedOnRole();
      }
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      console.log('Signing up with:', email, firstName, lastName);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Sign up successful:', data);
      toast({
        title: 'Registration successful',
        description: 'Please check your email for verification.',
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Sign up exception:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out');
      await supabase.auth.signOut();
      navigate('/auth/login');
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = () => {
    console.log('Redirecting based on role:', userRole);
    if (userRole === 'staff' || userRole === 'admin') {
      navigate('/'); // Staff dashboard
    } else if (userRole === 'customer') {
      navigate('/customer/dashboard'); // Customer dashboard
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        signIn,
        signUp,
        signOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
