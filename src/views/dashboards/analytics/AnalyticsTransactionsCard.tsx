// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

interface ChainInfoType {
  network: string
  version: number
  release: number
  height: number
  current: string
  blocks: number
  peers: number
  time: number
  miningtime: number
  weave_size: number
  denomination: number
  diff: string
}

const renderStats = (data: ChainInfoType) => {
  const salesData: DataType[] = [
    {
      stats: String(data.height),
      title: 'Height',
      color: 'primary',
      icon: <Icon icon='mdi:trending-up' />
    },
    {
      stats: String(data.peers),
      title: 'Peers',
      color: 'success',
      icon: <Icon icon='mdi:account-outline' />
    },
    {
      stats: String((data.weave_size/(1024*1024*1024)).toFixed(1)) + "Gb",
      title: 'Weave Size',
      color: 'warning',
      icon: <Icon icon='mdi:cellphone-link' />
    },
    {
      stats: String(data.release),
      title: 'Release',
      color: 'info',
      icon: <Icon icon='mdi:currency-usd' />
    }
  ]
  
  return salesData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          variant='rounded'
          color={item.color}
          sx={{ mr: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
        >
          {item.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

export type propsType = {
  data: ChainInfoType
}

const AnalyticsTransactionsCard = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  return (
    <Card>
      <CardHeader
        title={`${t(`Network Info`)}`}
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: (theme: any) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsTransactionsCard
