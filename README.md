# Backend Technical Test Datasintesa - Zulfahmi

Hasil teknikal tes sebagai Fullstack Developer di perusahaan Datasintesa oleh Zulfahmi.

## Project setup

1. Pertama, install proyek dengan perintah berikut:

    ```bash
    npm install
    ```
2. Buat file `.env` dan isikan seperti dibawah atau sesuaikan:
    ```properties
    DB_HOST = 'localhost'
    DB_PORT = '27017'
    DB_NAME = 'datasintesa'
    ```
3. Jalankan proyek dengan perintah berikut:

    ```bash
    npm run start
    ```
  
## API Documentation

**Base URL**
```
http://localhost:8000
```

### POST | /upload
Mengunggah file raw data dalam bentuk csv

**Body:**
|key|type|description|
|--|--|--|
|file|File|file raw data csv|

**Response:**
```json
{
    "message": "File saved successfully"
}
```

---

### GET | /graph
Mengambil data graph

**Query Params:**
|key|type|description|
|--|--|--|
|startDate|datetime|range start format `YYYY-M-D H:i:s` (UTC)
|endDate|datetime|range end format `YYYY-M-D H:i:s` (UTC)|
|enodebId|number|enodeb id|
|cellId|number|cell id|


**Response:**
```json
{
  "message": "Raw data loaded successfully",
  "body": [
    {
      "resultTime": "2022-07-22T04:45:00.000Z",
      "availability": 100
    },
    {
      "resultTime": "2022-07-22T04:45:00.000Z",
      "availability": 100
    },
    
    ...
  ]
}
```

---