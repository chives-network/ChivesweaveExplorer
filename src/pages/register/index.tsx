// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { getWalletById, sendAmount } from 'src/functions/ChivesweaveWallets'


const Register = () => {

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  /*
  const walletKeyPath = "Chiveswallets"
  const generateNewMnemonic = async () => {
      const generateNewMnemonicAndGetWalletDataV:any = await generateNewMnemonicAndGetWalletData("");
      console.log("generateNewMnemonicAndGetWalletDataV:", generateNewMnemonicAndGetWalletDataV)      
      const walletKeyPathList = window.localStorage.getItem(walletKeyPath)      
      console.log("walletKeyPathList:", walletKeyPathList)
  };
  const getCurrentBalance = async (currentWallet: any) => {
    const currentBalance = await getWalletBalance(currentWallet.data.arweave.key);
    console.log("currentBalance", currentBalance)

  };
  */

  const sendCoinOut = async (currentWallet: any) => {
    const target = "mIZnYPDjIf5PlxE8nG3CALOU7-BngKJSc0N-Tit7cSM"
    const amount = "0.000123"
    const tags: any = []
    tags.push({name: "Name1", value:'Value1'})
    tags.push({name: "Name2", value:'Value2'})
    tags.push({name: "Name3", value:'Value3'})
    const data = "Chivesweave Drive Data Testing. "
    const repeatedString = data.repeat(30000);
    console.log("data size", repeatedString.length)
    
    await sendAmount(currentWallet, target, amount, tags, repeatedString, "", setUploadProgress);
    console.log("uploadProgress", uploadProgress)

  };

  useEffect(() => {
    const currentWallet = getWalletById(5);
    console.log("currentWallet", currentWallet);
    sendCoinOut(currentWallet);
  }, [])

  
  return (
    <Box className='content-right'>
        <div>
          <h1>BIP-39 Mnemonic Example</h1>
        </div>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

// Register.guestGuard = true

export default Register
