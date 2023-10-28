// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router';

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Next Import
import Link from 'next/link'
import CustomAvatar from 'src/@core/components/mui/avatar'

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
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'

import { formatHash, formatXWE, formatSecondToMinute, formatTimestamp, formatStorageSize, formatTimestampAge, getContentTypeAbbreviation, parseTxAndGetMemoInfo } from 'src/configs/functions';

import { ThemeColor } from 'src/@core/layouts/types'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { TxRecordType } from 'src/types/apps/Chivesweave'


interface BlockViewInfoType {
  block: any
  txs: any
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const BlockView = () => {
  
  const router = useRouter();
  const { id } = router.query;

  const [blockViewInfo, setBlockViewInfo] = useState<BlockViewInfoType>()

  useEffect(() => {
    if(id != undefined) {
      axios
        .get(authConfig.backEndApi + '/block/txsrecord/' + id, { headers: { }, params: { } })
        .then(res => {
          setBlockViewInfo(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  return (
    <Fragment>
      {blockViewInfo ? 
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`Block ${id}`} />
              <CardContent>
                <Grid container spacing={6}>

                  <Grid item xs={12} lg={5}>
                    <TableContainer>
                      <Table size='small' sx={{ width: '95%' }}>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 0,
                              pt: 2,
                              pb: 2.5,
                              pl: '0 !important',
                              pr: '0 !important',
                              '&:first-of-type': {
                                width: 148
                              }
                            }
                          }}
                        >
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                Timestamp:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatTimestamp(blockViewInfo.block.timestamp)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Mined Time:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatSecondToMinute(blockViewInfo.block.mining_time)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Size:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatStorageSize(blockViewInfo.block.block_size)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <TableContainer>
                      <Table size='small'>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 0,
                              pt: 2,
                              pb: 2.5,
                              pl: '0 !important',
                              pr: '0 !important',
                              '&:first-of-type': {
                                width: 148
                              }
                            }
                          }}
                        >
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                Age:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatTimestampAge(blockViewInfo.block.timestamp)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Miner:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatHash(blockViewInfo.block.reward_addr, 7)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Tx Reward Pool:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(blockViewInfo.block.reward_pool, 6)} XWE</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} lg={3}>
                    <TableContainer>
                      <Table size='small'>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 0,
                              pt: 2,
                              pb: 2.5,
                              pl: '0 !important',
                              pr: '0 !important',
                              '&:first-of-type': {
                                width: 148
                              }
                            }
                          }}
                        >
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Transactions:
                              </Typography>
                            </TableCell>
                            <TableCell>{blockViewInfo.block.txs_length}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Confirmations:
                              </Typography>
                            </TableCell>
                            <TableCell>{blockViewInfo.block.currentheight - blockViewInfo.block.height}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                              Miner Reward:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatXWE(blockViewInfo.block.reward, 2)} XWE</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                </Grid>
              </CardContent>

            </Card>
          </Grid>
          
          {blockViewInfo.txs && blockViewInfo.txs.length > 0 ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Transactions' />

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
                      {blockViewInfo.txs.map((item: TxRecordType, index: number) => (
                        <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                          <TableCell><LinkStyled href={`/txs/view/${item.id}`}>{formatHash(item.id, 7)}</LinkStyled></TableCell>
                          <TableCell>{formatHash(item.owner.address, 7)}</TableCell>
                          <TableCell>{formatStorageSize(item.data.size)}</TableCell>
                          <TableCell>
                            {getContentTypeAbbreviation(item.data.type)}
                            <CustomAvatar skin='light' color={(FileTypeObj[getContentTypeAbbreviation(item.data.type)].color as ThemeColor) || ('primary' as ThemeColor)} sx={{ width: '1.875rem', height: '1.875rem' }}>
                              <Icon icon={FileTypeObj[getContentTypeAbbreviation(item.data.type)].icon} fontSize='1rem' />
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
          :
            <Fragment></Fragment>
          }
          
        </Grid>
      :
        <Fragment></Fragment>
    }
    </Fragment>
  )
}





export default BlockView
