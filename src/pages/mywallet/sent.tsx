import MyWalletModel from 'src/pages/mywallet/model';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <MyWalletModel activeTab={activeTab} />

}

export default AddressTransactionList

