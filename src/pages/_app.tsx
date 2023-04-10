import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={ChainId.Goerli}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}
