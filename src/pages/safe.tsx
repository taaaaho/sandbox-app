import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import Safe, { SafeFactory } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { ConnectWallet, useAddress, useSigner } from '@thirdweb-dev/react'

import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
const SafePage = () => {
  const address = useAddress()
  const signer = useSigner()

  const fetchPendingTransactionHash = async () => {
    const safeService = fetchSafeService()
    const safeAddress = '0x06AaC35a667C00761947286496D06100D6A714E0'
    if (safeService && signer) {
      const pendingTransactions = await safeService.getPendingTransactions(
        safeAddress
      )
      // Assumes that the first pending transaction is the transaction you want to confirm
      const transaction = pendingTransactions.results[0]
      const safeTxHash = transaction.safeTxHash
      return safeTxHash
    }
  }
  const fetchSafeSDK = async () => {
    if (signer) {
      const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      })
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapterOwner1,
        safeAddress: '0x06AaC35a667C00761947286496D06100D6A714E0',
      })
      return safeSdk
    }
  }
  const fetchSafeService = () => {
    if (signer) {
      const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      })
      const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
      const safeService = new SafeApiKit({
        txServiceUrl,
        ethAdapter: ethAdapterOwner1,
      })
      return safeService
    }
  }

  const executeTransaction = async () => {
    const safeService = fetchSafeService()
    const safeSdk = await fetchSafeSDK()
    const safeTxHash = await fetchPendingTransactionHash()
    if (safeService && safeSdk && safeTxHash) {
      const safeTransaction = await safeService.getTransaction(safeTxHash)
      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction
      )
      const receipt = await executeTxResponse.transactionResponse?.wait()

      console.log('Transaction executed:')
      console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
    }
  }
  //   出金承認（Owner 2）
  const confirmTransaction = async () => {
    const safeService = fetchSafeService()
    const safeAddress = '0x06AaC35a667C00761947286496D06100D6A714E0'
    const safeTxHash = await fetchPendingTransactionHash()
    if (safeService && signer && safeTxHash) {
      const ethAdapterOwner2 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      })

      const safeSdkOwner2 = await Safe.create({
        ethAdapter: ethAdapterOwner2,
        safeAddress,
      })

      const signature = await safeSdkOwner2.signTransactionHash(safeTxHash)
      const response = await safeService.confirmTransaction(
        safeTxHash,
        signature.data
      )
    }
  }

  //   出金申請（Owner 1）
  const propseTransaction = async () => {
    // Any address can be used. In this example you will use vitalik.eth
    const destination = '0x785a58b8A172e98756b8CeCaD674ab35da4e380e'
    const amount = ethers.utils.parseUnits('0.001', 'ether').toString()
    const safeService = fetchSafeService()
    const safeSdk = await fetchSafeSDK()
    const safeTransactionData: SafeTransactionDataPartial = {
      to: destination,
      data: '0x',
      value: amount,
    }

    if (signer && address && safeService && safeSdk) {
      // Create a Safe transaction with the provided parameters
      const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData,
      })

      // Deterministic hash based on transaction parameters
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)

      // Sign transaction to verify that the transaction is coming from owner 1
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash)

      await safeService.proposeTransaction({
        safeAddress: '0x06AaC35a667C00761947286496D06100D6A714E0',
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address,
        senderSignature: senderSignature.data,
      })
    }
  }
  const fetchSafe = async () => {
    const safeService = fetchSafeService()
    if (address && safeService) {
      const safe = await safeService.getSafesByOwner(address)
      console.log(safe)
    }
  }
  const sendEthToSafe = async (safeAddress: string) => {
    if (signer) {
      const safeAmount = ethers.utils.parseUnits('0.001', 'ether').toHexString()

      const transactionParameters = {
        to: safeAddress,
        value: safeAmount,
      }

      const tx = await signer.sendTransaction(transactionParameters)

      console.log('Fundraising.')
      console.log(
        `Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`
      )
    }
  }
  const deploySafe = async () => {
    if (signer) {
      const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      })

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
      //   setSafeAddress(safeAddress)
      console.log('Your Safe has been deployed:')
      console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
      console.log(`https://app.safe.global/gor:${safeAddress}`)
      sendEthToSafe(safeAddress)
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
      <Button onClick={deploySafe}>Deploy Safe</Button>
      {/* <Button onClick={sendEthToSafe}>Send Eth to Safe</Button> */}
      <Button onClick={fetchSafe}>Fetch Safe</Button>
      <Button onClick={propseTransaction}>Propose Transaction</Button>
      <Button onClick={confirmTransaction}>Confirm Transaction</Button>
      <Button onClick={executeTransaction}>Execute Transaction</Button>
    </VStack>
  )
}

export default SafePage
