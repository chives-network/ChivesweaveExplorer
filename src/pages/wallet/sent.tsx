import MyWalletModel from 'src/views/model/wallet';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <MyWalletModel activeTab={activeTab} />

}

export default AddressTransactionList

