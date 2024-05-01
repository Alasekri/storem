import React from 'react'

interface Auth{
    loading: boolean,
    isAdmin: boolean,
    loggedIn: boolean
}
export default function useAuth() : Auth {
  return {
    loading:false,
    loggedIn:false,
    isAdmin:false
  };
    
}
