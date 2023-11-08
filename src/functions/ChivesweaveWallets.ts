import { generateMnemonic, validateMnemonic } from 'bip39-web-crypto';
import { getKeyPairFromMnemonic } from 'human-crypto-keys'

import type { JWKInterface } from 'arweave/web/lib/wallet'

import { getDecryptionKey, getEncryptionKey, getSigningKey, getVerificationKey, pkcs8ToJwk } from 'src/functions/Crypto'

// @ts-ignore
import { v4, validate, version } from 'uuid'
import BigNumber from 'bignumber.js'

import Arweave from 'arweave'

var arweave = Arweave.init(urlToSettings("https://api.chivesweave.net:1986"))

const walletKeyPath = "Chiveswallets"

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
            const walletKeyPathList = window.localStorage.getItem(walletKeyPath)      
            const walletExists = walletKeyPathList ? JSON.parse(walletKeyPathList) : []
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
            window.localStorage.setItem(walletKeyPath, JSON.stringify(walletExists))

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

export function getWalletById(WalletId: number) {
    const walletKeyPathList = window.localStorage.getItem(walletKeyPath)
    const walletExists = walletKeyPathList ? JSON.parse(walletKeyPathList) : []
    const foundWallet = walletExists.find((wallet: any) => Number(wallet.id) === WalletId);
    return foundWallet
};

export function getWalletByUuid(Uuid: string) {
    const walletKeyPathList = window.localStorage.getItem(walletKeyPath)
    const walletExists = walletKeyPathList ? JSON.parse(walletKeyPathList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.uuid === Uuid);
    return foundWallet
};

export function getWalletByAddress(Address: string) {
    const walletKeyPathList = window.localStorage.getItem(walletKeyPath)
    const walletExists = walletKeyPathList ? JSON.parse(walletKeyPathList) : []
    const foundWallet = walletExists.find((wallet: any) => wallet.key === Address);
    return foundWallet
};

export function deleteWalletById(WalletId: number) {
    const walletKeyPathList = window.localStorage.getItem(walletKeyPath)
    const walletExists = walletKeyPathList ? JSON.parse(walletKeyPathList) : []
    const leftWallets = walletExists.filter((wallet: any) => Number(wallet.id) !== WalletId);
    window.localStorage.setItem(walletKeyPath, JSON.stringify(leftWallets))
    return true
};

export async function getWalletAddress(Address: string) {
    return arweave.ar.winstonToAr(await arweave.wallets.getBalance(Address))
}

export async function getPrice(byteSize: number) {
    return arweave.ar.winstonToAr(await arweave.transactions.getPrice(byteSize))
}

export async function sendAmount(walletData: any, target: string, amount: string) {
    const quantity = arweave.ar.arToWinston(new BigNumber(amount).toString())
    const tx = await arweave.createTransaction({ target, quantity })
    //Check Fee and Send Amount must smaller than wallet balance
    await arweave.transactions.sign(tx, walletData.jwk);
    const sendTxFee = await getPrice(Number(tx.data_size))
    //await arweave.transactions.getUploader(transaction);
    console.log('sendTxFee', sendTxFee);

    if (!tx.chunks?.chunks?.length) { 
		const txResult = await arweave.transactions.post(tx);
		if(txResult.status==200) {
			console.log('Transaction sent', txResult);
		}
		else if(txResult.status==400) {
			console.error(txResult.statusText, txResult); 
		}
		else {			
			console.log('Unknow error', txResult);
		}
		return 
	}

    //Upload Data if have Chunks
    const ArweaveStore: any = {}
    const uploader = await arweave.transactions.getUploader(tx)
	const storageKey = 'uploader:' + tx.id
	localStorage.setItem(storageKey, JSON.stringify(uploader))
	ArweaveStore.uploads[tx.id] ??= {}
	ArweaveStore.uploads[tx.id].upload = 0
	while (!uploader.isComplete) {
		let uploadChunkResult = await uploader.uploadChunk()
		console.log("uploadChunkResult______",uploadChunkResult)
		localStorage.setItem(storageKey, JSON.stringify(uploader))
		ArweaveStore.uploads[tx.id].upload = uploader.pctComplete
	}
	if(uploader.isComplete) {
		localStorage.removeItem(storageKey)
		setTimeout(() => delete ArweaveStore.uploads[tx.id], 1000)
		console.log('Transaction sent', tx)
		return uploader.lastResponseStatus
	}
	else {
		console.error('Transaction error', tx)
		return tx
	}
}

