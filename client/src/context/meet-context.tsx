 import { createContext,useState,useContext } from "react";

interface ContextType{
 audio: boolean;
 video: boolean;
 setAudio: React.Dispatch<React.SetStateAction<boolean>>;
 setVideo: React.Dispatch<React.SetStateAction<boolean>>

}

 const AppContext = createContext<ContextType|null>(null);


 export const AppContextProvider =({children}:{children:React.ReactNode})=>{
     const [video,setVideo] = useState(false);
     const [audio,setAudio] = useState(false);




     const values = {
         video,
         audio,
         setAudio,
         setVideo
     }
     return(
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
     )
 }

 export const useStore = ()=>useContext(AppContext);