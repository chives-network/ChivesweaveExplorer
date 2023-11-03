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
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

import { formatTimestamp, formatStorageSize } from 'src/configs/functions';

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

interface NodeInfoType {
  ip: string
  location: string
  isp: string
  country: string
  region: string
  city: string
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

const PeersInfo = () => {
  
  const [peers, setPeers] = useState<NodeInfoType[]>()

  const [chainInfo, setChainInfo] = useState<ChainInfoType>()

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
        .then(res => {
          setChainInfo(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
  }, [])

  useEffect(() => {
    
    //Frist Time Api Fetch
    axios.get(authConfig.backEndApi + '/peersinfo', { headers: { }, params: { } })
        .then(res => {
          setPeers(res.data);
        })

    const intervalId = setInterval(() => {
      //Interval Time Api Fetch
      axios.get(authConfig.backEndApi + '/peersinfo', { headers: { }, params: { } })
        .then(res => {
          setPeers(res.data);
        })
    }, 120000);

    return () => clearInterval(intervalId);

  }, [])

  return (
    <Fragment>
      {peers ? 
        <Grid container spacing={6}>
          
          {chainInfo != undefined ?
            <Grid item xs={12}>
              <Card>
                <CardHeader title={`Chivesweave Blockchain`} />
                <CardContent>
                  <Grid container spacing={6}>

                    <Grid item xs={12} lg={12}>
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
                                  Network:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.network}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                  Height:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.height}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                  Time:
                                </Typography>
                              </TableCell>
                              <TableCell>{formatTimestamp(chainInfo.time)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                  Peers:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.peers}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                  Weave Size:
                                </Typography>
                              </TableCell>
                              <TableCell>{formatStorageSize(chainInfo.weave_size)}</TableCell>
                            </TableRow>

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                  </Grid>
                </CardContent>

              </Card>
            </Grid>
          :
            <Fragment></Fragment>
          }
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Nodes' />

              <Divider sx={{ m: '0 !important' }} />

              <TableContainer>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead >
                    <TableRow>
                      <TableCell>Ip</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Isp</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>City</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {peers.map((item: NodeInfoType, index: number) => (
                      <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                        <TableCell>{item.ip}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.isp}</TableCell>
                        <TableCell>{item.country}</TableCell>
                        <TableCell>{item.region}</TableCell>
                        <TableCell>{item.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      :
        <Fragment></Fragment>
    }
    </Fragment>
  )
}

export default PeersInfo
