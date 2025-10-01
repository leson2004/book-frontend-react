import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";


interface IAppContext {
  isAuthenticated: boolean;
  user:IUser | null;
  setIsAuthenticated:(v:boolean)=>void;
  setUser:(v:IUser)=>void;
  setIsLoading:(v:boolean)=>void;
  isLoading:boolean;
}
type TProps  ={ 
   children: React.ReactNode
}
const CurrentAppContext = createContext<IAppContext | null>(null);
export const AppContext = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);

    return (
    <CurrentAppContext.Provider value={{isAuthenticated,user,setIsAuthenticated,setUser,isLoading,setIsLoading}}>
      {props.children}
    </CurrentAppContext.Provider>
  );
};
export const useCurrentApp = () => {
  const currentUserContext = useContext(CurrentAppContext);

  if (!currentUserContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentUserContext.Provider>"
    );
  }

  return currentUserContext;
};
