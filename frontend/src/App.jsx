import React,{useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'bootstrap-icons/font/bootstrap-icons.css';

import Navbar from "./components/navbar";
import Category from "./components/category";
import Task from "./components/task";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  return (
    <>
      <Navbar />
      <div className="row px-2 py-2">
        <Category onSelectCategory={handleSelectCategory}/>
        <Task categoryId={selectedCategory}/>
      </div>
    </>
  )
}

export default App
