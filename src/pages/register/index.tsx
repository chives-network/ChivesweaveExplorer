// ** React Imports
import { ReactNode, useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { generateNewMnemonicAndGetWalletData, getWalletById, getWalletAddress, sendAmount } from 'src/functions/ChivesweaveWallets'


const Register = () => {

  const [mnemonic, setMnemonic] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const walletKeyPath = "Chiveswallets"


  const generateNewMnemonic = async () => {
      const generateNewMnemonicAndGetWalletDataV:any = await generateNewMnemonicAndGetWalletData("");
      console.log("generateNewMnemonicAndGetWalletDataV:", generateNewMnemonicAndGetWalletDataV)      
      const walletKeyPathList = window.localStorage.getItem(walletKeyPath)      
      console.log("walletKeyPathList:", walletKeyPathList)

  };

  const getCurrentBalance = async (currentWallet: any) => {
    const currentBalance = await getWalletAddress(currentWallet.data.arweave.key);
    console.log("currentBalance", currentBalance)

  };

  const sendCoinOut = async (currentWallet: any) => {
    const target = "mIZnYPDjIf5PlxE8nG3CALOU7-BngKJSc0N-Tit7cSM"
    const amount = "0.0001"
    const currentBalance = await sendAmount(currentWallet, target, amount);
    console.log("currentBalance", currentBalance)

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
