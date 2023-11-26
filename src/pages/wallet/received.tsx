import MyWalletModel from 'src/views/model/wallet';

const AddressTransactionList = () => {

  const activeTab = "received"; 

  return <MyWalletModel activeTab={activeTab} />

}

export default AddressTransactionList

