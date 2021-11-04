import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  

  useEffect(() => {
    axios.get(URL + 'index.php')
    .then((response) => {
      setItems(response.data)
    }).catch(error => {
      alert(error)
    })
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item, amount:amount})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setItem('');
      setAmount('');
    }).catch (error => {
      alert(error.response.data.error)
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
  }

  function setEditedItem(item) {
    setEditItem(item);
    setEditDescription(item?.description);
    setEditAmount(item?.amount);
  }

  function update(e) {
    e.preventDefault();
    const json = JSON.stringify({id:editItem.id, description:editDescription, amount:editAmount})
    axios.post(URL + 'update.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      items[(items.findIndex(item => item.id === editItem.id))].description = editDescription;
      items[(items.findIndex(item => item.id === editItem.id))].amount = editAmount;
      setItems([...items]);
      setEditedItem(null);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save} className="saveform">
        <label>New item</label>
        <input value={item} placeholder="type description" onChange={e => setItem(e.target.value)} />
        <input value={amount} placeholder="type amount" onChange={e => setAmount(e.target.value)} />
        <button className="savebutton">Save</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <span className="description">{editItem?.id !== item.id &&
            item.description 
            }</span>
            <span className="amount">{editItem?.id !== item.id &&
            item.amount
            }</span>
            {editItem?.id === item.id &&
            <form onSubmit={update}>
              <input value={editDescription} onChange={e => setEditDescription(e.target.value)}></input>
              <input value={editAmount} onChange={e => setEditAmount(e.target.value)}></input>

              <button>Save</button>
              <button type="button" onClick={() => setEditedItem(null)}>Cancel</button>
              </form>
              
            }
              <button href="#" className="delete" onClick={() => remove(item.id)}>
                Delete
                </button> &nbsp;
                {editItem === null &&
                <button className="edit" onClick={() => setEditedItem(item)} href="#">
                  Edit
                  </button>
            } </li>
        ))}
      </ol>
    </div>
  );
}

export default App;