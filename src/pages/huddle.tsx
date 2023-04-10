import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useHuddle01 } from '@huddle01/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLobby, useAudio, useVideo, useRoom } from '@huddle01/react/hooks'
import { HuddleIframe, IframeConfig } from '@huddle01/huddle01-iframe'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [roomId, setRoomId] = useState<string>()
  const { initialize, isInitialized } = useHuddle01()
  // const { joinLobby } = useLobby()
  // const { joinRoom, leaveRoom } = useRoom()

  // const {
  //   fetchAudioStream,
  //   stopAudioStream,
  //   error: micError,
  //   produceAudio,
  //   stopProducingAudio,
  // } = useAudio()
  // const {
  //   fetchVideoStream,
  //   stopVideoStream,
  //   error: camError,
  //   produceVideo,
  //   stopProducingVideo,
  // } = useVideo()

  const handleCreateRoom = async () => {
    const res = await axios.post('/api/createRoom')
    console.log(res.data)
    setRoomId(res.data.data.roomId)
  }
  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID || '')
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none"></div>
      </div>

      <div className="flex-col gap-10 relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div>
        {isInitialized ? (
          <div className="flex flex-col gap-4">
            <div>
              {roomId ? (
                <div className="flex flex-col gap-4">
                  <div>Room ID: {roomId}</div>
                  <HuddleIframe
                    config={{
                      roomUrl: `https://iframe.huddle01.com/${roomId}`,
                      height: '800px',
                      width: '1000px',
                      noBorder: true,
                    }}
                  />
                  {/* <button
                    disabled={joinLobby.isCallable}
                    onClick={() => joinLobby(roomId)}
                  >
                    Join Lobby
                  </button>
                  <button
                    disabled={!fetchAudioStream.isCallable}
                    onClick={fetchAudioStream}
                  >
                    FETCH_AUDIO_STREAM
                  </button>

                  <button
                    disabled={!fetchVideoStream.isCallable}
                    onClick={fetchVideoStream}
                  >
                    FETCH_VIDEO_STREAM
                  </button>
                  <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
                    JOIN_ROOM
                  </button>

                  <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
                    LEAVE_ROOM
                  </button> */}
                  {/* <button
                    disabled={!produceVideo.isCallable}
                    onClick={() => produceVideo(camStream)}
                  >
                    Produce Cam
                  </button>

                  <button
                    disabled={!produceAudio.isCallable}
                    onClick={() => produceAudio(micStream)}
                  >
                    Produce Mic
                  </button>

                  <button
                    disabled={!stopProducingVideo.isCallable}
                    onClick={stopProducingVideo}
                  >
                    Stop Producing Cam
                  </button>

                  <button
                    disabled={!stopProducingAudio.isCallable}
                    onClick={stopProducingAudio}
                  >
                    Stop Producing Mic
                  </button> */}
                </div>
              ) : (
                <>
                  <button onClick={handleCreateRoom}>Create Room</button>
                </>
              )}
            </div>
          </div>
        ) : (
          'Please initialize'
        )}
      </div>
    </main>
  )
}
