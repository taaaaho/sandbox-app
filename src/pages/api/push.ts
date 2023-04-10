import * as PushAPI from '@pushprotocol/restapi'
import * as ethers from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case 'POST': {
      const { title, message } = req.body
      console.log(title)
      const Pkey = process.env.PRIVATE_KEY || ''
      const _signer = new ethers.Wallet(Pkey)
      sendNotification(title as string, message as string, _signer)
      return res.status(200).json({ status: 'Success' })
    }
    case 'GET': {
      const { address } = req.query
      const notifications = await PushAPI.user.getFeeds({
        user: `eip155:5:${address}`, // user address in CAIP
        raw: true,
        // @ts-ignore
        env: 'staging',
      })
      const parsedResults = PushAPI.utils.parseApiResponse(notifications)
      console.log(parsedResults)
      return res.status(200).json({ status: 'Success', message: parsedResults })
    }
  }
}

const sendNotification = async (
  title: string,
  message: string,
  _signer: ethers.Signer
) => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1,
      identityType: 2,
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`,
      },
      payload: {
        title: title as string,
        body: message as string,
        cta: '',
        img: '',
      },
      channel: 'eip155:5:0x785a58b8A172e98756b8CeCaD674ab35da4e380e',
      // @ts-ignore
      env: 'staging',
    })
  } catch (err) {
    console.error('Error: ', err)
  }
}
