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
    fromButton:'',
    categoryIdSelected:'',
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

  handleShow = (e) => {
    const fromButton = e.target.dataset.fromButton;
    this.setState({ show: true });
    this.setState({fromButton});
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


  // add button would not have a category id
  // so need to set newCategory to be empty in order to have modal display empty fields
  populateExistingCategory = (e) => {
    const categoryId = e.target.dataset.categoryEditId;
    if (categoryId) {
      categoryRequests.getSingleCategory(categoryId)
        .then((category) => {
          this.setState({newCategory: category});
        })
        .catch((err) => {
          console.error('Error with getting single category: ', err);
        });
      this.handleShow(e);
    } else {
      this.setState({newCategory: {title: '', description: ''}});
      this.handleShow(e);
    };
    // set the category id to the state for update function
    this.setState({categoryIdSelected: categoryId});
  }

  updateCategoryEvent = () => {
    const updatedCategory = this.state.newCategory;
    const categoryId = this.state.categoryIdSelected;
    const userId = authRequests.getUserId();
    categoryRequests.updateCategory(categoryId,updatedCategory)
      .then(() => {
        // updated
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
        console.error('Error with updating category: ', err);
      })
  };

  render () {
    const image = require(`../../imgs/category-card-add.png`);
    const categoryComponent = this.state.categories.map((category) => {
      const viewStudyLogsEvent = () => {
        this.props.redirectToStudyLogs(category.id);
      };
      return (     
        <div className="category-card-wrapper col-sm-3"  key={category.id}> 
          <div className="category-card-container">
            <div className="category-card-body">
              <h4>{category.title}</h4>
              <p>{category.description}</p>
            </div>
            <div className="category-card-footer">
              <button 
                type="button" 
                className="btn btn-default" 
                data-from-button="view-btn"
                onClick={viewStudyLogsEvent}
              >Get In</button>
              <br />
              <button 
                type="button" 
                className="btn btn-default" 
                data-category-edit-id={category.id}
                data-from-button="edit-btn"
                onClick={this.populateExistingCategory}
              >Edit</button>
              <button 
                type="button" 
                className="btn btn-default"
                data-category-delete-id={category.id}
                onClick={this.deleteCategoryEvent}
              >Delete</button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="CategoryCard">
        <div 
          className="category-card-wrapper col-sm-3"
          onClick={this.populateExistingCategory} 
        >
          <div className="category-card-container">
            <div className="category-card-body add-category-card">
              <h4></h4>
              <img 
                type="button" 
                className="add-btn" 
                data-from-button="add-btn"
                src={image}
              />
              <label>Add More Categories</label>            
            </div>
          </div>
        </div>

        {categoryComponent}

        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
            {
              this.state.fromButton === 'add-btn' ? 
              <Modal.Title>Add New Category</Modal.Title> :
              <Modal.Title>Edit Category</Modal.Title>
            }
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
              {
                this.state.fromButton === 'add-btn' ? 
                <Button onClick={this.addNewCategoryEvent}>Save</Button> :
                <Button onClick={this.updateCategoryEvent}>Save</Button>
              }
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };
};

export default CategoryCard;
