import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Optional, for additional matchers
// import AddCategories from './AddCategories';
import AddCategories from '../Components/AddCategories';

describe('AddCategories Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<AddCategories />);
    expect(getByText('E-commerce Categories')).toBeInTheDocument();
  });

  // Add more test cases as needed
});