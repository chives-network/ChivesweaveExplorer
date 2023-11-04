import AddressTransactionListModel from 'src/pages/addresses/model';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

