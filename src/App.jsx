import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Pages/signup';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}