import AddressTransactionListModel from 'src/pages/mywallet/model';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

