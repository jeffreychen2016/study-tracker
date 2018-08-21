import React from 'react';
import './MyCategories.css';
import CategoryCard from '../CategoryCard/CategoryCard';

class MyCategories extends React.Component {
  render () {
    return (
      <div className="MyCategories">
        <h2>My Categories</h2>
        <CategoryCard />
      </div>
    );
  };
};

export default MyCategories;
