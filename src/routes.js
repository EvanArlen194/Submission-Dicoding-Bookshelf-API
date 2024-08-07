const {
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    addBookHandler,
    deleteBookByIdHandler,
  } = require('./handler');
  
  const bookRoutes = [
    {
      method: 'POST',
      path: '/books',
      handler: addBookHandler,
      options: {
        description: 'Add a new book',
        notes: 'Returns the added book',
        tags: ['api', 'books'],
      },
    },
    {
      method: 'PUT',
      path: '/books/{id}',
      handler: editBookByIdHandler,
      options: {
        description: 'Edit a book by ID',
        notes: 'Returns the updated book',
        tags: ['api', 'books'],
      },
    },
    {
      method: 'GET',
      path: '/books',
      handler: getAllBooksHandler,
      options: {
        description: 'Get all books',
        notes: 'Returns an array of books',
        tags: ['api', 'books'],
      },
    },
    {
      method: 'GET',
      path: '/books/{id}',
      handler: getBookByIdHandler,
      options: {
        description: 'Get a book by ID',
        notes: 'Returns a single book',
        tags: ['api', 'books'],
      },
    },
    {
      method: 'DELETE',
      path: '/books/{id}',
      handler: deleteBookByIdHandler,
      options: {
        description: 'Delete a book by ID',
        notes: 'Returns the deleted book',
        tags: ['api', 'books'],
      },
    },
  ];
  
  module.exports = bookRoutes;
  