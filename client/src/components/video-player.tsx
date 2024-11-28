import React, { useEffect } from 'react'
import { useStore } from '../context/meet-context'

const VideoPlayer = () => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const {stream} = useStore();
    useEffect(()=>{
       if(videoRef.current){
        videoRef.current.srcObject = stream
       }
    },[stream]);
  return (
    <video ref={videoRef} muted autoPlay className='h-96 w-full rounded-md object-cover'></video>
  )
}

export default VideoPlayer