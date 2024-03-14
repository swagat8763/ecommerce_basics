import React, { Component } from 'react';
import { Button, Card, Col, Container } from "react-bootstrap";
import background from "../Images/AdminBackgroud.jpg";
import axios from 'axios';
import CategoryTree from './CategoryTree';


class AddCategories extends Component {
    constructor(props) {
        super(props);

        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.handleAddSubCategory = this.handleAddSubCategory.bind(this);
        this.handleAddCategoryItem = this.handleAddCategoryItem.bind(this);
        this.handleSubCategoryNameChange = this.handleSubCategoryNameChange.bind(this);
        this.handleCategoryItemChange = this.handleCategoryItemChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.categoryTreeClick = this.categoryTreeClick.bind(this);

        this.state = {
            categoryTreeData : [],
            CategoryDetails: [],
            categories: [{ name: "", subCategories: [{ name: "", subCategories: [], items: [""] }] }],
            description: '',
            categoryValidation: '',
            showCategoryTree: false
            
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/category/')
            .then(response => {
                this.setState({
                    categoryTreeData: response.data
                })

            })
            .catch((error) => {
                console.log(error);
            })
    }

    fetchCategories = () => {
        console.log('FETCH CALLED')
        axios.get('http://localhost:5000/api/category/')
          .then(response => {
            this.setState({ categoryTreeData: response.data });
          })
          .catch(error => console.error('Error fetching categories:', error));
      };

    updateCategory = (updatedCategory) => {
        // Send request to update category
        axios.post(`http://localhost:5000/api/category/update/${updatedCategory._id}`, updatedCategory)
          .then(response => {
            console.log('Category updated:', response.data);
            this.fetchCategories(); // Update categories after successful update
          })
          .catch(error => console.error('Error updating category:', error));
      };

      handleDelete = (categoryId) => {

        axios.delete(`http://localhost:5000/api/category/${categoryId}`)
          .then(response => {
            console.log('Category deleted:', response.data);
            this.fetchCategories();
            // this.props.onUpdate(); // Update the UI
          })
          .catch(error => console.error('Error deleting category:', error));
      };

    handleSubCategoryNameChange = (idx, subIdx, isSubSubcategory = false) => evt => {
        const { value } = evt.target;
        const newCategories = this.state.categories.map((category, cidx) => {
            if (idx !== cidx) return category;

            if (!isSubSubcategory) {
                const newSubCategories = category.subCategories.map((subcategory, sidx) => {
                    if (subIdx !== sidx) return subcategory;
                    return { ...subcategory, name: value };
                });
                return { ...category, subCategories: newSubCategories };
            } else {
                const newSubCategories = category.subCategories.map((subcategory, sidx) => {
                    if (subIdx !== sidx) return subcategory;
                    const newSubSubCategories = subcategory.subCategories.map((subsubcategory, ssidx) => {
                        if (subIdx !== ssidx) return subsubcategory;
                        return { ...subsubcategory, name: value };
                    });
                    return { ...subcategory, subCategories: newSubSubCategories };
                });
                return { ...category, subCategories: newSubCategories };
            }
        });

        this.setState({ categories: newCategories });
    };

    handleAddSubCategory = (idx, subIdx) => () => {
        const newCategories = [...this.state.categories];
        if (subIdx === undefined) {
            newCategories[idx].subCategories.push({ name: "", subCategories: [], items: [""] });
        } else {
            newCategories[idx].subCategories[subIdx].subCategories.push({ name: "", subCategories: [], items: [""] });
        }
        this.setState({ categories: newCategories });
    };

    handleAddCategoryItem = (idx, subIdx) => () => {
        const newCategories = [...this.state.categories];
        if (subIdx === undefined) {
            newCategories[idx].subCategories.push({ name: "", subCategories: [], items: [""] });
        } else {
            newCategories[idx].subCategories[subIdx].items.push("");
        }
        this.setState({ categories: newCategories });
    };

    handleCategoryItemChange = (idx, subIdx, itemIdx) => evt => {
        const { value } = evt.target;
        const newCategories = this.state.categories.map((category, cidx) => {
            if (idx !== cidx) return category;

            if (subIdx !== undefined) {
                const newSubCategories = category.subCategories.map((subcategory, sidx) => {
                    if (subIdx !== sidx) return subcategory;

                    if (itemIdx === undefined) {
                        const newItems = subcategory.items.map((item, iIdx) => value);
                        return { ...subcategory, items: newItems };
                    }

                    const newItems = subcategory.items.map((item, iIdx) => {
                        if (itemIdx !== iIdx) return item;
                        return value;
                    });

                    return { ...subcategory, items: newItems };
                });
                return { ...category, subCategories: newSubCategories };
            }

            return category;
        });

        this.setState({ categories: newCategories });
    };

    onChangeCategory(e) {
        const { value } = e.target;
        this.setState(prevState => ({
            categories: [{ name: value, subCategories: prevState.categories[0].subCategories }],
            categoryValidation: ''
        }));
    }

    onChangeDescription(e) {
        this.setState({ description: e?.target?.value });
    }

    onSubmit(e) {
        e.preventDefault();

        if (true) {
            const categories = {
                category: this.state.categories[0].name,
                subCategories: this.state.categories[0].subCategories,
                description: this.state.description
            };

            axios.post('http://localhost:5000/api/category/add', categories)
            .then(response => {
                console.log('Category Added:', response.data);
                this.fetchCategories();
                // this.props.onUpdate(); // Update the UI
              })
              .catch(error => console.error('Error deleting category:', error));

            this.setState({
                categories: [{ name: "", subCategories: [{ name: "", subCategories: [], items: [""] }] }],
                description: '',
                categoryValidation: ''
            });
            alert('Category added');
        } else {
            alert('Category not added!');
        }
    }

    categoryTreeClick() {
        this.setState(prevState => ({
            showCategoryTree: !prevState.showCategoryTree
        }));
    }

    render() {
        return (
            <div style={{ backgroundImage: `url(${background})` }}>
                <Button onClick={this.categoryTreeClick}>Show Category Tree</Button>
                {this.state.showCategoryTree && <CategoryTree categories={this.state.categoryTreeData} updateCategory={this.updateCategory} handleDelete={this.handleDelete} />}
                <Container>
                    <Col className="bg-light" style={{ minHeight: '40rem', minWidth: '40px' }}>
                        <Card style={{ minWidth: '40px', minHeight: '42rem', marginTop: '3.5rem' }}>
                            <center><h3 style={{ marginTop: '5rem' }}>E-commerce Categories</h3></center>
                            <form onSubmit={this.onSubmit} className=' center'>
                                <div className="form-group ml-5 mr-5">
                                    <label>Category</label>
                                    <input type="text"
                                        required
                                        placeholder='Enter a Category'
                                        className="form-control"
                                        value={this.state.categories[0].name}
                                        onChange={this.onChangeCategory}
                                    />
                                    <p className='text-danger small'>{this.state.categoryValidation}</p>
                                </div>
                                {this.state.categories.map((category, idx) => (
                                    <div key={idx}>
                                        <div className="form-group ml-5 mr-5">
                                            <label>Subcategories</label>
                                            {category.subCategories.map((subcategory, subIdx) => (
                                                <div key={subIdx}>
                                                    <input type="text"
                                                        required
                                                        placeholder='Enter Subcategory'
                                                        className="form-control"
                                                        value={subcategory.name}
                                                        onChange={this.handleSubCategoryNameChange(idx, subIdx)}
                                                    />
                                                    <div className="form-group ml-3">
                                                        <label>Sub-subcategories</label>
                                                        {subcategory.subCategories.map((subsubcategory, ssIdx) => (
                                                            <div key={ssIdx}>
                                                                <input type="text"
                                                                    required
                                                                    placeholder='Enter nested category'
                                                                    className="form-control"
                                                                    value={subsubcategory.name}
                                                                    onChange={this.handleSubCategoryNameChange(idx, subIdx, true)}
                                                                />
                                                            </div>
                                                        ))}
                                                        <Button type="button" onClick={this.handleAddSubCategory(idx, subIdx)} className="btn btn-info btn-sm">Add Sub-subcategory</Button>
                                                    </div>
                                                    <div className="form-group ml-3">
                                                        <label>Category Items</label>
                                                        {subcategory.items.map((item, itemIdx) => (
                                                            <div key={itemIdx}>
                                                                <input type="text"
                                                                    required
                                                                    placeholder='Enter item'
                                                                    className="form-control"
                                                                    value={item}
                                                                    onChange={this.handleCategoryItemChange(idx, subIdx, itemIdx)}
                                                                />
                                                            </div>
                                                        ))}
                                                        <Button type="button" onClick={this.handleAddCategoryItem(idx, subIdx)} className="btn btn-info btn-sm">Add Item</Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button type="button" onClick={this.handleAddSubCategory(idx)} className="btn btn-info btn-sm">Add Subcategory</Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="form-group">
                                    <center>
                                        <input type="submit" value="Add" className="btn btn-info" />
                                    </center>
                                </div>
                            </form>
                        </Card>
                    </Col>
                </Container>
                
            </div>
        )
    }
}

export default AddCategories;
