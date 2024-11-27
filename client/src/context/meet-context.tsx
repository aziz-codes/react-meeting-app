import { createContext, useState, useContext, useEffect } from "react";

interface ContextType {
  audio: boolean;
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  video: boolean;
  setAudio: React.Dispatch<React.SetStateAction<boolean>>;
  setVideo: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<ContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);


    // get user stream
    useEffect(()=>{
        navigator.mediaDevices
         .getUserMedia({ audio: audio, video: video })
         .then((mediaStream) => {
            setStream(mediaStream);
          })
         .catch((error) => {
            console.error("Error getting user media", error);
          });
      
    },[])


  const values = {
    video,
    audio,
    setAudio,
    setVideo,
    stream,
    setStream,
  };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useStore = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useStore must be used within an AppContextProvider");
  }
  return context;
};
