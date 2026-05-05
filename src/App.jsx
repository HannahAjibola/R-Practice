import {Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css"
import About from "./components/about";
import Header from "./components/header";
import Contact from "./components/contact";
const App =()=> {
  return(
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Header />}>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact/>} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}


export default App;