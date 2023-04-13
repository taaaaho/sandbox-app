import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { SafeFactory } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import {
  ChainId,
  ConnectWallet,
  useAddress,
  useSigner,
} from '@thirdweb-dev/react'
const Safe = () => {
  const address = useAddress()
  const signer = useSigner()
  const safe = async () => {
    if (signer) {
      const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      })

      //   Initialize the Safe Api Kit
      const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
      //   const safeService = new SafeApiKit({
      //     txServiceUrl,
      //     ethAdapter: ethAdapterOwner1,
      //   })

      //   Initialize the Protcol Kit
      const safeFactory = await SafeFactory.create({
        ethAdapter: ethAdapterOwner1,
      })
      const safeAccountConfig: SafeAccountConfig = {
        owners: [
          address as string,
          '0x736eC118551CeCCD4Aabd6f270a543c48Ad41E1a',
          '0xf7547A9744df9F02f983521d690159881f49A065',
        ],
        threshold: 2,
        // ... (Optional params)
      }

      /* This Safe is tied to owner 1 because the factory was initialized with
      an adapter that had owner 1 as the signer. */
      const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

      const safeAddress = safeSdkOwner1.getAddress()

      console.log('Your Safe has been deployed:')
      console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
      console.log(`https://app.safe.global/gor:${safeAddress}`)
    } else {
      alert('ウォレット')
    }
  }
  if (!address) {
    return <ConnectWallet />
  }
  return (
    <VStack>
      <Text>Address: {address}</Text>
      <Box>Safe</Box>
      <Button onClick={safe}>Deploy Safe</Button>
    </VStack>
  )
}

export default Safe
