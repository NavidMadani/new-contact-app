import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

function App() {
  const cookies = new Cookies();

  const [contacts, setContacts] = useState([]);
  const [contactNames, setContactNames] = useState([]);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let [once, setOnce] = useState(0)
  var results = ""

  function addContactPage(){
    setShowForm(!showForm);
  }

  function addContact(e){
    e.preventDefault();
    if (name && number){
      let ranId = 1 + Math.random()
      let newArrContacts = contacts.concat({ name, number, ranId})
      let newArrContactNames = contactNames.concat(name)
      let newArrContactNumbers = contactNames.concat(number)
      setContacts(newArrContacts);
      setContactNames(newArrContactNames)
      setContactNumbers(newArrContactNumbers)
    }
    setName("");
    setNumber("");
    setIndex(index + 1)
    setShowForm(false)
    cookies.set('list', JSON.stringify(contacts), { path: '/' });
  }

  function handleChange(e){
    e.preventDefault();
    setSearchTerm(e.target.value);
    setShowSearch(true);
  }

  function deleteItem(id){
    const newList = contacts.filter(person => person.ranId !== id);
    setContacts(newList);
    cookies.set('list', JSON.stringify(contacts), { path: '/' });
  }

  function editContact(e, id){
    e.preventDefault();
    const list = contacts
    const index = list.findIndex(obj => obj.ranId === id);
    list[index].name = newName;
    list[index].number = newNumber;
    setContacts(list)
    setShowEdit(false)
    cookies.set('list', JSON.stringify(contacts), { path: '/' });
    return false
  }

  function initCookies(list, once) {
      if (once !== 1) {
        setContacts(list)
        setOnce(1)
		}
  }

  useEffect(() =>{
    if(typeof searchTerm === "string"){
      results = contactNames.filter(contact =>
        contact.toString().toLowerCase().includes(searchTerm)
      );
    }
    if(typeof searchTerm === "integer"){
      results = contactNumbers.filter(contact =>
        contact.toString().toLowerCase().includes(searchTerm)
      );
    }
    setSearchResults(results);
    
    let list = cookies.get('list')
		if (list) {
      initCookies(list, once)
		}
  }, [searchTerm]);

  return (
    <div className="App">
      <h1 style={{color: "white"}}>Contacts</h1>
      <input 
        className="search-bar"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <div className="search-list">
        {showSearch && searchResults.slice(0, 4).map(item => (
          <li>{item}</li>
        ))}
      </div>
      <button className="add" onClick={addContactPage}>Add Contact + </button>
      {showForm && (
        <form className= "add-contact-form" onSubmit={addContact}>
        <input
          className="text-box"
          id="name-textbox"
          type="text"
          name="Nameedit"
          className="input"
          value={name}
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />
        <input
          className="text-box"
          id="number-textbox"
          type="number"
          name="Phone Number"
          className="input"
          value={number}
          placeholder="Number"
          onChange={e => setNumber(e.target.value)}
        />
        <button className="add" type="submit">submit</button>
        </form>
      )}

      <div>
            {contacts.map((person) => 
              <li className="contact-list" key={person.ranId}>
                <p>{person.name} - {person.number}</p>
              <button className="edit" onClick={() => setShowEdit(!showEdit)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteItem(person.ranId)}>
                Delete
              </button>
              {showEdit && (
                <form className= "add-contact-form" onSubmit={(e) => editContact(e, person.ranId)}>
                  <input
                    className="text-box"
                    id="edit-name-textbox"
                    type="text"
                    name="Name"
                    className="input"
                    value={newName}
                    placeholder="Type Name Here"
                    onChange={e => setNewName(e.target.value)}
                  />
                  <input
                    className="text-box"
                    id="edit-number-textbox"
                    type="number"
                    name="Phone Number"
                    className="input"
                    value={newNumber}
                    placeholder="Type Number Here"
                    onChange={e => setNewNumber(e.target.value)}
                  />
                  <button  className="add" type="submit">submit</button>
                </form>
              )}
            </li>
            )}
      </div>
    </div>
  );
}

export default App;
