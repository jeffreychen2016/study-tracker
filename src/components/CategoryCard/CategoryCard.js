import React from 'react';
import './CategoryCard.css';
import categoryRequests from '../../firebaseRequests/categories';
import authRequests from '../../firebaseRequests/auth';
import { Modal, Button } from 'react-bootstrap';

class CategoryCard extends React.Component {
  state = {
    categories: [],
    show: false,
    newCategory: {
      title: '',
      description: '',
    },
  };

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

  titleChange = (e) => {
    const tempNewCategory = {...this.state.newCategory};
    tempNewCategory.title = e.target.value;
    this.setState({newCategory: tempNewCategory});
  };

  descriptionChange = (e) => {
    const tempNewCategory = {...this.state.newCategory};
    tempNewCategory.description = e.target.value;
    this.setState({newCategory: tempNewCategory});
  };

  addNewCategoryEvent = () => {
    const newCategory = this.state.newCategory;
    const userId = authRequests.getUserId();
    newCategory.uid = userId;
    categoryRequests.postNewCategory(newCategory)
      .then(() => {
        // posted!
        this.handleClose();
        categoryRequests.getAllCategoriesForCurrentUser(userId)
          .then((categories) => {
            // pull all categories again!
            this.setState({categories});
          })
          .catch((err) => {
            console.error('Error with pulling all categories again: ',err);
          });
      })
      .catch((err) => {
        console.error('Error with posting new category: ', err);
      });
  };

  deleteCategoryEvent = (e) => {
    const categoryId = e.target.dataset.categoryDeleteId;
    const userId = authRequests.getUserId();
    categoryRequests.deleteCategory(categoryId)
      .then(() => {
        // deleted!
        categoryRequests.getAllCategoriesForCurrentUser(userId)
          .then((categories) => {
            // pull all categories again!
            this.setState({categories});
          })
          .catch((err) => {
            console.error('Error with pulling all categories again: ',err);
          });        
      })
      .catch((err) => {
        console.error('Error with deleting category: ', err);
      });
  };

  render () {
    const categoryComponent = this.state.categories.map((category) => {
      return (      
        <div className="category-card-container col-sm-3" key={category.id}>
          <div className="category-card-body">
            <h4>{category.title}</h4>
            <p>{category.description}</p>
          </div>
          <div className="category-card-footer">
            <button 
              type="button" 
              className="btn btn-default" 
              data-category-edit-id={category.id}
            >Edit</button>
            <button 
              type="button" 
              className="btn btn-default"
              data-category-delete-id={category.id}
              onClick={this.deleteCategoryEvent}
            >Delete</button>
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
                    <input 
                      type="text" 
                      className="form-control" 
                      id="input-add-category-title" 
                      value={this.state.newCategory.title}
                      onChange={this.titleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-add-category-description" className="col-sm-2 control-label">Short Description</label>
                  <div className="col-sm-10">
                    <textarea 
                      type="password" 
                      className="form-control" 
                      id="input-add-category-description"
                      value={this.state.newCategory.description}
                      onChange={this.descriptionChange}
                    >
                    </textarea>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.addNewCategoryEvent}>Save</Button>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };
};

export default CategoryCard;
