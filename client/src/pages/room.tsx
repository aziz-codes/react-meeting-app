import { Video, Mic, ScreenShare, User, Send, X } from "lucide-react";
import { useStore } from "../context/meet-context";
import VideoPlayer from "../components/video-player";
import { useParams } from "react-router-dom";
import { PeerState } from "../context/peer-reducer";
import { useEffect, useState } from "react";

export default function MeetingRoom() {
  const { id } = useParams();

  const [users, setUsers] = useState([]);
  const { socket, me, peers, stream, audio, setVideo } = useStore();

  useEffect(() => {
    if (me && id) {
      socket.emit("join-room", { roomId: id, peerId: me._id });
      console.log(`id  is ${id}`);
      console.log(`peer Id  is ${me._id}`);
    }
  }, [id, me, socket]);
  console.log("peers", peers);
  return (
    <div className="h-screen w-full bg-gray-900 text-gray-200 flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Meeting Room</h1>
        <button className="text-gray-300 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Video Section */}
        <div className="flex-1 bg-gray-700 p-4">
          <div className="h-full flex flex-col gap-4">
            {/* Screen Sharing or Participant Videos */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-600 rounded-md flex items-center justify-center text-gray-300">
                <VideoPlayer stream={stream} />
              </div>
              <div className="bg-gray-600 rounded-md flex items-center justify-center text-gray-300">
                {Object.values(peers).map((peer: any) => (
                  <VideoPlayer key={peer._id} stream={peer.stream} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-72 bg-gray-800 p-4 border-l border-gray-700 flex flex-col">
          {/* Participants */}
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Participants</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <p>You</p>
              </li>
              <li className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <p>Participant 2</p>
              </li>
            </ul>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-medium mb-2">Messages</h2>
            <div className="flex-1 bg-gray-700 rounded-md p-3 overflow-y-auto">
              <p className="text-sm text-gray-400 italic">No messages yet...</p>
            </div>
            <form className="flex mt-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-l-md bg-gray-600 text-gray-300 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-500"
              >
                <Send className="w-5 h-5 text-gray-200" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-center gap-4 py-4 bg-gray-800 border-t border-gray-700">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          onClick={() => setVideo((prev: boolean) => !prev)}
        >
          <Video className="w-5 h-5 text-green-500" />
          <span>Camera</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
          <Mic className="w-5 h-5 text-green-500" />
          <span>Mic</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">
          <ScreenShare className="w-5 h-5 text-blue-500" />
          <span>Share Screen</span>
        </button>
      </div>
    </div>
  );
}
