// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** MUI Imports
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import UploadWalletJsonFile from 'src/views/form/UploadWalletJsonFile'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, getWalletByAddress, downloadTextFile, removePunctuation, deleteWalletById } from 'src/functions/ChivesweaveWallets'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import toast from 'react-hot-toast'

const MyWallets = () => {
  // ** Hook
  const { t } = useTranslation()
    
  const [walletBalanceMap, setWalletBalanceMap] = useState<any>({})
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [createWalletWindow, setCreateWalletWindow] = useState<boolean>(false)
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [wantDeleteWalletId, setWantDeleteWalletId] = useState<string>("")
  const [wantDeleteWalletAddress, setWantDeleteWalletAddress] = useState<string>("")
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const [faucetButtonMap, setFaucetButtonMap] = useState<any>({})

  useEffect(() => {
    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if(createWalletWindow == false) {
      setGetAllWalletsData(getAllWallets())
      setGetWalletNicknamesData(getWalletNicknames())
    }
  }, [createWalletWindow, refreshWalletData])

  useEffect(() => {
    const walletBalanceMapItem: any = {}
    const processWallets = async () => {
      await Promise.all(getAllWalletsData.map(async (wallet: any) => {
        const currentBalance = await getWalletBalance(wallet.data.arweave.key);
        walletBalanceMapItem[wallet.data.arweave.key] = currentBalance
      }));
      setWalletBalanceMap(walletBalanceMapItem)
    };  
    processWallets();
  }, [getAllWalletsData])

  const handleInputNicknameChange = (event: any, Address: string) => {
    setWalletNickname(Address, event.target.value as string);
    console.log("event", event.target.value);
    console.log("Address", Address);
  };

  const handleClickToExport = (event: any, Address: string) => {
    console.log("event", event.target.value);
    console.log("Address", Address);
    const fileName = "chivesweave_keyfile_" + Address + "____" + removePunctuation(getWalletNicknamesData[Address]) + ".json";
    const mimeType = "text/plain";
    downloadTextFile(JSON.stringify(getWalletByAddress(Address).jwk), fileName, mimeType);
  };

  const handleClickToFaucet = async (event: any, Address: string) => {
    console.log("event", event.target.value);
    console.log("Address", Address);
    const formData = new FormData();
    formData.append('Address',Address);
    const Info = await axios.get(authConfig.backEndApi).then(res => {
      return res.data
    });
    formData.append('current',Info.current);
    formData.append('height',Info.height);
    formData.append('diff',Info.diff);
    axios.post(authConfig.faucetApi, formData).then(res => {
      console.log("res", res.data)
      setFaucetButtonMap({...faucetButtonMap, [Address]:true})
      if(res.data['result']=="OK")  {
        toast.success(t("Successfully acquired 0.05 XWE, estimated to be deposited into your wallet in 3-10 minutes.") as string, { duration: 4000 })
      }
      else {
        toast.error(res.data['result'], { duration: 4000 })
      }
      console.log("faucetButtonMap", faucetButtonMap)
    });
  };

  const handleClickToDelete = (event: any, Address: string, WalletId: string) => {
    setWantDeleteWalletId(WalletId)
    setWantDeleteWalletAddress(Address)
    setIsDialog(true);
    setOpen(true);
  };

  const handleNoClose = () => {
    setOpen(false)
    setIsDialog(false)
  }

  const handleYesClose = () => {
    setOpen(false)
    setIsDialog(false)
    console.log("wantDeleteWalletId", wantDeleteWalletId)
    if(wantDeleteWalletId!=="" && wantDeleteWalletId!==undefined) {
      deleteWalletById(Number(wantDeleteWalletId))
    }
    setWantDeleteWalletId("")
    setWantDeleteWalletAddress("")
    setRefreshWalletData(refreshWalletData+1)
  }

  const handleRefreshWalletData = () => {
    setRefreshWalletData(refreshWalletData+1)
    setOpen(false)
    setIsDialog(false)
    setCreateWalletWindow(false)
  }

  return (
    <Fragment>

      {isDialog == true ? 
      <Fragment>
          <Dialog
              open={open}
              disableEscapeKeyDown
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              >
              <DialogTitle id='alert-dialog-title'>{`${t(`Are you deleting your wallet?`)}`}</DialogTitle>
              <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                  {`${t(`Once this wallet is deleted, it cannot be restored.`)}`}
                  {`${t(`Do you want delete this wallet`)}`} {wantDeleteWalletAddress} ?
                  </DialogContentText>
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                  <Button onClick={handleNoClose} color="error" size='large' variant='contained' >{`${t(`No`)}`}</Button>
                  <Button onClick={handleYesClose} color="primary">{`${t(`Yes`)}`}</Button>
              </DialogActions>
          </Dialog>
      </Fragment>
      :
      <Fragment></Fragment>
      }

      {getAllWalletsData && createWalletWindow == false ? 
        <Grid container spacing={6}>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`My Wallets`)}`}
                          action={
                            <div>
                              <Button size='small' variant='contained' onClick={() => setCreateWalletWindow(true)}>
                              {`${t(`Create Wallet`)}`}
                              </Button>
                            </div>
                          }
                          />
              <Divider sx={{ m: '0 !important' }} />
              <TableContainer>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead >
                    <TableRow>
                      <TableCell align="center">{`${t(`Id`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Address`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Balance`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Nickname`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Faucet`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Export`)}`}</TableCell>
                      <TableCell align="center">{`${t(`Delete`)}`}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {getAllWalletsData.map((wallet: any, index: number) => (
                      <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                        <TableCell align="center">{(index+1)}</TableCell>
                        <TableCell align="center">{wallet.data.arweave.key}</TableCell>
                        <TableCell align="right">{walletBalanceMap[wallet.data.arweave.key]}</TableCell>
                        <TableCell align="center">
                          <TextField  id={wallet.data.arweave.key} 
                                      label={`${t(`Nickname`)}`} 
                                      variant='standard' 
                                      color='success'
                                      defaultValue={getWalletNicknamesData[wallet.data.arweave.key]}
                                      onChange={(event) => handleInputNicknameChange(event, wallet.data.arweave.key)}
                                      />
                        </TableCell>
                        <TableCell align="center" title={`${t(`Get free 0.05 Xwe when this address is less than 0.01 and only use upload files purposes`)}`}>
                          <Tooltip title={`${t(`Get free 0.05 Xwe when this address is less than 0.01 and only use upload files purposes`)}`}>
                            <Button variant='contained' size='small' onClick={(event) => handleClickToFaucet(event, wallet.data.arweave.key)} disabled={(walletBalanceMap[wallet.data.arweave.key] > 0.01 || faucetButtonMap[wallet.data.arweave.key])?true:false} sx={{ whiteSpace: 'nowrap' }}>
                            {`${t(`Faucet`)}`}
                            </Button>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Button variant='contained' size='small' endIcon={<Icon icon='mdi:export' />} onClick={(event) => handleClickToExport(event, wallet.data.arweave.key)}  sx={{ whiteSpace: 'nowrap' }}>
                          {`${t(`Export`)}`}
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button variant='contained' size='small' endIcon={<Icon icon='mdi:delete'/>} onClick={(event) => handleClickToDelete(event, wallet.data.arweave.key, wallet.id)} color="info" sx={{ whiteSpace: 'nowrap' }}>
                          {`${t(`Delete`)}`}
                          </Button>
                        </TableCell>
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
      {createWalletWindow == true ? 
        <Grid container spacing={6}>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Create Wallet`)}`}
                          action={
                            <div>
                              <Button size='small' variant='contained' onClick={() => setCreateWalletWindow(false)}>
                              {`${t(`Wallet List`)}`}
                              </Button>
                            </div>
                          }
                          />
              <Divider sx={{ m: '0 !important' }} />
              <UploadWalletJsonFile  handleRefreshWalletData={handleRefreshWalletData} />
            </Card>
          </Grid>
        </Grid>
      :
        <Fragment></Fragment>
      }
    </Fragment>
  )
}

export default MyWallets
