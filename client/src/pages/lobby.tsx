import { Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useStore } from "../context/meet-context";
import VideoPlayer from "../components/video-player";

const Lobby = () => {
  const { audio, video, setAudio, setVideo, socket, stream } = useStore();

  const createRoom = () => {
    socket.emit("create-room");
  };
  return (
    <div className="flex min-h-screen items-center px-0 md:px-20">
      <div className="flex items-center w-full gap-4">
        <div className="  h-96 w-96 rounded-md flex flex-col justify-between relative">
          <div className="flex-1 h-72 rounded-md align-middle border">
            {video ? (
              <VideoPlayer stream={stream} />
            ) : (
              <h4 className="text-center align-middle">
                Enable video to share your stream
              </h4>
            )}
          </div>
          <div className="w-full justify-center flex items-center space-x-1 absolute -bottom-12 text-white">
            {video ? (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                onClick={() => setVideo((prev: boolean) => !prev)}
              >
                <Video className="w-5 h-5 text-green-500" />
                <span>Camera</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                onClick={() => setVideo((prev: boolean) => !prev)}
              >
                <VideoOff className="w-5 h-5 text-green-500" />
                <span>Camera</span>
              </button>
            )}

            {audio ? (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                onClick={() => setAudio(false)}
              >
                <MicOff className="w-5 h-5 text-green-500" />
                <span>Mic</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                onClick={() => setAudio(true)}
              >
                <Mic className="w-5 h-5 text-green-500" />
                <span>Mic</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <button
            className="px-8 py-1.5 rounded-md bg-sky-500 border-none text-white mx-auto"
            onClick={createRoom}
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
