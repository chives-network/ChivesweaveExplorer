// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { getWalletProfile, getLockStatus, setLockStatus, RegisterRefereeAction, ActionsSubmitToBlockchain, checkNodeStatus, getChivesReferee } from 'src/functions/ChivesweaveWallets'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

const MyAgentApp = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  // ** State
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isAgentDisabledButton, setIsAgentDisabledButton] = useState<boolean>(false)
  const [uploadingAgentButton, setUploadingAgentButton] = useState<string>(`${t('Submit')}`)
  const [isHaveSettingMyAgent, setIsHaveSettingMyAgent] = useState<boolean>(false)
  const [agentTxId, setAgentTxId] = useState<string>("")

  const auth = useAuth()
  const currentAddress = auth.currentAddress

  const [inputAgent, setInputAgent] = useState<string>("")
  const [inputAgentError, setInputAgentError] = useState<string | null>(null)
  const handleInputAgentChange = (event: any) => {
    setInputAgent(event.target.value);
    if(event.target.value.length != 43) {
        setInputAgentError(`${t('Address length must be 43')}`)
    }
    else if(event.target.value == currentAddress) {
        setInputAgentError(`${t('Please do not use your own address')}`)
    }
    else {
        setInputAgentError("")
    }
  };
  
  useEffect(() => {
    const handleWindowLoad = () => {
        setUploadingAgentButton(`${t('Submit')}`)
        const getLockStatusReferee = getLockStatus("Referee")
        if(getLockStatusReferee && getLockStatusReferee.length == 43) {
            setIsAgentDisabledButton(true)
            setIsHaveSettingMyAgent(true)
            setInputAgent(`${t('Please wait for the blockchain to be packaged')}`)
            console.log("getLockStatusReferee 001",getLockStatusReferee)
        }
    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43) {
        handleGetProfile()
    }
  }, [currentAddress])

  const handleGetProfile = async () => {
    setIsAgentDisabledButton(false)
    setIsHaveSettingMyAgent(false)
    const getLockStatusReferee = getLockStatus("Referee")
    if(getLockStatusReferee && getLockStatusReferee.length == 43) {
        setIsAgentDisabledButton(true)
        setIsHaveSettingMyAgent(true)
        setInputAgent(`${t('Please wait for the blockchain to be packaged')}`)
        console.log("getLockStatusReferee 002",getLockStatusReferee)
    }
    const Profile: any = await getWalletProfile(currentAddress)
    if(Profile && Profile['Referee'] && Profile['Referee'].length == 43) {
        setIsAgentDisabledButton(true)
        setIsHaveSettingMyAgent(true)
        setInputAgent(Profile['Referee'])
        setAgentTxId(Profile['TxId'])
    }
    else if(Profile) {
        const getChivesRefereeData = getChivesReferee()
        setInputAgent(getChivesRefereeData)
    }

    //Need Setting Profile First
    if(Profile == undefined) {
        setIsAgentDisabledButton(true)
        setIsHaveSettingMyAgent(true)
        setInputAgent(`${t('Please set up your profile first')}`)
    }

    const checkNodeStatusData: any = await checkNodeStatus()
    if(!isAgentDisabledButton && checkNodeStatusData == false) {
        setIsAgentDisabledButton(true)
        setInputAgent(`${t('Blockchain is currently syncing data. Please wait for a few hours before trying again')}`)
    }

  }

  const handleAgentSubmitToBlockchain = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");

        return
    }
    if(inputAgent && inputAgent.length == 43) {

        //passed
    }
    else {        
        const MsgTip = t(`Address length must be 43`) as string
        toast.error(MsgTip, { duration: 4000 })
  
        return
    }

    const Profile: any = await getWalletProfile(currentAddress)
    if(Profile && Profile['Referee'] && Profile['Referee'].length == 43) {
        const MsgTip = t(`You have already set up a proxy and cannot set it again`) as string
        toast.error(MsgTip, { duration: 4000 })
  
        return
    }

    setIsAgentDisabledButton(true)
    setUploadingAgentButton(`${t('Submitting...')}`)
    toast.success(`${t('Submitting...')}`, { duration: 3000 })

    await RegisterRefereeAction(currentAddress, inputAgent)
    const ActionsSubmitToBlockchainResult = await ActionsSubmitToBlockchain(setUploadProgress)
    console.log("ActionsSubmitToBlockchainResult", ActionsSubmitToBlockchainResult)
    if(ActionsSubmitToBlockchainResult && ActionsSubmitToBlockchainResult.id) {
      setLockStatus('Referee', ActionsSubmitToBlockchainResult.id)
      toast.success(t(`Submitted successfully`), {
        duration: 2000
      })
      setUploadingAgentButton(`${t('Submitt')}`)
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
        setUploadingAgentButton(`${t('Submit')}`)
        
        toast.success(`${t('Successfully submitted to blockchain')}`, { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('My Agent')}`} />
                <CardContent>
                    {inputAgent && inputAgent.length == 43 && isHaveSettingMyAgent ?
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <Typography>{`${t('My Address')}`}:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{currentAddress}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>{`${t('My Agent')}`}:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{inputAgent}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>{`${t('TxId')}`}:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{agentTxId}</Typography>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={`${t('My Address')}`}
                                placeholder={`${t('My Address')}`}
                                value={currentAddress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={`${t('My Agent')}`}
                                placeholder={`${t('Agent Address')}`}
                                value={inputAgent}
                                onChange={handleInputAgentChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isAgentDisabledButton} 
                                error={!!inputAgentError}
                                helperText={inputAgentError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{`${t('Each person can set up a agent only once, and after successful setup, it cannot be modified')}`}</Typography>
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button 
                                type='submit' 
                                variant='contained' 
                                size='small' 
                                onClick={handleAgentSubmitToBlockchain} 
                                disabled={isAgentDisabledButton} 
                                >
                                {uploadingAgentButton}
                            </Button>
                        </Grid>
                    </Grid>
                    }
                    
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}


export default MyAgentApp
