import { useHuddle01 } from '@huddle01/react'
import { Audio, Video } from '@huddle01/react/components'
import { useAudio, useVideo } from '@huddle01/react/hooks'

const Media = () => {
  // @ts-ignore
  const { meId } = useHuddle01()
  const { stream: videoStream } = useVideo()
  const { stream: audioStream } = useAudio()

  return (
    <div>
      {/* @ts-ignore */}
      <Video peerId={meId} stream={videoStream} />
      {/* @ts-ignore */}
      <Audio peerId={meId} stream={audioStream} />
    </div>
  )
}
