import AddressTransactionListModel from 'src/pages/addresses/model';

const AddressTransactionList = () => {

  const activeTab = "received"; 

  return <AddressTransactionListModel activeTab={activeTab} />

}

export default AddressTransactionList

