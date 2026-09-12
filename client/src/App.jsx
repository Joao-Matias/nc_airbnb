import './App.css';
import { Route, Routes } from 'react-router';
import Home from './components/home';
import SingleProperty from './components/singleProperty';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://nc-airbnb-jm.onrender.com/api/users/2`).then(({ data }) => {
      setActiveUser(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <p>loading...</p>;

  return (
    <Routes>
      <Route path='/properties/:id' element={<SingleProperty activeUser={activeUser} />} />
      <Route path='/*' element={<Home activeUser={activeUser} />} />
    </Routes>
  );
}

export default App;
