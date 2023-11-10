// ** React Imports
import { Fragment, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

import CircularProgress from '@mui/material/CircularProgress'

// ** Hooks
import { sendAmount, getHash, isAddress } from 'src/functions/ChivesweaveWallets'

// ** Third Party Components
import toast from 'react-hot-toast'

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

const FileUploaderMultiple = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>("Submit")
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [removeAllButton, setRemoveAllButton] = useState<string>("Remove All")
  
  const auth = useAuth()
  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress
  const handleUploadAllFiles = () => {
    setIsDisabledButton(true)
    setUploadingButton("Uploading...")
    files.map((file: File) => {
        if(uploadProgress[file.name] != 100) {
            uploadFiles(currentWallet, file);
        }
        else {
            console.log("[File have uploaded, not upload this time]:", file.name)
        }
    })
  }

  const [inputAddress, setInputAddress] = useState<string>("")
  const [inputAddressError, setInputAddressError] = useState<string | null>(null)
  const handleInputAddressChange = (event: any) => {
    setInputAddress(event.target.value);
    if(event.target.value.length != 43) {
        setInputAddressError("Address length must be 43")
    }
    else if(event.target.value == currentAddress) {
        setInputAddressError("You cannot send amounts to yourself")
    }
    else if(!isAddress(event.target.value))  {
        setInputAddressError("The address you entered is invalid")
    }
    else {
        setInputAddressError("")
    }
    
    //console.log("inputAddress", inputAddress)
  };
  
  const [addressBalance, setAddressBalance] = useState<number>(0)
  useEffect(() => {
    if(currentAddress != undefined && currentAddress.length == 43) {
      axios.get(authConfig.backEndApi + '/wallet/' + currentAddress + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(res.data);
        })
    }
  }, [currentAddress])

  const [inputAmount, setInputAmount] = useState<string>("")
  const [inputAmountError, setInputAmountError] = useState<string | null>(null)
  const handleInputAmountChange = (event: any) => {
    setInputAmount(event.target.value);
    if(event.target.value <= 0) {
        setInputAmountError("The amount entered must be greater than 0")
    }
    else if(event.target.value >= addressBalance) {
        setInputAmountError("The amount sent cannot exceed the current balance")
    }
    else {
        setInputAmountError("")
    }
    
    //console.log("inputAmount", inputAmount)
    //setInputAmountError("sss")
  };

  const [inputData, setInputData] = useState<string>("")
  const [inputDataError, setInputDataError] = useState<string | null>(null)
  const handleInputDataChange = (event: any) => {
    setInputData(event.target.value);
    setInputDataError("")
    
    //console.log("inputData", inputData)
  };

  
  const handleSubmit = async () => {
    if(!isAddress(inputAddress))  {
        setInputAddressError("The address you entered is invalid")
        
        return 
    }
    if(Number(inputAmount) <= 0 || Number(inputAmount) >= addressBalance)  {
        setInputAddressError("The amount you entered is invalid")
        
        return 
    }
    
    //Send coin out
    setIsDisabledButton(true)
    setUploadingButton("Submitting...")
    await sendAmount(currentWallet, inputAddress, String(inputAmount), [], inputData, "SubmitStatus", setUploadProgress);

  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setIsDisabledButton(false)
      setUploadingButton("Upload Files")      
      setRemoveAllButton("Remove All")
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }
  
  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      {uploadProgress[file.name] && (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant='determinate' {...{value: uploadProgress[file.name]??0}} size={50} />
                <Box
                sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                >
                <Typography variant='caption' component='div' color='text.secondary'>
                    {uploadProgress[file.name]??0}%
                </Typography>
                </Box>
            </Box>
      )}
      { uploadProgress[file.name] && uploadProgress[file.name] > 0 ?
            <Fragment></Fragment>
        :
            <IconButton onClick={() => handleRemoveFile(file)}>
                <Icon icon='mdi:close' fontSize={20} />
            </IconButton> 
        }
      
    </ListItem>
  ))

  const handleLinkClick = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  const handleRemoveAllFiles = () => {
    setFiles([])    
    setIsDisabledButton(false)
    setUploadingButton("Upload Files")
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
        setIsDisabledButton(false)
        setUploadingButton("Submit")
        setRemoveAllButton("Clean Records")
        setInputAddress("")
        setInputAmount("")
        setInputData("")
        toast.success('Successfully submitted to blockchain', { duration: 4000 })
    }
  }, [uploadProgress])

  function readFile (file: File) {
	return new Promise<Uint8Array>((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e) => resolve(new Uint8Array(e.target?.result as any))
		fileReader.onerror = (e) => reject(e)
		fileReader.readAsArrayBuffer(file)
	})
  }

  const uploadFiles = async (currentWallet: any, file: File) => {
    const target = ""
    const amount = ""
    const data = await readFile(file)
    const fileHash = await getHash(data)
    
    const tags: any = []
    tags.push({name: "Content-Type", value: file.type})
    tags.push({name: "File-Hash", value: fileHash})
    tags.push({name: "File-Name", value: file.name})

    await sendAmount(currentWallet, target, amount, tags, data, file.name, setUploadProgress);

  };


  

  return (
    <Fragment>
        <Card>
        <CardHeader title='Send Coin Out' />
        <CardContent>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label='Address'
                        placeholder='Address'
                        value={inputAddress}
                        onChange={handleInputAddressChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputAddressError}
                        helperText={inputAddressError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type='number'
                        label='Amount'
                        placeholder='Amount'
                        value={inputAmount}
                        onChange={handleInputAmountChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:account-outline' />
                                </InputAdornment>
                            )
                        }}
                        error={!!inputAmountError}
                        helperText={inputAmountError}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label='Data'
                        placeholder='Leave a message to the payee'
                        sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                <Icon icon='mdi:message-outline' />
                                </InputAdornment>
                            )
                        }}                        
                        value={inputData}
                        onChange={handleInputDataChange}
                        error={!!inputDataError}
                        helperText={inputDataError}
                    />
                </Grid>

                <Grid item xs={12}>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                        <Img alt='Upload img' src='/images/misc/upload.png' />
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                            <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
                            <Typography color='textSecondary'>
                            Drop files here or click{' '}
                            <Link href='/' onClick={handleLinkClick}>
                                browse
                            </Link>{' '}
                            thorough your machine
                            </Typography>
                        </Box>
                        </Box>
                    </div>
                    {files.length ? (
                        <Fragment>
                        <List>{fileList}</List>
                        <div className='buttons'>
                            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>{removeAllButton}</Button>
                            <Button variant='contained' onClick={handleUploadAllFiles} disabled={isDisabledButton}>{uploadingButton}</Button>
                        </div>
                        </Fragment>
                    ) : null}
                </Grid>
                
                <Grid item xs={12} container justifyContent="flex-end">
                    <Button type='submit' variant='contained' size='large' onClick={handleSubmit} disabled={isDisabledButton} >
                        {uploadingButton}
                    </Button>
                </Grid>
            </Grid>
        </CardContent>
        </Card>
        
    </Fragment>
  )
}

/*
                
                */
export default FileUploaderMultiple
