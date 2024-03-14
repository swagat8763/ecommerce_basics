import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { BsPencil, BsTrash } from 'react-icons/bs';

class CategoryTree extends Component {
  state = {
    showModal: false,
    editedCategory: null,
  };

  handleEdit = (category) => {
    this.setState({ showModal: true, editedCategory: category });
  };

  handleClose = () => {
    this.setState({ showModal: false, editedCategory: null });
  };

  fetchCategories = () => {
    axios.get('http://localhost:5000/api/category/')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => console.error('Error fetching categories:', error));
  };
  

  handleSave = () => {
    const { editedCategory } = this.state;
        this.props.updateCategory(editedCategory);
        this.handleClose(); // Close the modal
      
  };

  handleDeleteCategory = (categoryId) => {
    this.props.handleDelete(categoryId)
    
  };


  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editedCategory: {
        ...prevState.editedCategory,
        [name]: value
      }
    }));
  };

  renderSubcategories(subCategories) {
    return (
      <ul>
        {subCategories.map(subCategory => (
          <li key={subCategory.name}>
            {subCategory.name}
            {subCategory.subCategories.length > 0 && this.renderSubcategories(subCategory.subCategories)}
            {subCategory.items.length > 0 && (
              <ul>
                {subCategory.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { categories } = this.props;
    const { showModal, editedCategory } = this.state;

    return (
      <>
        <ul>
          {categories && categories.map(category => (
            <li key={category._id}>
              {category.category}
              <BsPencil className="edit-icon" style={{cursor : 'pointer'}} title='Edit Category' onClick={() => this.handleEdit(category)} />
              <BsTrash onClick={() => this.handleDeleteCategory(category._id)} title='Delete Category' style={{cursor : 'pointer'}} />
              { this.renderSubcategories(category.subCategories)}
            </li>
          ))}
        </ul>

        {/* Modal for editing category */}
        <Modal show={showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={editedCategory ? editedCategory.category : ''}
                  onChange={this.handleChange}
                />
              </Form.Group>
              {/* Add form fields for other category properties if needed */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CategoryTree;