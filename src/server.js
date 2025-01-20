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

  // Route untuk menyimpan buku
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
            message: "Gagal menambahkan buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
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
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: id,
          },
        })
        .code(201);
    },
  });

  // Route untuk menampilkan semua buku
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

  // Route untuk menampilkan detail buku
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
            message: "Buku tidak ditemukan",
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

  // Route untuk mengubah data buku
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
            message: "Gagal memperbarui buku. Mohon isi nama buku",
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: "fail",
            message:
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          })
          .code(400);
      }

      const bookIndex = books.findIndex((book) => book.id === bookId);

      if (bookIndex === -1) {
        return h
          .response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
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
        message: "Buku berhasil diperbarui",
      };
    },
  });

  // Route untuk menghapus buku
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
            message: "Buku gagal dihapus. Id tidak ditemukan",
          })
          .code(404);
      }

      books.splice(bookIndex, 1);

      return {
        status: "success",
        message: "Buku berhasil dihapus",
      };
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
