/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectUser, setUser] = useState('all');
  const [query, setQuery] = useState('');
  const lowerQuery = query.toLowerCase().trim();
  const [sortState, setSortState] = useState('none');
  const [selectedCategories, setSelectedCategories] = useState(['all']);

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      c => c.id === product.categoryId,
    );
    const user = category
      ? usersFromServer.find(u => u.id === category.ownerId)
      : null;

    return { ...product, category, user };
  });

  const visibleProducts = products.filter(product => {
    const matchesQuery =
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerQuery));

    const matchesUser =
      selectUser === 'all' ||
      (product.user && String(product.user.id) === selectUser);

    const matchesCategory =
      selectedCategories.includes('all') ||
      (product.category && selectedCategories.includes(product.category.title));

    return matchesQuery && matchesUser && matchesCategory;
  });

  function toggleCategory(categoryTitle) {
    if (categoryTitle === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        if (prev.includes('all')) return [categoryTitle];
        if (prev.includes(categoryTitle)) {
          const filtered = prev.filter(c => c !== categoryTitle);

          return filtered.length === 0 ? ['all'] : filtered;
        }

        return [...prev, categoryTitle];
      });
    }
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUser(`all`)}
                className={cn({ 'is-active': selectUser === 'all' })}
              >
                All
              </a>
              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({
                      'is-active': selectUser === `${user.id}`,
                    })}
                    onClick={() => setUser(String(user.id))}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.currentTarget.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button mr-6 ', {
                  'is-success': selectedCategories.includes('all'),
                })}
                onClick={() => toggleCategory('all')}
              >
                All
              </a>
              {categoriesFromServer.map(category => {
                return (
                  <a
                    key={category.id}
                    href="#/"
                    data-cy="AllCategories"
                    className={cn('button mr-2 ', {
                      'is-info': selectedCategories.includes(category.title),
                    })}
                    onClick={() => toggleCategory(category.title)}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={event => {
                  event.preventDefault();
                  setUser('all');
                  setSelectedCategories(['all']);
                  setQuery('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className="fas fa-sort fa-sort-down"
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className="fas fa-sort fa-sort-down"
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className="fas fa-sort fa-sort-down"
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.length > 0 ? (
                visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    {product.category && (
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>
                    )}
                    {product.user && (
                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': product.user.sex === 'm',
                          'has-text-danger': product.user.sex === 'f',
                        })}
                      >
                        {product.user.name}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <p data-cy="NoMatchingMessage">
                  <br />
                  No products matching selected criteria
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
