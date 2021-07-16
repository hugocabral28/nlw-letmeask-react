import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  //
  useEffect(() => {
    //Verificando se já tinha um login pré feito 
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        //Se usuário não tiver nome ou foto disparar um erro.
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }
        // preenchendo informações de usuário
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    });

    //Se des-cadastrando do evento list.
    return () => {
      unsubscribe();
    }
  }, []);

  //Função para fazer login
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    //Pegando os resultado do login do google pelo Popup
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      //Pegando os dados de usuário.
      const { displayName, photoURL, uid } = result.user;
      //Se usuário não tiver nome ou foto disparar um erro.
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }
      // preenchendo informações de usuário
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}