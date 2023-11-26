import AddressTransactionListModel from 'src/views/model/addresses';

const AddressTransactionList = () => {

  const activeTab = "received"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

