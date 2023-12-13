// ** React Imports
import { Fragment, useState, useEffect, ChangeEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { getWalletProfile, getWalletBalance, RegisterAgentAction, ActionsSubmitToBlockchain, getLockStatus, setLockStatus } from 'src/functions/ChivesweaveWallets'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

// ** Type Import
import { CustomRadioIconsData, CustomRadioIconsProps } from 'src/@core/components/custom-radio/types'

// ** Demo Components Imports
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'

  interface IconType {
    icon: CustomRadioIconsProps['icon']
    iconProps: CustomRadioIconsProps['iconProps']
  }
  
  const icons: IconType[] = [
    { icon: 'mdi:account-outline', iconProps: { fontSize: '2rem', style: { marginBottom: 8 } } },
    { icon: 'mdi:rocket-launch-outline', iconProps: { fontSize: '2rem', style: { marginBottom: 8 } } },
    { icon: 'mdi:crown-outline', iconProps: { fontSize: '2rem', style: { marginBottom: 8 } } }
  ]

const RegisterAgent = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  // ** State
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isDisabledProfileButton, setIsDisabledProfileButton] = useState<boolean>(false)
  const [isDisabledBalanceButton, setIsDisabledBalanceButton] = useState<boolean>(false)
  const [balanceText, setBalanceText] = useState<string>("")

  // ** State
  const [selected, setSelected] = useState<string>('')
  
  const auth = useAuth()
  const currentAddress = auth.currentAddress
  
  useEffect(() => {
    if(currentAddress && currentAddress.length ==43) {
      setIsDisabledButton(false)
      setIsDisabledProfileButton(false)
      setIsDisabledBalanceButton(false)
      setBalanceText("")
      handleCheckGetWalletProfile()
    }
  }, [currentAddress])

  const handleCheckGetWalletProfile = async () => {
    const getLockStatusData = getLockStatus("Agent")
    const Profile: any = await getWalletProfile(currentAddress)
    if((getLockStatusData && getLockStatusData == currentAddress) || (Profile['AgentLevel'] > 0) ) {
      setIsDisabledButton(true)
      setIsDisabledProfileButton(true)
      setIsDisabledBalanceButton(true)
      console.log("uploadProgress", uploadProgress)
    }
    if(Profile['AgentLevel'] > 0) {
      setSelected(String(Profile['AgentLevel']))
    }
  }

  const handleCheckProfile = async () => {
    if(currentAddress != undefined && currentAddress.length == 43) {
      const Profile: any = await getWalletProfile(currentAddress)
      let MsgTip = ""
      if(Profile['Profile'] !== undefined && Profile['Profile']['Name'] !== undefined && Profile['Profile']['Email'] !== undefined && Profile['Profile']['Twitter'] !== undefined) {
        MsgTip = t(`Profile completion meets the requirements`) as string
        toast.success(MsgTip, { duration: 4000 })
      }
      else {
        MsgTip = t(`In the profile, the name, email, and Twitter must be filled in`) as string
        toast.error(MsgTip, { duration: 4000 })
        setIsDisabledButton(true)
      }
      setIsDisabledProfileButton(true)
    }
  }

  const handleCheckBalance = async () => {
    if(currentAddress != undefined && currentAddress.length == 43) {
      const balance = Number(await getWalletBalance(currentAddress))
      let MsgTip = ""
      if(balance>1000) {
        MsgTip = t(`Your balance is greater than 1000 XWE, meeting the requirement.`) as string
        toast.success(MsgTip, { duration: 4000 })
      }
      else if(balance>1000) {
        MsgTip = t(`Your balance is greater than 1000 XWE, meeting the requirement.`) as string
        toast.success(MsgTip, { duration: 4000 })
      }
      else if(balance>1000) {
        MsgTip = t(`Your balance is greater than 1000 XWE, meeting the requirement.`) as string
        toast.success(MsgTip, { duration: 4000 })
      }
      else {
        MsgTip = t(`Your balance is Less than or equal to 1000 XWE, does not meet the requirement.`) as string
        toast.error(MsgTip, { duration: 4000 })
        setIsDisabledButton(true)
      }
      setIsDisabledBalanceButton(true)
      setBalanceText("Wallet Balance: " + balance)
    }
  }

  const handleActionsSubmitToBlockchainYes = async () => {

    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");
        
        return
    }
    const Profile: any = await getWalletProfile(currentAddress)
    if(Profile['Profile'] !== undefined && Profile['Profile']['Name'] !== undefined && Profile['Profile']['Email'] !== undefined && Profile['Profile']['Twitter'] !== undefined) {
      
      //passed
    }
    else {
      const MsgTip = t(`In the profile, the name, email, and Twitter must be filled in`) as string
      toast.error(MsgTip, { duration: 4000 })

      return
    }

    const balance = Number(await getWalletBalance(currentAddress))
    let MsgTip = ""
    if(selected == "1" && balance<1000) {
      MsgTip = t(`Level 1 require your wallet have at least 1000 XWE`) as string
      toast.error(MsgTip, { duration: 4000 })

      return
    }
    else if(selected == "2" && balance<2000) {
      MsgTip = t(`Level 2 require your wallet have at least 2000 XWE`) as string
      toast.error(MsgTip, { duration: 4000 })

      return
    }
    else if(selected == "3" && balance<3000) {
      MsgTip = t(`Level 3 require your wallet have at least 3000 XWE`) as string
      toast.error(MsgTip, { duration: 4000 })

      return
    }

    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)

    await RegisterAgentAction(currentAddress, selected)    
    const ActionsSubmitToBlockchainResult = await ActionsSubmitToBlockchain(setUploadProgress);
    console.log("ActionsSubmitToBlockchainResult", ActionsSubmitToBlockchainResult)
    if(ActionsSubmitToBlockchainResult && ActionsSubmitToBlockchainResult.id) {
      setLockStatus('Agent', ActionsSubmitToBlockchainResult.id)
      toast.success(t(`Submitted successfully`), {
        duration: 2000
      })
      setUploadingButton(`${t('Submitt')}`)

    }
  }

  const CustomRadioWithIcons = () => {
  
    const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
      if(!isDisabledButton) {
        if (typeof prop === 'string') {
          setSelected(prop)
        } else {
          setSelected((prop.target as HTMLInputElement).value)
        }
      }
    }

    const agentList: CustomRadioIconsData[] = [
      {
        value: '1',
        title: 'Level 1',
        content: `${t('Need balance more than 1000 XWE')}`
      },
      {
        value: '2',
        title: 'Level 2',
        content: `${t('Need balance more than 2000 XWE')}`
      },
      {
        value: '3',
        title: 'Level 3',
        content: `${t('Need balance more than 3000 XWE')}`
      }
    ]
  
    return (
      <Grid container spacing={4}>
        {agentList.map((item, index) => (
          <CustomRadioIcons
            key={index}
            data={agentList[index]}
            selected={selected}
            icon={icons[index].icon}
            name='custom-radios-icons'
            handleChange={handleChange}
            gridProps={{ sm: 4, xs: 12 }}
            iconProps={icons[index].iconProps}
          />
        ))}
      </Grid>
    )
  }

  return (
    <Fragment>
        <Card>
        <CardHeader title={`${t('Register Agent')}`} />
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
        <Grid container spacing={5}>
            <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. {`${t('Agent Reward Introduction')}`}
            </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography>
                  1. {`${t('Agent Earnings')}`}
                </Typography>
                <Typography>
                  2. {`${t('Agent Requirements')}`}
                </Typography>
                <Typography>
                  3. {`${t('Agent Profile')}`} 
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. {`${t('Check user profiles and balances')}`}
            </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <Button type='submit' variant='contained' size='small' onClick={handleCheckProfile} disabled={isDisabledProfileButton} sx={{mx: 5}}>
                  {`${t('Check Profile')}`}
                </Button>
                <Button type='submit' variant='contained' size='small' onClick={handleCheckBalance} disabled={isDisabledBalanceButton} sx={{mx: 5}}>
                  {`${t('Check Balance')}`}
                </Button>
                <Button disabled={true}><Typography>{balanceText}</Typography></Button>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    3. {`${t('Agent level')}`}
                </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <CustomRadioWithIcons />
                </Grid>
            </Grid>
            <Divider sx={{ m: '0 !important' }} />
            <CardActions>
              <Grid container justifyContent="flex-end">
                  <Button type='submit' variant='contained' size='large' onClick={handleActionsSubmitToBlockchainYes} disabled={isDisabledButton}>
                      {uploadingButton}
                  </Button>
              </Grid>
            </CardActions>
        </CardContent>
        </Card>
    </Fragment>
  )
}

export default RegisterAgent
