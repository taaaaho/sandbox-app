import * as PushAPI from '@pushprotocol/restapi'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  ChainId,
  ConnectWallet,
  useAddress,
  useSigner,
} from '@thirdweb-dev/react'
import { SignerType } from '@pushprotocol/restapi'
import axios from 'axios'
import { useState } from 'react'
import { useSDKSocket } from '@/hooks/useSDKSocket'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [message, setMessage] = useState<string>()
  const [title, setTitle] = useState<string>()
  const address = useAddress()
  const signer = useSigner()
  const socketData = useSDKSocket({
    account: address,
    chainId: ChainId.Goerli,
    env: 'staging',
    isCAIP: false,
  })

  const fetchNotification = async () => {
    const res = await axios.get(`/api/push?address=${address}`)
    console.log(res.data.message)
  }
  const pushBroadcast = async () => {
    const res = await axios.post(`/api/push`, {
      title,
      message,
      kind: 'broadcast',
    })
    console.log(res.data.message)
  }
  const pushTarget = async () => {
    const res = await axios.post(`/api/push`, {
      title,
      message,
      kind: 'target',
      recipient: address,
    })
    console.log(res.data.message)
  }
  const handleOptIn = async () => {
    if (signer) {
      await PushAPI.channels.subscribe({
        signer: signer as SignerType,
        channelAddress: `eip155:${ChainId.Goerli}:0x785a58b8A172e98756b8CeCaD674ab35da4e380e`, // channel address in CAIP
        userAddress: `eip155:${ChainId.Goerli}:${address}`, // user address in CAIP
        onSuccess: () => {
          console.log('opt in success')
        },
        onError: () => {
          console.error('opt in error')
        },
        // @ts-ignore
        env: 'staging',
      })
    }
  }

  const toggleSocketConnection = () => {
    if (!socketData.pushSDKSocket?.connected) {
      socketData.pushSDKSocket?.connect()
    } else {
      socketData.pushSDKSocket?.disconnect()
    }
  }

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
        {address ? (
          <>
            <div className="flex flex-col gap-2">
              <button
                className="bg-blue-400 hover:bg-blue-300 text-white rounded px-4 py-2"
                onClick={handleOptIn}
              >
                Opt-In
              </button>
              <button
                className="bg-green-500 hover:bg-green-400 text-white rounded px-4 py-2"
                onClick={fetchNotification}
              >
                fetchNotification
              </button>
            </div>
          </>
        ) : (
          <ConnectWallet />
        )}
      </div>

      <div className="mb-32 flex flex-row text-center mt-12">
        <div>
          <h2 className={`${inter.className} mb-3 text-2xl font-semibold`}>
            Notify
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border-white block pl-2 py-1 text-black"
              id="exampleFormControlInputText"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              className="border-white block pl-2 py-1 h-24 text-black"
              id="exampleFormControlInputText"
              placeholder="Message"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={pushBroadcast}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 w-full"
            >
              Send Broadcast
            </button>
            <button
              onClick={pushTarget}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 w-full"
            >
              Send Target
            </button>

            <button
              onClick={toggleSocketConnection}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 w-full"
            >
              Socket
            </button>
            <div className="text-white">
              {String(socketData.isSDKSocketConnected)}
            </div>
            <pre style={{ color: 'green' }}>
              {JSON.stringify(socketData.feedsSinceLastConnection, null, 4)}
            </pre>
          </div>
        </div>
      </div>
    </main>
  )
}
