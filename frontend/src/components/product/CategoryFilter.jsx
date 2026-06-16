import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./CategoryFilter.css";

const CategoryFilter = ({ selectedCategory, onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  return (
    <div className="category-filter">
      <button
        className={`category-pill ${!selectedCategory ? "active" : ""}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`category-pill ${
            selectedCategory === cat._id ? "active" : ""
          }`}
          onClick={() => onSelect(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
