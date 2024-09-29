import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddFunds from './pages/Addfunds';
import Withdraw from './pages/Withdraw';
import SendMoney from './pages/SendMoney';
import Transactions from './pages/Transactions';

function App() {

  return (
    <Router>
      <Routes>

        {/* //default */}
        <Route path='/' element={<Login/>}/>
        
       <Route path='/dashboard' element={<Dashboard/>}/>
       
       <Route path='/signup' element={<Signup/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/add-funds' element={<AddFunds />} />
       <Route path='withdraw' element={<Withdraw/>}/>
       <Route path='send' element={<SendMoney/>}/>
       <Route path='transactions' element={<Transactions/>}/>
      </Routes>
    </Router>
  )
}

export default App
