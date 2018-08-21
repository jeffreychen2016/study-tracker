import React from 'react';
import './CategoryCard.css';
import categoryRequests from '../../firebaseRequests/categories';
import authRequests from '../../firebaseRequests/auth';
import { Modal, Button } from 'react-bootstrap';

class CategoryCard extends React.Component {
  state = {
    categories: [],
    show: false,
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

  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  render () {
    const categoryComponent = this.state.categories.map((category) => {
      return (      
        <div 
          className="category-card-container col-sm-3" 
          key={category.id}
        >
          <div className="category-card-body">
            <h4>{category.title}</h4>
            <p>{category.description}</p>
          </div>
          <div className="category-card-footer">
            <button type="button" className="btn btn-default">Edit</button>
            <button type="button" className="btn btn-default">Delete</button>
          </div>
        </div>
      );
    });

    return (
      <div className="CategoryCard">
        <div className="category-card-container col-sm-3">
          <div className="category-card-body add-category-card">
            <h4></h4>
            <button type="button" className="btn btn-default" onClick={this.handleShow}>Add</button>            
          </div>
        </div>
        {categoryComponent}

        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
  
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Save</Button>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };
};

export default CategoryCard;
