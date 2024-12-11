import {
  createContext,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import Peer from "peerjs";
import { peersReducer } from "./peer-reducer";
import { addPeerAction, removePeerAction } from "./peer-actions";

const url = "http://localhost:8000";

const AppContext = createContext<any | null>(null);

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
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`room/${roomId}`);
  };

  const getUsers = ({ partcipants }: { partcipants: string[] }) => {
    setItems(partcipants);
  };
  const removeUser = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };
  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id || "");

    //  getting screen share from participants
    if (me?.connections) {
      // Check if `connections` is a `Map`
      if (me.connections instanceof Map) {
        me.connections.forEach((connectionsArray, peerId) => {
          const videoTrack = stream
            ?.getTracks()
            .find((track) => track.kind === "video");
          if (connectionsArray.length > 0) {
            connectionsArray[0].peerConnection
              .getSenders()[1]
              .replaceTrack(videoTrack)
              .catch((err: any) =>
                console.error("Error replacing track in Map:", err)
              );
          }
        });
      } else {
        // Handle as an Object (current implementation)
        Object.values(me.connections).forEach((connectionsArray: any) => {
          const videoTrack = stream
            ?.getTracks()
            .find((track) => track.kind === "video");
          if (connectionsArray.length > 0) {
            connectionsArray[0].peerConnection
              .getSenders()[1]
              .replaceTrack(videoTrack)
              .catch((err: any) =>
                console.error("Error replacing track in Object:", err)
              );
          }
        });
      }
    }
  };
  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
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
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((err) => console.log("Media error: ", err));

    socket.on("room-created", enterRoom);
    socket.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    socket.on("user-stop-sharing", () => setScreenSharingId(""));
    socket.on("get-users", getUsers);
    socket.on("user-disconnected", removeUser);
    return () => {
      socket.off("room-created");
      socket.off("get-users");
      socket.off("user-disconnected");
      socket.off("user-started-sharing");
      socket.off("user-stop-sharing");
      socket.off("user-joined");
    };
  }, []);

  useEffect(() => {
    if (!me || !stream) return;

    console.log("Setting up user-joined handler");

    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      console.log("User joined with peerId:", peerId);
      const call = me.call(peerId, stream);

      call.on("stream", (peerStream) => {
        console.log("Stream received from peer:", peerId);
        dispatch(addPeerAction(peerId, peerStream));
      });
    };

    const handleIncomingCall = (call: any) => {
      console.log("Incoming call from peer:", call.peer);
      call.answer(stream);

      call.on("stream", (peerStream: MediaStream) => {
        console.log("Stream received from incoming call:", call.peer);
        dispatch(addPeerAction(call.peer, peerStream));
      });
    };

    socket.on("user-joined", handleUserJoined);
    me.on("call", handleIncomingCall);

    return () => {
      console.log("Cleaning up handlers for user-joined and incoming call");
      socket.off("user-joined", handleUserJoined);
      me.off("call", handleIncomingCall);
    };
  }, [me, stream]);

  useEffect(() => {
    if (screenSharingId) {
      socket.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      socket.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);
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
    shareScreen,
    roomId,
    setRoomId,
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
