// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { sendAmount, isAddress } from 'src/functions/ChivesweaveWallets'

// ** Third Party Components
import toast from 'react-hot-toast'

const SendOutForm = () => {
  // ** State
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>("Submit")
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  
  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  
  const [inputAddress, setInputAddress] = useState<string>("")
  const [inputAddressError, setInputAddressError] = useState<string | null>(null)
  const handleInputAddressChange = (event: any) => {
    setInputAddress(event.target.value);
    if(event.target.value.length != 43) {
        setInputAddressError("Address length must be 43")
    }
    else if(event.target.value == currentAddress) {
        setInputAddressError("You cannot send amounts to yourself")
    }
    else if(!isAddress(event.target.value))  {
        setInputAddressError("The address you entered is invalid")
    }
    else {
        setInputAddressError("")
    }
    
    //console.log("inputAddress", inputAddress)
  };
  
  const [addressBalance, setAddressBalance] = useState<number>(0)
  useEffect(() => {
    if(currentAddress != undefined && currentAddress.length == 43) {
      axios.get(authConfig.backEndApi + '/wallet/' + currentAddress + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(res.data);
        })
    }
  }, [currentAddress])

  const [inputAmount, setInputAmount] = useState<string>("")
  const [inputAmountError, setInputAmountError] = useState<string | null>(null)
  const handleInputAmountChange = (event: any) => {
    setInputAmount(event.target.value);
    if(event.target.value <= 0) {
        setInputAmountError("The amount entered must be greater than 0")
    }
    else if(event.target.value >= addressBalance) {
        setInputAmountError("The amount sent cannot exceed the current balance")
    }
    else {
        setInputAmountError("")
    }
    
    //console.log("inputAmount", inputAmount)
    //setInputAmountError("sss")
  };

  const [inputData, setInputData] = useState<string>("")
  const [inputDataError, setInputDataError] = useState<string | null>(null)
  const handleInputDataChange = (event: any) => {
    setInputData(event.target.value);
    setInputDataError("")
    
    //console.log("inputData", inputData)
  };

  
  const handleSubmit = async () => {
    if(!isAddress(inputAddress))  {
        setInputAddressError("The address you entered is invalid")
        
        return 
    }
    if(Number(inputAmount) <= 0 || Number(inputAmount) >= addressBalance)  {
        setInputAddressError("The amount you entered is invalid")
        
        return 
    }
    
    //Send coin out
    setIsDisabledButton(true)
    setUploadingButton("Submitting...")

    const TxResult: any = await sendAmount(currentWallet, inputAddress, String(inputAmount), [], inputData, "SubmitStatus", setUploadProgress);
    console.log("TxResult", TxResult)
    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setUploadingButton("Submit")
    }

  }

  useEffect(() => {
    let isFinishedAllUploaded = true
    uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).forEach(([key, value]) => {
        if(value != 100) {
            isFinishedAllUploaded = false
        }
        
        console.log("uploadProgress key", key, value)
    })
    if(uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).length > 0 && isFinishedAllUploaded) {
        setIsDisabledButton(false)
        setUploadingButton("Submit")
        setInputAddress("")
        setInputAmount("")
        setInputData("")
        toast.success('Successfully submitted to blockchain', { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <Fragment>
        <Card>
        <CardHeader title='Send Coin Out' />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label='Address'
                        placeholder='Address'
                        value={inputAddress}
                        onChange={handleInputAddressChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputAddressError}
                        helperText={inputAddressError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type='number'
                        label='Amount'
                        placeholder='Amount'
                        value={inputAmount}
                        onChange={handleInputAmountChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputAmountError}
                        helperText={inputAmountError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label='Data'
                        placeholder='Leave a message to the payee'
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:message-outline' />
                                </InputAdornment>
                            )
                        }}                        
                        value={inputData}
                        onChange={handleInputDataChange}
                        error={!!inputDataError}
                        helperText={inputDataError}
                    />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>
            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

/*
                
                */
export default SendOutForm
