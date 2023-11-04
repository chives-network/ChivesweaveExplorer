
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { formatHash } from 'src/configs/functions';
import { Fragment } from 'react'

const ImageRectangle = ( {item, backEndApi, FileType} : any) => {
  const FileMap: { [key: string]: string } = {}
  item?.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileName = FileMap['File-Name'];
  const timestamp = item.block.timestamp;
  const date = new Date(timestamp * 1000);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAbbreviation = monthNames[date.getMonth()];
  const day = date.getDate();

  console.log("FileType", FileType)

  return (
    <Card>
      {FileType && (FileType=="png" || FileType=="jpeg" || FileType=="gif") ?
        <CardMedia image={`${backEndApi}/${item.id}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="mp4" ?
        <CardMedia component="video" controls src={`${backEndApi}/${item.id}`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="pdf" ?
        <CardMedia image={`${backEndApi}/${item.id}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="office" ?
        <CardMedia image={`${backEndApi}/${item.id}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="stl" ?
        <CardMedia image={`${backEndApi}/${item.id}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        :
        <Fragment></Fragment>
      }
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, width: '3rem', height: '3.375rem' }}>
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, lineHeight: 1.29, color: 'primary.main', letterSpacing: '0.47px' }}
              >
                {monthAbbreviation}
              </Typography>
              <Typography variant='h6' sx={{ mt: -0.75, fontWeight: 600, color: 'primary.main' }}>
                {day}
              </Typography>
            </Box>
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600 }}>{formatHash(FileName, 12)}</Typography>
          </Box>
        </Box>

        <Divider
          sx={{ mb: theme => `${theme.spacing(4)} !important`, mt: theme => `${theme.spacing(4.75)} !important` }}
        />

        <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
          <Icon icon='mdi:user' />
          <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
            <Typography sx={{ fontSize: '0.9rem' }}>Owner: </Typography>
            <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(item.owner.address, 6)}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
          <Icon icon='icon-park-outline:transaction-order' />
          <Box sx={{ display: 'flex', flexDirection: 'row', mt:'4px' }}>
            <Typography sx={{ fontSize: '0.9rem' }}>TxId: </Typography>
            <Typography variant='caption' sx={{ ml: '4px', mt: '2px' }}>{formatHash(item.id, 6)}</Typography>
          </Box>
        </Box>

      </CardContent>
    </Card>
  )
}

export default ImageRectangle
