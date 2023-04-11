import * as PushAPI from '@pushprotocol/restapi'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Chat } from '@pushprotocol/uiweb'
import { ITheme } from '@pushprotocol/uiweb'
import { useAddress, useSigner, useWallet } from '@thirdweb-dev/react'
import { Signer } from 'ethers'
import { SignerType } from '@pushprotocol/restapi'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const address = useAddress()
  const signer = useSigner()
  const handleUser = async () => {
    // const user = await PushAPI.user.create({
    //   account: address,
    // })
    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
      // @ts-ignore
      env: 'staging',
    })
    console.log(user)

    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer as SignerType,
      // @ts-ignore
      env: 'staging',
    })
    // console.log(pgpDecryptedPvtKey)

    // conversation hash are also called link inside chat messages
    const conversationHash = await PushAPI.chat.conversationHash({
      account: `eip155:${address}`,
      conversationId: 'eip155:0x319a1b3D651695B2d69ccDfD98Bf94F2B839A77d', // receiver's address or chatId of a group
      // @ts-ignore
      env: 'staging',
    })

    // actual api
    const chatHistoryLatest = await PushAPI.chat.latest({
      threadhash: conversationHash.threadHash,
      account: `eip155:${address}`,
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
      // @ts-ignore
      env: 'staging',
    })
    console.log(chatHistoryLatest)

    // actual api
    const chatHistory = await PushAPI.chat.history({
      threadhash: conversationHash.threadHash,
      account: 'eip155:0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7',
      limit: 3,
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
      // @ts-ignore
      env: 'staging',
    })
    console.log(chatHistory)
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
      </div>
      <button
        onClick={handleUser}
        className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 w-full"
      >
        User
      </button>
      <div>
        {address && (
          <Chat
            account={address} //user address
            supportAddress="0x785a58b8A172e98756b8CeCaD674ab35da4e380e" //support address
            // @ts-ignore
            env="staging"
          />
        )}
      </div>
    </main>
  )
}
