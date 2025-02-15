import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Login from './pages/Login';
import Register from './pages/Register';  // Import Registration page
import ConfirmEmail from './pages/ConfirmEmail';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} /> {/* Registration page as landing */}
      <Route path="/login" element={<Login />} />
      <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/home" element={<Home />} /> {/* Home page */}
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/details/:id" element={<ShowBook />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/delete/:id" element={<DeleteBook />} />
    </Routes>
  );
};

export default App;