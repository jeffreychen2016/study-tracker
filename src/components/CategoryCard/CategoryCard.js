import React from 'react';
import './CategoryCard.css';
import categoryRequests from '../../firebaseRequests/categories';
import authRequests from '../../firebaseRequests/auth';

class CategoryCard extends React.Component {
  state = {
    categories: [],
  }

  componentDidMount () {
    categoryRequests.getAllCategoriesForCurrentUser(authRequests.getUserId())
    .then((categories) => {
      this.setState({categories});
    })
    .catch((err) => {
      console.error('Error getting all categories for current user: ', err);
    })
  };

  render () {
    const categoryComponent = this.state.categories.map((category) => {
      return (      
        <div className="category-card" key={category.id}>
          <h4>{category.title}</h4>
          <p>{category.description}</p>
        </div>
      );
    });
    return (
      <div className="CategoryCard">
        {categoryComponent}
      </div>
    );
  };
};

export default CategoryCard;
