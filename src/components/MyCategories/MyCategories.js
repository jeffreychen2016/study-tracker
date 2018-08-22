import React from 'react';
import './MyCategories.css';
import CategoryCard from '../CategoryCard/CategoryCard';

class MyCategories extends React.Component {
  redirectToStudyLogs = (categoryId) => {
    this.props.history.push(`/categories/${categoryId}/studylogs`);
  }

  render () {
    return (
      <div className="MyCategories">
        <h2>My Categories</h2>
        <CategoryCard 
          redirectToStudyLogs={this.redirectToStudyLogs}
        />
      </div>
    );
  };
};

export default MyCategories;
