// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import { getAllWallets, getCurrentWalletAddress, setCurrentWallet, getWalletNicknames, CheckBundleTxStatus } from 'src/functions/ChivesweaveWallets'
import { formatHash} from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props
  
  // ** Hook
  const { t } = useTranslation()

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  
  const { setAuthContextCurrentAddress } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleSwitchWalletAndDropdownClose = (url: string, address: string) => {
    setCurrentWallet(address)
    setAuthContextCurrentAddress(address)
    if (url) {
      //router.push(url)
    }
    setAnchorEl(null)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      CheckBundleTxStatus();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const getAllWalletsData = getAllWallets()
  const getCurrentWalletAddressData = getCurrentWalletAddress()
  const getWalletNicknamesData = getWalletNicknames()
  
  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            { getAllWalletsData && getAllWalletsData.length > 0 ?
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>{formatHash(getCurrentWalletAddressData, 5)}</Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  {`${t(`Current Wallet`)}`}
                </Typography>
              </Box>
              :
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  {`${t(`No Wallet`)}`}
                </Typography>
              </Box>
            }
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        {getAllWalletsData && getAllWalletsData.length > 0 && getAllWalletsData.map((wallet: any, index: number)=>{

          return (
            <MenuItem key={index} sx={{ p: 0 }} onClick={() => handleSwitchWalletAndDropdownClose('/myfiles/', wallet.data.arweave.key)}>
              {wallet.data.arweave.key == getCurrentWalletAddressData ?
                <Box sx={styles}>
                  <Icon icon='mdi:cog-outline' />
                  <Typography sx={{ fontWeight: 600 }}>{getWalletNicknamesData[wallet.data.arweave.key] ? getWalletNicknamesData[wallet.data.arweave.key] : formatHash(wallet.data.arweave.key, 5)}</Typography>
                </Box>
                :
                <Box sx={styles}>
                  <Icon icon='mdi:currency-usd' />
                  {getWalletNicknamesData[wallet.data.arweave.key] ? getWalletNicknamesData[wallet.data.arweave.key] : formatHash(wallet.data.arweave.key, 5)}
                </Box>
              }              
            </MenuItem>          
          )
        })}
        <Divider />
        { getAllWalletsData && getAllWalletsData.length > 0 ?
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/mywallets')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            {`${t(`Settings`)}`}
          </Box>
        </MenuItem>
        :
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/mywallets')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            {`${t(`Create Wallet`)}`}
          </Box>
        </MenuItem>
        }
        <Divider />
        { getAllWalletsData && getAllWalletsData.length > 0 ?
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/profile')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            {`${t(`Profile`)}`}
          </Box>
        </MenuItem>
        :
        null
        }
        { getAllWalletsData && getAllWalletsData.length > 0 ?
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/agent/register')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            {`${t(`Register Agent`)}`}
          </Box>
        </MenuItem>
        :
        null
        }
      </Menu>
    </Fragment>
  )
}

/*
<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/faq')}>
  <Box sx={styles}>
    <Icon icon='mdi:help-circle-outline' />
    {`${t(`FAQ`)}`}
  </Box>
</MenuItem>
*/
export default UserDropdown
