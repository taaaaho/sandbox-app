import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

const Pkey = process.env.PRIVATE_KEY || '';
const _signer = new ethers.Wallet(Pkey);

console.log(req.query)
const {title, message} = req.query


const sendNotification = async() => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1,
      identityType: 2,
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`
      },
      payload: {
        title: title as string,
        body: message as string,
        cta: '',
        img: ''
      },
      channel: 'eip155:5:0x785a58b8A172e98756b8CeCaD674ab35da4e380e',
        // @ts-ignore
      env: 'staging'
    });
  } catch (err) {
    console.error('Error: ', err);
  }
}

sendNotification();
  res.status(200).json({ name: 'John Doe' })
}
