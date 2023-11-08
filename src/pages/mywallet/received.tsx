import AddressTransactionListModel from 'src/pages/mywallet/model';

const AddressTransactionList = () => {

  const activeTab = "received"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

