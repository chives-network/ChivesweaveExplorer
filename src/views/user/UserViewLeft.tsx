// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSubscriptionDialog from 'src/views/user/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Hooks
import { getWalletProfile } from 'src/functions/ChivesweaveWallets'
import authConfig from 'src/configs/auth'
import { useTranslation } from 'react-i18next'

const data: UsersType = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

interface Props {
  address: string
}

const UserViewLeft = ({ address }: Props) => {
  // ** States
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  const { t } = useTranslation()

  const LevelName = ['InActive', 'Level 1', 'Level 2', 'Level 3'];

  useEffect(() => {
    if(address && address.length == 43) {
        handleGetProfile()
    }
  }, [address])

  const [inputName, setInputName] = useState<string>("")
  const [inputEmail, setInputEmail] = useState<string>("")
  const [inputTwitter, setInputTwitter] = useState<string>("")
  const [inputGithub, setInputGithub] = useState<string>("")
  const [inputDiscord, setInputDiscord] = useState<string>("")
  const [inputInstagram, setInputInstagram] = useState<string>("")
  const [inputTelegram, setInputTelegram] = useState<string>("")
  const [inputMedium, setInputMedium] = useState<string>("")
  const [inputReddit, setInputReddit] = useState<string>("")
  const [inputYoutube, setInputYoutube] = useState<string>("")
  const [inputBio, setInputBio] = useState<string>("")
  const [avatarFilesUrl, setAvatarFilesUrl] = useState<string>('')
  const [bannerFilesUrl, setBannerFilesUrl] = useState<string>('/images/misc/upload.png')
  const [agentLevel, setAgentLevel] = useState<string>("")

  console.log("bannerFilesUrl", bannerFilesUrl)
  
  const handleGetProfile = async () => {
    const getWalletProfileData: any = await getWalletProfile(address)
    console.log("getWalletProfileData", getWalletProfileData)
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Name']) {
        setInputName(getWalletProfileData['Profile']['Name']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Email']) {
        setInputEmail(getWalletProfileData['Profile']['Email']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Twitter']) {
        setInputTwitter(getWalletProfileData['Profile']['Twitter']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Github']) {
        setInputGithub(getWalletProfileData['Profile']['Github']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Discord']) {
        setInputDiscord(getWalletProfileData['Profile']['Discord']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Instagram']) {
        setInputInstagram(getWalletProfileData['Profile']['Instagram']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Telegram']) {
        setInputTelegram(getWalletProfileData['Profile']['Telegram']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Medium']) {
        setInputMedium(getWalletProfileData['Profile']['Medium']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Reddit']) {
        setInputReddit(getWalletProfileData['Profile']['Reddit']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Youtube']) {
        setInputYoutube(getWalletProfileData['Profile']['Youtube']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Bio']) {
        setInputBio(getWalletProfileData['Profile']['Bio']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Avatar'] && getWalletProfileData['Profile']['Avatar'].length == 43) {
        setAvatarFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Avatar']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Banner'] && getWalletProfileData['Profile']['Banner'].length == 43) {
        setBannerFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Banner']);
    }
    if(getWalletProfileData && getWalletProfileData['AgentLevel']) {
      setAgentLevel(getWalletProfileData['AgentLevel']);
    }
  }
  
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {avatarFilesUrl.length ? (
                <CustomAvatar
                  src={avatarFilesUrl}
                  variant='rounded'
                  alt={inputName}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(inputName)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {inputName}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={LevelName[Number(agentLevel)]}
                color={'error'}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>
            
            {/* 
            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>1.23k</Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:star-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>568</Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>
            */}

            <CardContent>
              <Typography variant='h6'>{`${t(`Profile`)}`}</Typography>
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Name`)}`}:</Typography>
                  <Typography variant='body2'>{inputName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Email`)}`}:</Typography>
                  <Typography variant='body2'>{inputEmail}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Twitter`)}`}:</Typography>
                  <Typography variant='body2'>{inputTwitter}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Github`)}`}:</Typography>
                  <Typography variant='body2'>{inputGithub}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Discord`)}`}:</Typography>
                  <Typography variant='body2'>{inputDiscord}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Instagram`)}`}:</Typography>
                  <Typography variant='body2'>{inputInstagram}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Telegram`)}`}:</Typography>
                  <Typography variant='body2'>{inputTelegram}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Medium`)}`}:</Typography>
                  <Typography variant='body2'>{inputMedium}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Reddit`)}`}:</Typography>
                  <Typography variant='body2'>{inputReddit}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Youtube`)}`}:</Typography>
                  <Typography variant='body2'>{inputYoutube}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Bio`)}`}:</Typography>
                  <Typography variant='body2'>{inputBio}</Typography>
                </Box>
              </Box>
            </CardContent>

            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>

      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
