import {
  createContext,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIO, { Socket } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import Peer from "peerjs";
import { peersReducer } from "./peer-reducer";
import { addPeerAction } from "./peer-actions";
interface ContextType {
  audio: boolean;
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  video: boolean;
  setAudio: React.Dispatch<React.SetStateAction<boolean>>;
  setVideo: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
  items: string[] | null;
  setItems: React.Dispatch<React.SetStateAction<string[] | null>>;
  me: Peer | null;
  setMe: React.Dispatch<React.SetStateAction<Peer | null>>;
}

const url = "http://localhost:8000";

const AppContext = createContext<any | null | ContextType>(null);

const socket = socketIO(url);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [items, setItems] = useState<string[] | null>(null);
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [me, setMe] = useState<Peer | null>(null);
  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`room/${roomId}`);
  };

  const getUsers = ({ partcipants }: { partcipants: string[] }) => {
    setItems(partcipants);
  };
  // get user stream
  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: video })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((error) => {
        console.error("Error getting user media", error);
        setStream(null);
      });
  }, [video]);
  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);

    setMe(peer);

    socket.on("room-created", enterRoom);

    socket.on("get-users", getUsers);

    return () => {
      socket.off("room-created");
    };
  }, []);

  useEffect(() => {
    if (!me || !stream) return;

    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      const call = me.call(peerId, stream);

      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    };

    const handleIncomingCall = (call: any) => {
      call.answer(stream);
      call.on("stream", (peerStream: MediaStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    };

    socket.on("user-joined", handleUserJoined);
    me.on("call", handleIncomingCall);

    return () => {
      socket.off("user-joined", handleUserJoined);
      me.off("call", handleIncomingCall);
    };
  }, [me, stream]);
  const values = {
    video,
    audio,
    setAudio,
    setVideo,
    stream,
    setStream,
    socket,
    items,
    setItems,
    me,
    setMe,
    peers,
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
