// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsBlockList from 'src/views/dashboards/analytics/AnalyticsBlockList'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsLine from 'src/views/dashboards/analytics/AnalyticsLine'
import AnalyticsTransactionList from 'src/views/dashboards/analytics/AnalyticsTransactionList'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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

const AnalyticsDashboard = () => {

  const [chainInfo, setChainInfo] = useState<ChainInfoType>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [dataX, setDataX] = useState<string[]>([])
  const [dataWeaveSize, setDataWeaveSize] = useState<number[]>([])
  const [difficulty, setDifficulty] = useState<number[]>([])
  
  const [blocksnumber, setblocksnumber] = useState<number[]>([])
  const [Block_Rewards, setBlock_Rewards] = useState<number[]>([])

  const [blockList, setBlockList] = useState<number[]>([])
  const [transactionList, setTransactionList] = useState<number[]>([])

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/statistics_network', { headers: { }, params: { } })
    .then(res => {
      setIsLoading(false);
      const dataX: any[] = [];
      const dataWeaveSize: any[] = [];
      const difficulty: any[] = [];
      const endowment: any[] = [];
      res.data.map((Item: {[key:string]:any}) => {
        dataX.push(Item.Date.substring(5));
        dataWeaveSize.push((Item.Weave_Size/(1024*1024*1024*1024)).toFixed(1))
        difficulty.push((Item.Difficulty/(1024*1024*1024)).toFixed(1))
        endowment.push(Math.floor(Item.Cumulative_Endowment/1000000000000))
      })
      setDataX(dataX.slice(1).slice().reverse().slice(1).slice(-21))
      setDataWeaveSize(dataWeaveSize.slice(1).slice().reverse().slice(1).slice(-21))
      setDifficulty(difficulty.slice(1).slice().reverse().slice(1).slice(-21))
      console.log("isLoading", isLoading)

      //setEndowment(endowment.slice(1).slice().reverse().slice(1).slice(-21))
    })

    axios.get(authConfig.backEndApi + '/statistics_block', { headers: { }, params: { } })
    .then(res => {
      setIsLoading(false);
      const blocksnumber: any[] = [];
      const Block_Rewards: any[] = [];
      res.data.map((Item: {[key:string]:any}) => {
        blocksnumber.push(Item.Blocks)
        Block_Rewards.push(Math.floor(Item.Block_Rewards/1000000000000))
      })
      setblocksnumber(blocksnumber.slice(1).slice().reverse().slice(1).slice(-21))
      setBlock_Rewards(Block_Rewards.slice(1).slice().reverse().slice(1).slice(-21))
    })

    //Block List 
    axios.get(authConfig.backEndApi + '/blockpage/1/6', { headers: { }, params: { } })
    .then(res => {
      setBlockList(res.data.data)
    })

    //Transaction List 
    axios.get(authConfig.backEndApi + '/transaction/0/6', { headers: { }, params: { } })
    .then(res => {
      setTransactionList(res.data.data)
    })

    //Chain Info
    axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
        .then(res => {
          setChainInfo(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          {chainInfo ?
            <AnalyticsTrophy data={chainInfo}/>
          :
            <Fragment></Fragment>
          }          
        </Grid>
        <Grid item xs={12} md={8}>          
          {chainInfo ?
            <AnalyticsTransactionsCard data={chainInfo}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        <Grid item xs={12} md={4}>
          <AnalyticsTransactionList data={transactionList}/>
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          {blockList && blockList.length > 0 ?
            <AnalyticsBlockList data={blockList}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={blocksnumber} title={"Blocks Number Per Day"} bottomText={""}/>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={Block_Rewards} title={"Block Rewards Per Day"} bottomText={""}/>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={dataWeaveSize} title={"Weave Size"} bottomText={""}/>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <AnalyticsLine dataX={dataX} dataY={difficulty} title={"Difficulty"} bottomText={""}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
