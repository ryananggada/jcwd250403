// import axios from "axios";
// import "./App.css";
// import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CreateCategory from './pages/CreateCategory';
import EditCategory from './pages/EditCategory';
import NotFound from './pages/NotFound';

function App() {
  /*
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  */

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/create" element={<CreateCategory />} />
      <Route path="/categories/edit/:id" element={<EditCategory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
