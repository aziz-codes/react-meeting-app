 import {Video,VideoOff,Mic,MicOff} from 'lucide-react'
 import { useStore } from '../context/meet-context'
const Lobby = () => {
  const {audio,video,setAudio,setVideo}  = useStore();
  return (
    <div className="flex min-h-screen items-center px-0 md:px-20">
       <div className="flex items-center w-full gap-4">
        <div className="flex-1 border h-72 rounded-md flex flex-col">
          <div className="flex-1 "></div>
          <div className="w-full justify-center flex items-center space-x-1">
            <div className=' cursor-pointer hover:bg-gray-300 rounded-sm h-8 w-8 flex justify-center items-center'>
            {video ? <VideoOff  className='h-6 w-6 ' strokeWidth={0.9} onClick={()=>setVideo(false)}/>: <Video  className='h-6 w-6 ' strokeWidth={0.9} onClick={()=>setVideo(true)}/>}
            </div>
            <div className=' cursor-pointer hover:bg-gray-300 rounded-sm h-8 w-8 flex justify-center items-center'>
           {audio? <MicOff  className='h-6 w-6' strokeWidth={0.9} onClick={()=>setAudio(false)}/> : <Mic  className='h-6 w-6' strokeWidth={0.9} onClick={()=>setAudio(true)}/> }
            </div>
           
          </div>
        </div>
        <div className="flex-1 border">buttons</div>
        </div> 
    </div>
  )
}

export default Lobby