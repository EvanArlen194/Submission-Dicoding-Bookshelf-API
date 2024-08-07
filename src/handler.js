const books = require('./books');
const { nanoid } = require('nanoid');

const validateBookPayload = ({ name, pageCount, readPage }, context) => {
  if (!name) {
    const message = context === 'add' 
      ? 'Gagal menambahkan buku. Mohon isi nama buku'
      : 'Gagal memperbarui buku. Mohon isi nama buku';
    return {
      isValid: false,
      message,
      code: 400,
    };
  }
  if (readPage > pageCount) {
    const message = context === 'add' 
      ? 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
    return {
      isValid: false,
      message,
      code: 400,
    };
  }
  return { isValid: true };
};

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const validation = validateBookPayload({ name, pageCount, readPage }, 'add');
  if (!validation.isValid) {
    return h.response({
      status: 'fail',
      message: validation.message,
    }).code(validation.code);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = [...books];

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    const readingStatus = !!Number(reading);
    filteredBooks = filteredBooks.filter((book) => book.reading === readingStatus);
  }

  if (finished !== undefined) {
    const finishedStatus = !!Number(finished);
    filteredBooks = filteredBooks.filter((book) => book.finished === finishedStatus);
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((b) => b.id === id);

  if (book) {
    return h.response({
      status: 'success',
      data: { book },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const validation = validateBookPayload({ name, pageCount, readPage }, 'update');
  if (!validation.isValid) {
    return h.response({
      status: 'fail',
      message: validation.message,
    }).code(validation.code);
  }

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading,
      finished: pageCount === readPage,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  getAllBooksHandler,
  getBookByIdHandler,
  addBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
