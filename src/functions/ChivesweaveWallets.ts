import { generateMnemonic, validateMnemonic } from 'bip39-web-crypto';
import { getKeyPairFromMnemonic } from 'human-crypto-keys'

import { pkcs8ToJwk } from 'src/functions/Crypto'

import { PromisePool } from '@supercharge/promise-pool'

import type { JWKInterface } from 'arweave/web/lib/wallet'

// @ts-ignore
import { v4 } from 'uuid'
import BigNumber from 'bignumber.js'

import Arweave from 'arweave'

// ** Third Party Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

const arweave = Arweave.init(urlToSettings(authConfig.backEndApi))

const chivesWallets = authConfig.chivesWallets
const chivesCurrentWallet = authConfig.chivesCurrentWallet

export async function generateNewMnemonicAndGetWalletData (mnemonic: string) {
    try {
        let newMnemonic = mnemonic
        if(newMnemonic == undefined || newMnemonic == "")  {
            newMnemonic = await generateMnemonic();
        }
        const isValidMnemonic = await validateMnemonic(newMnemonic);
        if(isValidMnemonic) {
            console.log("validateMnemonic:", newMnemonic)
            const mnemonicToJwkValue = await mnemonicToJwk(newMnemonic)
            console.log("mnemonicToJwkValue:", mnemonicToJwkValue)
            
            //Get Wallet Data From LocalStorage
            const chivesWalletsList = window.localStorage.getItem(chivesWallets)      
            const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
            
            //Get Wallet Max Id
            let walletId = 0
            while (walletExists.find((w: any) => +w.id === walletId)) { walletId++ }
            
            //Make walletData
            const walletData: any = {...mnemonicToJwkValue}
            walletData.id ??= walletId
            walletData.uuid ??= v4() as string
            walletData.settings ??= {}
            walletData.state ??= {"hot": true}
            
            //Make Addresss From Jwk
            const key = await arweave.wallets.jwkToAddress(walletData.jwk as any)
            const publicKey = walletData.jwk.n
            walletData.data ??= {}
            walletData.data.arweave = { key, publicKey }            
            console.log("walletData:", walletData)
            
            //Write New Wallet Data to LocalStorage
            walletExists.push(walletData)
            window.localStorage.setItem(chivesWallets, JSON.stringify(walletExists))

            //const addFileToJwkValue = await addFileToJwk('')
            //console.log("addImportDataValue:", addImportDataValue)

            return walletData
        }
        else {
            
            //Error Mnemonic
            return null;
        }
    } catch (error) {
        console.log('Error generateNewMnemonicAndGetJwk:', error);
    }
};

export async function checkMnemonicValidity (newMnemonic: string) {
    try {
        return await validateMnemonic(newMnemonic);
    } catch (error) {
      console.error('Error checkMnemonicValidity:', error);
    }
};

export async function mnemonicToJwk (mnemonic: string) {
    try {
      console.log('make keyPair waiting ......................', mnemonic);
      const keyPair = await getKeyPairFromMnemonic(mnemonic, { id: 'rsa', modulusLength: 4096 }, { privateKeyFormat: 'pkcs8-der' })
      console.log("keyPair.privateKey", keyPair.privateKey)
      const jwk = await pkcs8ToJwk(keyPair.privateKey) as JWKInterface
      console.log("jwk...............", jwk)
      
      return { jwk }
    } catch (error) {
      console.log('Error mnemonicToJwk:', error);
    }
};

export async function addFileToJwk (keyfile: string) {
    try {
        const data = keyfile != null && keyfile != '' && JSON.parse(keyfile) as JWKInterface
		const jwk = data || await arweave.wallets.generate()
		
        return { jwk }
    } catch (error) {
      console.log('Error mnemonicToJwk:', error);
    }
};

export function urlToSettings (url: string) {
    const obj = new URL(url)
    const protocol = obj.protocol.replace(':', '')
    const host = obj.hostname
    const port = obj.port ? parseInt(obj.port) : protocol === 'https' ? 443 : 80
    
    return { protocol, host, port }
};


export function getAllWallets() {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    
    return walletExists
};

export function getCurrentWalletAddress() {
    const CurrentWalletAddress = window.localStorage.getItem(chivesCurrentWallet)

    return String(CurrentWalletAddress)
};

export function getCurrentWallet() {
    const CurrentWalletAddress = window.localStorage.getItem(chivesCurrentWallet)

    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    let foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === CurrentWalletAddress);
    
    if(foundWallet == undefined && walletExists && walletExists[0] && walletExists[0].data && walletExists[0].data.arweave && walletExists[0].data.arweave.key) {
        foundWallet = walletExists[0]
        window.localStorage.setItem(chivesCurrentWallet, walletExists[0].data.arweave.key)
    }

    return foundWallet
};

export function setCurrentWallet(Address: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
    
    if(foundWallet && foundWallet.data && foundWallet.data.arweave && foundWallet.data.arweave.key) {
        window.localStorage.setItem(chivesCurrentWallet, Address)
    }

    return true
};

export function getWalletById(WalletId: number) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => Number(wallet.id) === WalletId);
    
    return foundWallet
};

export function getWalletByUuid(Uuid: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.uuid === Uuid);
    
    return foundWallet
};

export function getWalletByAddress(Address: string) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.data.arweave.key === Address);
    
    return foundWallet
};

export function deleteWalletById(WalletId: number) {
    const chivesWalletsList = window.localStorage.getItem(chivesWallets)
    const walletExists = chivesWalletsList ? JSON.parse(chivesWalletsList) : []
    const leftWallets = walletExists.filter((wallet: any) => Number(wallet.id) !== WalletId);
    window.localStorage.setItem(chivesWallets, JSON.stringify(leftWallets))
    
    return true
};

export async function getWalletAddress(Address: string) {
    
    return arweave.ar.winstonToAr(await arweave.wallets.getBalance(Address))
}

export async function getWalletAddressWinston(Address: string) {
    
    return await arweave.wallets.getBalance(Address)
}

export async function getPrice(byteSize: number) {
    
    return arweave.ar.winstonToAr(await arweave.transactions.getPrice(byteSize))
}


export async function getPriceWinston(byteSize: number) {
    
    return await arweave.transactions.getPrice(byteSize)
}

export function winstonToAr(winston: string) {
    
    return arweave.ar.winstonToAr(winston)
}

export function arToWinston(ar: string) {
    
    return arweave.ar.arToWinston(ar)
}

export function isAddress(address: string) {
    return !!address?.match(/^[a-z0-9_-]{43}$/i)
}


export async function sendAmount(walletData: any, target: string, amount: string, tags: any, data: string | Uint8Array | ArrayBuffer | undefined, fileName: string, setUploadProgress: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>) {
    const quantity = amount && amount.length > 0 && amount != "" ? arweave.ar.arToWinston(new BigNumber(amount).toString()) : '0' ;

    //Check Fee and Send Amount must smaller than wallet balance

    const txSettings:any = {}
    if(target && target.length == 43 && Number(quantity) > 0) {
	    txSettings.target = target
        txSettings.quantity = quantity
    }
	if (data && data != undefined && data != '') { txSettings.data = data }

    //Make Tx Data
    const tx = await arweave.createTransaction(txSettings)
    
    //Add Tags
    for (const tag of tags || []) { tx.addTag(tag.name, tag.value) }
    
    await arweave.transactions.sign(tx, walletData.jwk);
    const currentFee = await getPriceWinston(Number(tx.data_size))
    const currentBalance = await getWalletAddressWinston(walletData.data.arweave.key)

    if(Number(currentBalance) < (Number(currentFee) + Number(quantity)) )       {

        return { status: 800, statusText: 'Insufficient balance, need: ' + winstonToAr(String(Number(currentFee) + Number(quantity))) }
    }
    
    //console.log('currentBalance', currentBalance);
    //console.log('currentFee', currentFee);
    //console.log('quantity', Number(quantity));

    if (!tx.chunks?.chunks?.length) { 
		const txResult = await arweave.transactions.post(tx);
		if(txResult.status==200) {
			console.log('Transaction sent', txResult);
            
            //Update the upload process
            fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
                
                return {
                ...prevProgress,
                [fileName]: 100,
                };
            });
		}
		else if(txResult.status==400) {
			console.error(txResult.statusText, txResult); 
		}
		else {			
			console.log('Unknow error', txResult);
		}

		return txResult; 
	}

    //Upload Data if have Chunks
    const UploadChunksStatus: any = {}
    const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	UploadChunksStatus[tx.id] ??= {}
	UploadChunksStatus[tx.id].upload = 0
    console.log('Begin upload data txid', tx.id)
    
    //console.log('uploader begin: ', uploader)
    let uploadRecords = 0
	while (!uploader.isComplete) {
		await uploader.uploadChunk()
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		UploadChunksStatus[tx.id].upload = uploader.pctComplete
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
		
        //console.log("uploader processing: ",uploadRecords, uploader.pctComplete)
        uploadRecords = uploadRecords + 1
	}
	if(uploader.isComplete) {
		localStorage.removeItem(storageKey)
		setTimeout(() => delete UploadChunksStatus[tx.id], 1000)
		console.log('Transaction sent: ', tx)
        
        //Update the upload process
        fileName && fileName.length > 0 && setUploadProgress((prevProgress) => {
            
            return {
            ...prevProgress,
            [fileName]: uploader.pctComplete,
            };
        });
	}
	else {
		console.error('Transaction error', tx)
	}

    //console.log('uploader end: ', uploader)
    //console.log('UploadChunksStatus: ', UploadChunksStatus)

    return tx; 
}

export function encode (text: string) {
	const encoder = new TextEncoder()
	
    return encoder.encode(text)
}

export function decode (buffer: BufferSource) {
	const decoder = new TextDecoder()
	
    return decoder.decode(buffer)
}

export async function getHash (data: string | Uint8Array) {
	const content = typeof data === 'string' ? encode(data) : data
	const buffer = await window.crypto.subtle.digest('SHA-256', content)
	
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('')
}

export async function getProcessedData(walletData: any, walletAddress: string, data: any): Promise<ArTxParams['data']> {
	if (typeof data === 'string') { return data }
    console.log("getProcessedData Input File Data:", data)
	if (data.length > 1) {
		if (!walletData) { throw 'multiple files unsupported for current account' }
		if (walletData && walletData.jwk) {
			const bundleItems: any[] = []
			const dataItems = await Promise.all(data.map((item: any) => createDataItem(walletData, item)))
			const trustedAddresses = walletAddress ? [walletAddress] : []
			const deduplicated = await deduplicate(dataItems, trustedAddresses)
			const deduplicatedDataItems = dataItems.map((item, i) => deduplicated[i] || item)
			bundleItems.push(...deduplicatedDataItems.filter((item): item is Exclude<typeof item, string> => typeof item !== 'string'))
			try {
				const paths = data.map((item: any) => item.path || '')
				const index = paths.find((path: any) => path === 'index.html')
				const manifest = generateManifest(paths, deduplicatedDataItems, index)
				bundleItems.push(await createDataItem(walletData, { ...manifest }))
			} catch (e) { console.warn('manifest generation failed') }
			
            return (await createBundle(walletData, bundleItems)).getRaw()
		}
		else { throw 'multiple files unsupported for '}
	}

	return data[0].data
}


//Check File Hash from mainnet, if file have exist on mainnet, should not upload
async function deduplicate (transactions: ArDataItemParams[], trustedAddresses?: string[]): Promise<Array<string | undefined>> {
	const entries = (await PromisePool.for(transactions).withConcurrency(5).process(async tx =>
		({ tx, hash: tx.tags?.find(tag => tag.name === 'File-Hash')?.value || await getHash(tx.data) }))).results
	const chunks = [] as typeof entries[]
	while (entries.length) { chunks.push(entries.splice(0, 500)) }
	
    return (await PromisePool.for(chunks).withConcurrency(3).process(async chunk => {
        const checkResultOnMainnet: any[] = await axios.get(authConfig.backEndApi + '/statistics_network', { headers: { }, params: { } })
                                .then(() => {
                                        
                                        //console.log("deduplicate in lib", res.data)
                                        
                                        return []
                                    }
                                )

		return (await PromisePool.for(chunk).withConcurrency(3).process(async entry => {
            const result = checkResultOnMainnet
				.filter((tx: any) => tx.tags.find((tag: any) => tag.name === 'File-Hash' && tag.value === entry.hash))
				.filter((tx: any) => !entry.tx.tags || hasMatchingTags(entry.tx.tags, tx.tags))
			for (const tx of result) {
				const verified = trustedAddresses ? trustedAddresses.includes(tx.owner.address) : await verifyData(entry.hash, tx.id)
				if (verified) { return tx }
			}
		})).results
	})).results.flat().map(tx => tx?.node.id)
}


export function hasMatchingTags(requiredTags: { name: string; value: string }[], existingTags: { name: string; value: string }[]): boolean {
	
    return !requiredTags.find(requiredTag => !existingTags.find(existingTag =>
		existingTag.name === requiredTag.name && existingTag.value === requiredTag.value))
}

async function verifyData (hash: string, id: string) {
    console.log("verifyData", hash, id)
} // todo store verification results in cache

export async function getSize (data: any, processedData: any): Promise<number> {
	if (typeof data === 'string') { return data.length }
	const processed = processedData
	if (processed == undefined) { throw 'Error' }
	if (typeof processed === 'string') { return data.length }
	
    return ArrayBuffer.isView(processed) ? processed?.byteLength : new Uint8Array(processed).byteLength
}

export function generateManifest (localPaths: string[], transactions: Array<{ id: string } | string>, index?: string) {
	if (localPaths.length !== transactions.length) { throw 'Length mismatch' }
	if (index && !localPaths.includes(index)) { throw 'Unknown index' }
	const paths = {} as { [key: string]: { id: string } }
	localPaths.forEach((path, i) => {
		if (!path) { throw 'Path undefined' }
		const tx = transactions[i]
		const id = typeof tx === 'string' ? tx : tx.id
		paths[path] = { id }
	})
	const indexParam = index ? { index: { path: index } } : {}
	
    return {
		data: JSON.stringify({
			manifest: 'chivesweave/paths',
			version: '0.1.0',
			...indexParam,
			paths,
		}),
		tags: [{ name: 'Content-Type', value: 'application/x.chivesweave-manifest+json' }]
	}
}


// ############################################################################################################################################

async function createDataItem (walletData: any, item: ArDataItemParams) {
    // @ts-ignore
    const { createData, signers } = await import('../../scripts/arbundles')
    const { data, tags, target } = item
    const signer = new signers.ArweaveSigner(walletData.jwk)
    const anchor = arweave.utils.bufferTob64(crypto.getRandomValues(new Uint8Array(32))).slice(0, 32)
    const dataItem = createData(data, signer, { tags, target, anchor })
    await dataItem.sign(signer)
    
    return dataItem
}

async function createBundle (walletData: any, items: Awaited<ReturnType<typeof createDataItem>>[]) {
    // @ts-ignore
    const { bundleAndSignData, signers } = await import('../../scripts/arbundles')
    const signer = new signers.ArweaveSigner(walletData.jwk)
    
    return bundleAndSignData(items, signer)
}
