import { useContext } from 'react';
/* #######importando contexts#######*/
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  //usar o "useContext()" para pegar os dados do usuário.
  const value = useContext(AuthContext)
  return value;
}