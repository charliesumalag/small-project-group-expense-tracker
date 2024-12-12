import React, { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [member,setMember] = useState([])
  const [expensesValues, setExpenseValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveExpenseModalOpen, setIsRemoveExpenseModalOpen] = useState(false)
  const [inputMember, setInputMember] = useState('')
  const browserKeyName = 'MyTemporaryStorage';
  const expensesValueStorage = 'expensesValues';

  const handleAddMem = (mem) => {
    if (mem === '') return;
    if (member.includes(mem)) {
      return;
    }
    setMember((prevState) => [...prevState, mem]);
  }

  const handleRemoveMember = (inputMember) => {
    setMember((prevState) => {
      const updatedValues = prevState.filter((mem) => mem !== inputMember);
      localStorage.setItem(browserKeyName, JSON.stringify(updatedValues))
      return updatedValues;
    })
    setExpenseValues((prevState) => {
      const updatedExpenses = prevState.filter((expense) => expense.whos !== inputMember);
      localStorage.setItem(expensesValueStorage, JSON.stringify(updatedExpenses));  // Save to localStorage
      return updatedExpenses;
    });
    setInputMember('');

  };

  const handleExpense = (values) => {
    setExpenseValues((prev => [...prev, values]))
  }

  const handleRemoveExpense = (id) => {
    setExpenseValues((prevValues) => {
      const updatedValues = prevValues.filter((prevValue) => prevValue.id !== id);
      localStorage.setItem(expensesValueStorage, JSON.stringify(updatedValues));
      return updatedValues;

    })
  }

  // SAVING MEMBER RUN WHEN THE MEMBER STATE UPDATED
  useEffect(() => {
    if (member.length > 0) {
      localStorage.setItem(browserKeyName, JSON.stringify(member))
    }
  }, [member]);

  // SAVING EXPENSES RUN WHEN THE EXPENSES STATE UPDATED
  useEffect(() => {
    if (expensesValues.length > 0) {
      localStorage.setItem(expensesValueStorage, JSON.stringify(expensesValues));
    }
  }, [expensesValues]);

  // READING LOCAL STORAGE
  useEffect(() => {
    const savedMember = localStorage.getItem(browserKeyName);
    if (savedMember) {
      setMember(JSON.parse(savedMember));
    }
  },[])

  useEffect(() => {
    const savedExpensesValues = localStorage.getItem(expensesValueStorage);
    if (savedExpensesValues) {
      setExpenseValues(JSON.parse(savedExpensesValues));
    }
  }, [])

  return (
    <div className='app'>
      <div className={isModalOpen || isRemoveExpenseModalOpen  ? 'hide' : 'content'}>
        <Header></Header>
        <AddMember handleAddMem={handleAddMem} members={member} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}></AddMember>
        <AddExpense members={member} handleExpense={handleExpense} isModalOpen={isModalOpen} setIsRemoveExpenseModalOpen={setIsRemoveExpenseModalOpen} expensesValues={expensesValues}/>
        {expensesValues.length >= 1  &&  <Summary expensesValues={expensesValues} members={member}/>}
        <Footer isModalOpen={isModalOpen} />
      </div>
      {isModalOpen && <RemoveMember setIsModalOpen={setIsModalOpen} inputMember={inputMember} setInputMember={setInputMember} members={member} handleRemoveMember={handleRemoveMember}  />}
      {isRemoveExpenseModalOpen && <RemoveExpense expensesValues={expensesValues} setIsRemoveExpenseModalOpen={setIsRemoveExpenseModalOpen} handleRemoveExpense={handleRemoveExpense} />}
    </div>
  )
}
// {expensesValues, members}

export default App


// COMPONENTS
const Button = ({children}) => {
  return(
    <button className='btn'>{children}</button>
  )
}

const Header = () => {
  return (
    <div className='header-container'>
      <h1 className='header-text'><i className="fa-solid fa-people-group"></i> Group Expense Tracker</h1>
    </div>
  )
}

const AddMember = ({handleAddMem, setIsModalOpen, members}) => {
  const [name, setName] = useState('');
  const handleAddMember = (e) => {
    e.preventDefault();
    handleAddMem(name)
    setName('')
  }

  return (
    <div className='form-container'>
      <form className='form add-member-form'>
        <label className="title"><i className="fa-solid fa-image-portrait wide"></i> Member</label>
        <input type="text" placeholder='Enter member name' value={name} onChange={(e) => setName(e.target.value)} />
        <div className='btn-container'>
          <button className='btn' onClick={handleAddMember}>Add Member</button>
          <button className='btn' onClick={(e) => {
             e.preventDefault();
             if (members.length > 0) {
              setIsModalOpen(true);
             } else return;
            }}>Remove Member
          </button>
        </div>
      </form>

    </div>
  )
}

const RemoveMember = ({setIsModalOpen, members,handleRemoveMember, inputMember, setInputMember}) => {

  useEffect(() => {
    if (members.length < 1) {
      setIsModalOpen(false);
    }
  }, [members, setIsModalOpen]);

  return (
    <div className='remove-member-form'>
      <label className="title"><i className="fa-solid fa-image-portrait wide"></i> Member List</label>
      <table className="styled-table">
        <tbody>
          {members.map((member, index) => (
          <tr key={index}>
            <td>{member}</td>
          </tr>
          ))}
        </tbody>
      </table>
      <input type="text" placeholder='Enter name to remove' className='input-rmv' value={inputMember} onChange={e => setInputMember(e.target.value)}/>
      <div className="btn-container">
        <button className='btn' onClick={() => handleRemoveMember(inputMember)}>Remove</button>
        <button className='btn' onClick={(e) =>
          {
            e.preventDefault();
            setIsModalOpen(false)
          }
        }>Back</button>
      </div>
    </div>
  )
}


const AddExpense = ({members,handleExpense, setIsRemoveExpenseModalOpen, expensesValues}) => {
    const [whos, setWhos] = useState('');
    const [expensesDescription, setExpensesDescription] = useState('');
    const [expensesAmount, setExpensesAmount] = useState('');
    const id = Math.random().toString(36).substring(2, 9);

    const handleExpenseValues = (e) => {
        e.preventDefault();
        const values = {id,
            whos, expensesDescription, expensesAmount
        }
        if (whos === '') {
          return;
        }
        handleExpense(values);
        setWhos('');
        setExpensesDescription('')
        setExpensesAmount('')
    }

  return (
    <form className="form add-expense-container">
      <label className="title"><i className="fa-solid fa-wallet"></i>  Expenses</label>
      <input type="text" value={expensesDescription} placeholder='Expense description' onChange={e => setExpensesDescription(e.target.value)}/>
      <input type="text" value={expensesAmount} placeholder='Expense amount' onChange={e => setExpensesAmount(Number(e.target.value))} />
      <select value={whos} onChange={e => setWhos(e.target.value)}>
        <option value=''>Select Member</option>
      {members.map((member, index) => <option key={index} value={member}>{member}</option>)}
      </select>
      <div className='btn-container'>
      <button className='btn' onClick={handleExpenseValues}>Add Expenses</button>
      <button className='btn' onClick={(e) => {
            e.preventDefault();
            if (expensesValues.length > 0) {
              setIsRemoveExpenseModalOpen(true);
            } else return;

            }}>Remove Expenses</button>
      </div>
    </form>
  )
}

const RemoveExpense = ({expensesValues, setIsRemoveExpenseModalOpen, handleRemoveExpense}) => {
  useEffect(() => {
    if (expensesValues.length < 1) {
      setIsRemoveExpenseModalOpen(false);
    }
  }, [expensesValues, setIsRemoveExpenseModalOpen])


  return (
    <>
      {expensesValues.length > 0 && <div className='remove-expense-form'>
        <label className="title"><i className="fa-solid fa-image-portrait wide"></i> Expenses List <span onClick={(e) =>
            {
              e.preventDefault();
              setIsRemoveExpenseModalOpen(false)
            }
          }>Close</span></label>
        <table className="styled-table">
          <thead>
            <th>Name</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Action</th>
          </thead>
          <tbody>
            {expensesValues.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.whos}</td>
              <td>{expense.expensesDescription}</td>
              <td>{expense.expensesAmount}</td>
              <td>
                <span onClick={() => handleRemoveExpense(expense.id)}>
                  <i className="fa-solid fa-trash remove-icon"></i>
                </span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </>
  )
}

const Summary = ({expensesValues, members}) => {
    const totalAmount = expensesValues.reduce((sum, expense) => sum + expense.expensesAmount,0);
    const perPerson = totalAmount / members.length;
    const memberExpenses = members.map((member) => {
      let totalPaid = expensesValues.filter((expense) => expense.whos === member).reduce((sum, expenses) => sum + expenses.expensesAmount, 0);
      const owes = totalPaid - perPerson;
      return { member, totalPaid, owes };
    })
  return (
    <div className='summary-container'>
      <ul className="title"> Expenses :
          {expensesValues.map((values, index) => <li key={index} className='list'>{values.expensesDescription} : PHP {values.expensesAmount} (Paid by: {values.whos})</li>)}
      </ul>

      <ul>
      <p className='title'>  Who owes what?: </p>
        {memberExpenses.map((item, index) => (
          <li key={index}>
            {item.member}: Paid PHP {item.totalPaid} {item.owes > 0 ? `Owes: PHP ${item.owes.toFixed(2)}` : `Owed: PHP ${Math.abs(item.owes.toFixed(2))}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

const Footer = () => {
  return (
    <footer>© 2024 Charlie Sumalag. All Rights Reserved.</footer>
  )
}
