const Hapi = require("@hapi/hapi");
const { nanoid } = require("nanoid");
const books = require("./books");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Route to store a book
  server.route({
    method: "POST",
    path: "/books",
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Failed to add the book. Please fill in the book title",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Failed to add the book. readPage cannot be greater than pageCount",
          })
          .code(400);
      }

      const id = nanoid(16);
      const finished = pageCount === readPage;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
      };

      books.push(newBook);

      return h
        .response({
          status: "success",
          message: "The book has been successfully added",
          data: {
            bookId: id,
          },
        })
        .code(201);
    },
  });

  // Route to display all books
  server.route({
    method: "GET",
    path: "/books",
    handler: (request, h) => {
      const { name, reading, finished } = request.query;
      let filteredBooks = books;

      if (name) {
        filteredBooks = filteredBooks.filter((book) =>
          book.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      if (reading !== undefined) {
        const isReading = reading === "1";
        filteredBooks = filteredBooks.filter(
          (book) => book.reading === isReading
        );
      }

      if (finished !== undefined) {
        const isFinished = finished === "1";
        filteredBooks = filteredBooks.filter(
          (book) => book.finished === isFinished
        );
      }

      const bookSummaries = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

      return {
        status: "success",
        data: {
          books: bookSummaries,
        },
      };
    },
  });

  // Route to display book details
  server.route({
    method: "GET",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;

      const book = books.find((b) => b.id === bookId);

      if (!book) {
        return h
          .response({
            status: "fail",
            message: "Book not found",
          })
          .code(404);
      }

      return {
        status: "success",
        data: {
          book,
        },
      };
    },
  });

  // Route to update book data
  server.route({
    method: "PUT",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: "fail",
            message: "Failed to update the book. Please fill in the book title",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Failed to update the book. readPage cannot be greater than pageCount",
          })
          .code(400);
      }

      const bookIndex = books.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        return h
          .response({
            status: "fail",
            message: "Failed to update the book. ID not found",
          })
          .code(404);
      }

      const updatedAt = new Date().toISOString();

      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished: pageCount === readPage,
        updatedAt,
      };

      return {
        status: "success",
        message: "The book has been successfully updated",
      };
    },
  });

  // Route to delete a book
  server.route({
    method: "DELETE",
    path: "/books/{bookId}",
    handler: (request, h) => {
      const { bookId } = request.params;

      const bookIndex = books.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        return h
          .response({
            status: "fail",
            message: "The book failed to be deleted. ID not found",
          })
          .code(404);
      }

      books.splice(bookIndex, 1);

      return {
        status: "success",
        message: "The book has been successfully deleted",
      };
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
