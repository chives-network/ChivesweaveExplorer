import AddressTransactionListModel from 'src/views/model/addresses';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

