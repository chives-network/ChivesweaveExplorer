// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

import { formatHash, formatXWE, formatStorageSize, getContentTypeAbbreviation, parseTxAndGetMemoInfo } from 'src/configs/functions';

import { ThemeColor } from 'src/@core/layouts/types'

import { TxRecordType } from 'src/types/apps/Chivesweave'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface FileTypeObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

const FileTypeObj: FileTypeObj = {
  TEXT: { color: 'primary', icon: 'mdi:receipt-text-edit' },
  HTML: { color: 'success', icon: 'vscode-icons:file-type-html' },
  JSON: { color: 'primary', icon: 'mdi:code-json' },
  XML: { color: 'warning', icon: 'vscode-icons:file-type-xml' },
  ZIP: { color: 'error', icon: 'vscode-icons:file-type-zip2' },
  JPEG: { color: 'info', icon: 'iconoir:jpeg-format' },
  PNG: { color: 'primary', icon: 'iwwa:file-png' },
  DOC: { color: 'success', icon: 'vscode-icons:file-type-word2' },
  XLS: { color: 'primary', icon: 'vscode-icons:file-type-excel2' },
  PPT: { color: 'warning', icon: 'vscode-icons:file-type-powerpoint2' },
  MP4: { color: 'error', icon: 'teenyicons:mp4-outline' },
  WEBM: { color: 'info', icon: 'teenyicons:webm-outline' },
  PDF: { color: 'primary', icon: 'vscode-icons:file-type-pdf2' },
  DOCX: { color: 'success', icon: 'vscode-icons:file-type-word2' },
  XLSX: { color: 'primary', icon: 'vscode-icons:file-type-excel2' },
  PPTX: { color: 'warning', icon: 'vscode-icons:file-type-powerpoint2' },
  GIF: { color: 'error', icon: 'teenyicons:gif-outline' },
  BMP: { color: 'primary', icon: 'teenyicons:bmp-outline' },
  MP3: { color: 'success', icon: 'teenyicons:mp3-outline' },
  WAV: { color: 'primary', icon: 'teenyicons:wav-outline' }
}

const Mempool = () => {
  
  const [txViewInfo, setTxViewInfo] = useState<TxRecordType[]>()

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/tx/pending/record', { headers: { }, params: { } })
        .then(res => {
          setTxViewInfo(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
  }, [])

  return (
    <Fragment>

    <Grid item xs={12}>
        <Card>
        <CardHeader title='Transactions in memory' />

        <Divider sx={{ m: '0 !important' }} />

        <TableContainer>
            <Table sx={{ minWidth: 500 }}>
            <TableHead >
                <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Info</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {txViewInfo && txViewInfo.map((item: TxRecordType, index: number) => (
                <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                    <TableCell>{formatHash(item.id, 7)}</TableCell>
                    <TableCell>{formatHash(item.owner.address, 7)}</TableCell>
                    <TableCell>{formatStorageSize(item.data.size)}</TableCell>
                    <TableCell>
                    {getContentTypeAbbreviation(item.data.type)}
                    <CustomAvatar skin='light' color={(FileTypeObj[getContentTypeAbbreviation(item.data.type)]?.color as ThemeColor) || ('primary' as ThemeColor)} sx={{ width: '1.875rem', height: '1.875rem' }}>
                        <Icon icon={FileTypeObj[getContentTypeAbbreviation(item.data.type)]?.icon} fontSize='1rem' />
                    </CustomAvatar>
                    </TableCell>
                    <TableCell>{formatXWE(item.fee.winston, 6)} XWE</TableCell>
                    <TableCell>{parseTxAndGetMemoInfo(item)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        </Card>
    </Grid>
        
    </Fragment>
  )
}

Mempool.guestGuard = true

export default Mempool
