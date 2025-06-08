# API Documentation

## Add Book API

Endpoint: POST /books

Request Body:

```json
{
  "name": "Buku A",
  "year": 2011,
  "author": "Jane Doe",
  "summary": "Lorem Dolor sit Amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 200,
  "readPage": 26,
  "reading": false
}
```

Response Body Success:

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": {
    "bookId": "uniqueId"
  }
}
```

Response Body Error:

```json
{
  "status": "fail",
  "message": "Buku gagal ditambahkan"
}
```

Response Body Error (If the name is not included):

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. Mohon isi nama buku"
}
```

Response Body Error (If readPage is greater than pageCount):

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
}
```

## Get Books API

Endpoint: GET /books

Response Body Success:

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "uniqueId",
        "name": "Buku A",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "uniqueId",
        "name": "Buku B",
        "publisher": "Dicoding Indonesia"
      },
      {
        "id": "uniqueId",
        "name": "Buku C",
        "publisher": "Dicoding Indonesia"
      }
    ]
  }
}
```

Response Body Success (If the array is empty):

```json
{
  "status": "success",
  "data": {
    "books": []
  }
}
```

## Get Book Details API

Endpoint: GET /books/{bookId}

Response Body Success:

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "uniqueId",
      "name": "Buku A",
      "year": 2011,
      "author": "Jane Doe",
      "summary": "Lorem Dolor sit Amet",
      "publisher": "Dicoding Indonesia",
      "pageCount": 200,
      "readPage": 26,
      "finished": false,
      "reading": false,
      "insertedAt": "2021-03-05T06:14:28.930Z",
      "updatedAt": "2021-03-05T06:14:30.718Z"
    }
  }
}
```

Response Body Error:

```json
{
  "status": "fail",
  "message": "Buku tidak ditemukan"
}
```

## Update Book API

Endpoint: PUT /books/{bookId}

Request Body:

```json
{
  "name": "Buku A Revisi",
  "year": 2011,
  "author": "Jane Doe",
  "summary": "Lorem Dolor sit Amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 200,
  "readPage": 26,
  "reading": true
}
```

Response Body Success:

```json
{
  "status": "success",
  "message": "Buku berhasil diperbarui"
}
```

Response Body Error:

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. Id tidak ditemukan"
}
```

Response Body Error (If the name is not included):

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. Mohon isi nama buku"
}
```

Response Body Error (If readPage is greater than pageCount):

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
}
```

## Delete Book API

Endpoint: DELETE /books/{bookId}

Response Body Success:

```json
{
  "status": "success",
  "message": "Buku berhasil dihapus"
}
```

Response Body Error:

```json
{
  "status": "fail",
  "message": "Buku gagal dihapus. Id tidak ditemukan"
}
```
