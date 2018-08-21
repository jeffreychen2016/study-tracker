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
              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="input-add-category-title" className="col-sm-2 control-label">Title</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="input-add-category-title" placeholder="Email" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-add-category-description" className="col-sm-2 control-label">Short Description</label>
                  <div className="col-sm-10">
                    <textarea type="password" className="form-control" id="input-add-category-description"></textarea>
                  </div>
                </div>
              </form>
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
