// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Axios Imports
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { ProfileSubmitToBlockchain, getWalletProfile, getLockStatus, setLockStatus, checkNodeStatus } from 'src/functions/ChivesweaveWallets'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import CircularProgress from '@mui/material/CircularProgress'

interface FileProp {
    name: string
    type: string
    size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(15.75)
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
        width: 160
    }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
}))

const ProfileApp = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  // ** State
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [avatarName, setAvatarName] = useState<string>("")
  const [avatarFilesUrl, setAvatarFilesUrl] = useState<string>('/images/avatars/1.png')
  const [bannerFilesUrl, setBannerFilesUrl] = useState<string>('/images/misc/upload.png')
  const [avatarFilesTxId, setAvatarFilesTxId] = useState<string>('')
  const [bannerFilesTxId, setBannerFilesTxId] = useState<string>('')
  const [lastTxAction, setLastTxAction] = useState<string>('')

  const auth = useAuth()
  const currentAddress = auth.currentAddress
  
  useEffect(() => {
    const handleWindowLoad = () => {
        setUploadingButton(`${t('Submit')}`)
        const getLockStatusData = getLockStatus("Profile")
        if(getLockStatusData && getLockStatusData.length == 43) {
            setIsDisabledButton(true)
            setInputName(`${t('Please wait for the blockchain to be packaged')}`)
            setAvatarName(`${t('Please wait for the blockchain to be packaged')}`)
            console.log("getLockStatusReferee 001",getLockStatusData)
        }

    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43) {
        setAvatarName(auth.currentAddress)
        handleGetProfile()
    }
  }, [currentAddress])

  const handleGetProfile = async () => {
    const getLockStatusData = getLockStatus("Profile")
    if(getLockStatusData && getLockStatusData.length == 43) {
        setIsDisabledButton(true)
        setInputName(`${t('Please wait for the blockchain to be packaged')}`)
        setAvatarName(`${t('Please wait for the blockchain to be packaged')}`)
        console.log("getLockStatusReferee 002",getLockStatusData)
    }
    else {
        const getWalletProfileData: any = await getWalletProfile(currentAddress)
        console.log("getWalletProfileData", getWalletProfileData)
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Name']) {
            setInputName(getWalletProfileData['Profile']['Name']);
        }
        else {
            setInputName("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Email']) {
            setInputEmail(getWalletProfileData['Profile']['Email']);
        }
        else {
            setInputEmail("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Twitter']) {
            setInputTwitter(getWalletProfileData['Profile']['Twitter']);
        }
        else {
            setInputTwitter("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Github']) {
            setInputGithub(getWalletProfileData['Profile']['Github']);
        }
        else {
            setInputGithub("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Discord']) {
            setInputDiscord(getWalletProfileData['Profile']['Discord']);
        }
        else {
            setInputDiscord("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Instagram']) {
            setInputInstagram(getWalletProfileData['Profile']['Instagram']);
        }
        else {
            setInputInstagram("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Telegram']) {
            setInputTelegram(getWalletProfileData['Profile']['Telegram']);
        }
        else {
            setInputTelegram("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Medium']) {
            setInputMedium(getWalletProfileData['Profile']['Medium']);
        }
        else {
            setInputMedium("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Reddit']) {
            setInputReddit(getWalletProfileData['Profile']['Reddit']);
        }
        else {
            setInputReddit("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Youtube']) {
            setInputYoutube(getWalletProfileData['Profile']['Youtube']);
        }
        else {
            setInputYoutube("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Bio']) {
            setInputBio(getWalletProfileData['Profile']['Bio']);
        }
        else {
            setInputBio("");
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Avatar'] && getWalletProfileData['Profile']['Avatar'].length == 43) {
            setAvatarFilesTxId(getWalletProfileData['Profile']['Avatar']);
            setAvatarFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Avatar']);
        }
        else {
            setAvatarFilesTxId("");
            setAvatarFilesUrl('/images/avatars/1.png');
        }
        if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Banner'] && getWalletProfileData['Profile']['Banner'].length == 43) {
            setBannerFilesTxId(getWalletProfileData['Profile']['Banner']);
            setBannerFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Banner']);
        }
        else {
            setBannerFilesTxId("");
            setBannerFilesUrl('/images/misc/upload.png');
        }
        if(getWalletProfileData && getWalletProfileData['TxId'] && getWalletProfileData['TxId'].length == 43) {
            setLastTxAction(getWalletProfileData['LastTxAction']);
        }
        else {
            setLastTxAction("");
        }
    }
    
    const checkNodeStatusData: any = await checkNodeStatus()
    if(checkNodeStatusData == false) {
        setIsDisabledButton(true)
        setAvatarName(`${t('Blockchain is currently syncing data. Please wait for a few hours before trying again')}`)
    }
  }

  const [inputName, setInputName] = useState<string>("")
  const [inputNameError, setInputNameError] = useState<string | null>(null)
  const handleInputNameChange = (event: any) => {
    setInputName(event.target.value);
    if(event.target.value.length < 3) {
        setInputNameError(`${t('Must be longer than 3 letters')}`)
    }
    else {
        setInputNameError("")
    }
  };

  const [inputEmail, setInputEmail] = useState<string>("")
  const [inputEmailError, setInputEmailError] = useState<string | null>(null)
  const handleInputEmailChange = (event: any) => {
    setInputEmail(event.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(event.target.value)) {
        setInputEmailError(`${t('Please enter the correct email')}`)
    }
    else {
        setInputEmailError("")
    }
  };

  const [inputTwitter, setInputTwitter] = useState<string>("")
  const [inputTwitterError, setInputTwitterError] = useState<string | null>(null)
  const handleInputTwitterChange = (event: any) => {
    setInputTwitter(event.target.value);
    if(event.target.value.length < 3) {
        setInputTwitterError(`${t('Must be longer than 3 letters')}`)
    }
    else {
        setInputTwitterError("")
    }
  };

  const [inputGithub, setInputGithub] = useState<string>("")
  const [inputGithubError, setInputGithubError] = useState<string | null>(null)
  const handleInputGithubChange = (event: any) => {
    setInputGithub(event.target.value);
    setInputGithubError("");
  };

  const [inputDiscord, setInputDiscord] = useState<string>("")
  const [inputDiscordError, setInputDiscordError] = useState<string | null>(null)
  const handleInputDiscordChange = (event: any) => {
    setInputDiscord(event.target.value);
    setInputDiscordError("");
  };

  const [inputInstagram, setInputInstagram] = useState<string>("")
  const [inputInstagramError, setInputInstagramError] = useState<string | null>(null)
  const handleInputInstagramChange = (event: any) => {
    setInputInstagram(event.target.value);
    setInputInstagramError("");
  };

  const [inputTelegram, setInputTelegram] = useState<string>("")
  const [inputTelegramError, setInputTelegramError] = useState<string | null>(null)
  const handleInputTelegramChange = (event: any) => {
    setInputTelegram(event.target.value);
    setInputTelegramError("");
  };

  const [inputMedium, setInputMedium] = useState<string>("")
  const [inputMediumError, setInputMediumError] = useState<string | null>(null)
  const handleInputMediumChange = (event: any) => {
    setInputMedium(event.target.value);
    setInputMediumError("");
  };

  const [inputReddit, setInputReddit] = useState<string>("")
  const [inputRedditError, setInputRedditError] = useState<string | null>(null)
  const handleInputRedditChange = (event: any) => {
    setInputReddit(event.target.value);
    setInputRedditError("");
  };

  const [inputYoutube, setInputYoutube] = useState<string>("")
  const [inputYoutubeError, setInputYoutubeError] = useState<string | null>(null)
  const handleInputYoutubeChange = (event: any) => {
    setInputYoutube(event.target.value);
    setInputYoutubeError("");
  };
  
  const [inputBio, setInputBio] = useState<string>("")
  const [inputBioError, setInputBioError] = useState<string | null>(null)
  const handleInputBioChange = (event: any) => {
    setInputBio(event.target.value);
    setInputBioError("")
  };

  // ** Hook
  const [avatarFiles, setAvatarFiles] = useState<File[]>([])
  const { getRootProps: getRootPropsAvatar, getInputProps: getInputPropsAvatar } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
        setAvatarFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  // ** Hook
  const [bannerFiles, setBannerFiles] = useState<File[]>([])
  const { acceptedFiles, getRootProps: getRootPropsBanner, getInputProps: getInputPropsBanner } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
        setBannerFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        console.log("bannerFiles",bannerFiles)
    }
  })    
  const BannerImageShow = bannerFiles&& bannerFiles.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))  

  const handleSubmitToBlockchain = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");

        return
    }
    setIsLoading(true)
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    toast.success(`${t('Submitting...')}`, { duration: 3000 })

    const chivesProfileMap: any = {}
    chivesProfileMap['Name'] = inputName
    chivesProfileMap['Email'] = inputEmail
    chivesProfileMap['Twitter'] = inputTwitter
    chivesProfileMap['Github'] = inputGithub
    chivesProfileMap['Discord'] = inputDiscord
    chivesProfileMap['Instagram'] = inputInstagram
    chivesProfileMap['Telegram'] = inputTelegram
    chivesProfileMap['Medium'] = inputMedium
    chivesProfileMap['Reddit'] = inputReddit
    chivesProfileMap['Youtube'] = inputYoutube
    chivesProfileMap['Bio'] = inputBio
    chivesProfileMap['Avatar'] = avatarFiles
    chivesProfileMap['Banner'] = bannerFiles
    chivesProfileMap['AvatarTxId'] = avatarFilesTxId
    chivesProfileMap['BannerTxId'] = bannerFilesTxId

    const FileTxList: string[] = [];
    if(avatarFiles && avatarFiles[0]) {
        FileTxList.push('Avatar')
    }
    if(bannerFiles && bannerFiles[0]) {
        FileTxList.push('Banner')
    }
    FileTxList.push('Data')
    
    const TxResult: any = await ProfileSubmitToBlockchain(setUploadProgress, chivesProfileMap, FileTxList, lastTxAction);

    //Save Tx Records Into LocalStorage
    const chivesTxStatus: string = authConfig.chivesTxStatus
    const ChivesDriveActionsMap: any = {}
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    chivesTxStatusList.push({TxResult,ChivesDriveActionsMap})
    console.log("chivesTxStatusList-ProfileApp", chivesTxStatusList)
    window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusList))
    setLockStatus('Profile', TxResult.id as string)
    setAvatarName(`${t('Please wait for the blockchain to be packaged')}`)
    
    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setUploadingButton(`${t('Submit')}`)
    }
    setIsLoading(false)

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
        setUploadingButton(`${t('Submit')}`)
        toast.success(`${t('Successfully submitted to blockchain')}`, { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('Profile')}`} />
                {isLoading == true ? 
                <Fragment>
                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <CircularProgress sx={{ mb: 4 }} />
                                    <Typography>{`${t(`Executing your command, please wait a moment`)}`}...</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Fragment>
                :
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Fragment>
                                    {isDisabledButton ?
                                    <Fragment>
                                        {avatarFiles && avatarFiles.length ? (
                                            <Box  sx={{ width: '200px', height: '200px', alignItems: 'center'}}>
                                                <Img alt={`${t(`Upload Avatar image`)}`} src={URL.createObjectURL(avatarFiles[0] as any)}  sx={{width: '200px', height: '200px', borderRadius: '5px'}}/>
                                            </Box>
                                        ) : (
                                            <Box sx={{width: '200px', height: '200px', alignItems: 'center'}}>
                                                <Img alt={`${t(`Upload Avatar image`)}`} src={avatarFilesUrl} sx={{width: '200px', height: '200px', borderRadius: '5px'}}/>
                                            </Box>
                                        )}
                                    </Fragment>
                                    :
                                    <Box {...getRootPropsAvatar({ className: 'dropzone' })} sx={{width: '200px', height: '200px'}}>
                                        <input {...getInputPropsAvatar()} />
                                        {avatarFiles && avatarFiles.length ? (
                                            <Box  sx={{ alignItems: 'center'}}>
                                                <Img alt={`${t(`Upload Avatar image`)}`} src={URL.createObjectURL(avatarFiles[0] as any)} sx={{width: '100%', borderRadius: '5px'}}/>
                                            </Box>
                                        ) : (
                                            <Box sx={{alignItems: 'center'}}>
                                                <Img alt={`${t(`Upload Avatar image`)}`} src={avatarFilesUrl} sx={{width: '100%', borderRadius: '5px'}}/>
                                            </Box>
                                        )}
                                    </Box>
                                    }
                                </Fragment>
                                <Typography sx={{ mt: 3, textAlign: 'center'  }}>
                                    {avatarName}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Name')}`}
                                placeholder={`${t('Name')}`}
                                value={inputName}
                                onChange={handleInputNameChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputNameError}
                                helperText={inputNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Email')}`}
                                placeholder={`${t('Email')}`}
                                value={inputEmail}
                                onChange={handleInputEmailChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:email-outline' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputEmailError}
                                helperText={inputEmailError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Twitter')}`}
                                placeholder={`${t('Twitter')}`}
                                value={inputTwitter}
                                onChange={handleInputTwitterChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:twitter' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputTwitterError}
                                helperText={inputTwitterError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Github')}`}
                                placeholder={`${t('Github')}`}
                                value={inputGithub}
                                onChange={handleInputGithubChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:github' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputGithubError}
                                helperText={inputGithubError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Discord')}`}
                                placeholder={`${t('Discord')}`}
                                value={inputDiscord}
                                onChange={handleInputDiscordChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:discord' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputDiscordError}
                                helperText={inputDiscordError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Instagram')}`}
                                placeholder={`${t('Instagram')}`}
                                value={inputInstagram}
                                onChange={handleInputInstagramChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:instagram' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputInstagramError}
                                helperText={inputInstagramError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Telegram')}`}
                                placeholder={`${t('Telegram')}`}
                                value={inputTelegram}
                                onChange={handleInputTelegramChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:telegram' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputTelegramError}
                                helperText={inputTelegramError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Medium')}`}
                                placeholder={`${t('Medium')}`}
                                value={inputMedium}
                                onChange={handleInputMediumChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:medium' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputMediumError}
                                helperText={inputMediumError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Reddit')}`}
                                placeholder={`${t('Reddit')}`}
                                value={inputReddit}
                                onChange={handleInputRedditChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:reddit' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputRedditError}
                                helperText={inputRedditError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Youtube')}`}
                                placeholder={`${t('Youtube')}`}
                                value={inputYoutube}
                                onChange={handleInputYoutubeChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:youtube' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                error={!!inputYoutubeError}
                                helperText={inputYoutubeError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label={`${t('Bio')}`}
                                placeholder={`${t('Describe yourself')}`}
                                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:message-outline' />
                                        </InputAdornment>
                                    )
                                }} 
                                size='small' 
                                disabled={isDisabledButton} 
                                value={inputBio}
                                onChange={handleInputBioChange}
                                error={!!inputBioError}
                                helperText={inputBioError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Fragment>
                                {isDisabledButton ?
                                <Fragment>
                                    {bannerFiles && bannerFiles.length ? (
                                        <Box  sx={{ width: '100%', height: '200px', alignItems: 'center'}}>
                                            <Img alt={`${t(`Upload banner image`)}`} src={URL.createObjectURL(bannerFiles[0] as any)} sx={{height: '160px', borderRadius: '5px'}}/>
                                        </Box>
                                    ) : (
                                        <Box sx={{ width: '100%', height: '200px', alignItems: 'center'}}>
                                            <Img alt={`${t(`Upload banner image`)}`} src={bannerFilesUrl}/>
                                        </Box>
                                    )}
                                </Fragment>
                                :
                                <Box {...getRootPropsBanner({ className: 'dropzone' })} sx={acceptedFiles.length ? {} : {}}>
                                    <input {...getInputPropsBanner()} />
                                    {bannerFiles && bannerFiles.length ? (
                                        BannerImageShow
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                                            <Img alt={`${t(`Upload banner image`)}`} src={bannerFilesUrl} sx={{height: '160px', borderRadius: '5px'}}/>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                                                <HeadingTypography variant='h5'>{`${t(`Upload banner image`)}`}</HeadingTypography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                                }
                            </Fragment>
                        </Grid>

                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button 
                                type='submit' 
                                variant='contained' 
                                size='small' 
                                onClick={handleSubmitToBlockchain} 
                                disabled={isDisabledButton} 
                                >
                                {uploadingButton}
                            </Button>
                        </Grid>

                    </Grid>
                </CardContent>
                }
            </Card>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default ProfileApp
