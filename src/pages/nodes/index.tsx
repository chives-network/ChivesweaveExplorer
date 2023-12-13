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
import { isMobile } from 'src/configs/functions'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

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
  result: any
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
  // ** Hook
  const { t } = useTranslation()
  
  const [peers, setPeers] = useState<NodeInfoType[]>()

  const [chainInfo, setChainInfo] = useState<ChainInfoType>()

  const isMobileData = isMobile()

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
        .then(res => {
          setChainInfo(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })

        /*
        // 示例
        const plaintext = 'Hello, AES-GCM!Hello!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
        
        const getCurrentWalletData = getCurrentWallet();
        const FileEncrypt = EncryptDataWithKey(plaintext, "FileName001", getCurrentWalletData.jwk);
        
        console.log('EncryptDataWithKeyData:', FileEncrypt);

        const FileCipherKey = calculateSHA256(FileEncrypt['Cipher-IV'] + FileEncrypt['Cipher-UUID'] + getCurrentWalletData.jwk.d);
        console.log('FileCipherKey:', FileCipherKey);

        const FileName = DecryptDataAES256GCM(FileEncrypt['File-Name'], FileEncrypt['Cipher-IV'], FileEncrypt['Cipher-TAG-FileName'], FileCipherKey);
        console.log('FileName:', FileName);

        const FileEncryptKey = DecryptDataAES256GCM(FileEncrypt['Cipher-KEY'], FileEncrypt['Cipher-IV'], FileEncrypt['Cipher-TAG'], FileCipherKey);
        console.log('FileEncryptKey:', FileEncryptKey);

        const IV = FileEncryptKey.slice(0,32);
        const TAG = FileEncryptKey.slice(32,64);
        const KEY = FileEncryptKey.slice(64);
        console.log('IV:', IV);
        console.log('TAG:', TAG);
        console.log('KEY:', KEY);
        const FileContent = DecryptDataAES256GCM(FileEncrypt['Cipher-CONTENT'], IV, TAG, KEY);
        console.log('FileContent:', FileContent);

        const encryptAndDecrypt = async () => {
          const getCurrentWalletData = getCurrentWallet();      
          const plaintext = 'Hello, World!!!!!!!!!!!!!!!!!!!!--!!!!0';      
          const encryptedData = await encryptWithPublicKey(getCurrentWalletData.jwk.n, plaintext);
          console.log('Encrypted Data:', encryptedData);      
          const decryptedText = await decryptWithPrivateKey(getCurrentWalletData.jwk, encryptedData);
          console.log('Decrypted Text:', decryptedText);      
        }
        encryptAndDecrypt();

        */

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
                <CardHeader title={`${t(`Blockchain`)}`} />
                <CardContent>
                  <Grid container spacing={6}>

                    <Grid item xs={12} lg={12}>
                      <TableContainer>
                        <Table size='small' sx={{ width: '95%' }}>
                          <TableBody
                            sx={{
                              '& .MuiTableCell-root': {
                                border: 0,
                                pt: 1.5,
                                pb: 1.5,
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
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Network`)}`}:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.network}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Height`)}`}:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.height}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Time`)}`}:
                                </Typography>
                              </TableCell>
                              <TableCell>{formatTimestamp(chainInfo.time)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Peers`)}`}:
                                </Typography>
                              </TableCell>
                              <TableCell>{chainInfo.peers}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Weave Size`)}`}:
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
          
          {isMobileData ?
            <Fragment>
              {peers.map((item: NodeInfoType, index: number) => (
                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                  <Card>
                    <CardContent> 
                      <TableContainer>
                        <Table size='small' sx={{ width: '95%' }}>
                          <TableBody
                            sx={{
                              '& .MuiTableCell-root': {
                                border: 0,
                                pt: 1.5,
                                pb: 1.5,
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
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Ip`)}`}：{item.ip}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Location`)}`}：{item.result.location}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Isp`)}`}：{item.result.isp}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Country`)}`}：{item.result.country}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`Region`)}`}：{item.result.region}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {`${t(`City`)}`}：{item.result.city}
                                </Typography>
                              </TableCell>
                            </TableRow>

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>    
                  </Card>
                </Grid>
              ))}              
            </Fragment>
          :
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Nodes`)}`} />

              <Divider sx={{ m: '0 !important' }} />

              <TableContainer>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead >
                    <TableRow>
                      <TableCell>{`${t(`Ip`)}`}</TableCell>
                      <TableCell>{`${t(`Location`)}`}</TableCell>
                      <TableCell>{`${t(`Isp`)}`}</TableCell>
                      <TableCell>{`${t(`Country`)}`}</TableCell>
                      <TableCell>{`${t(`Region`)}`}</TableCell>
                      <TableCell>{`${t(`City`)}`}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {peers.map((item: NodeInfoType, index: number) => (
                      <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                        <TableCell>{item.ip}</TableCell>
                        <TableCell>{item.result.location}</TableCell>
                        <TableCell>{item.result.isp}</TableCell>
                        <TableCell>{item.result.country}</TableCell>
                        <TableCell>{item.result.region}</TableCell>
                        <TableCell>{item.result.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Card>
          </Grid>
          }
          
        </Grid>
      :
        <Fragment></Fragment>
    }
    </Fragment>
  )
}

export default PeersInfo
