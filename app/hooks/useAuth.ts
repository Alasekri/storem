import { useSession } from 'next-auth/react';
import React from 'react'

interface Auth{
    loading: boolean,
    isAdmin: boolean,
    loggedIn: boolean
    
}
export default function useAuth() : Auth {
  const session = useSession();


  return {
    loading:session.status === 'loading',
    loggedIn:session.status === 'authenticated',
    isAdmin:false


  };
    
}
