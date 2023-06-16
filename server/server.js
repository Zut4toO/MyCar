const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const csvtojsonV2 = require('csvtojson');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  '/uploads/images',
  express.static(path.join(__dirname, 'uploads', 'images'))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Image Storage
const storage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    callback(null, fileName);
  },
});

// Image Upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== '.png' &&
      ext !== '.PNG' &&
      ext !== '.jpg' &&
      ext !== '.JPG' &&
      ext !== '.jpeg' &&
      ext !== '.JPEG' &&
      ext !== '.heic' &&
      ext !== '.HEIC' &&
      ext !== '.heif' &&
      ext !== '.HEIF'
    ) {
      return callback(new Error('Only images are allowed' + ext), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

// CSV Storage
const storageCSV = multer.memoryStorage({});

// CSV Upload
const uploadCSV = multer({
  storage: storageCSV,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.csv' && ext !== '.CSV') {
      return callback(new Error('Only CSV files are allowed' + ext), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

// Create connection pool
const pool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mycardb',
});

// Connect to MariaDB
pool
  .getConnection()
  .then((connection) => {
    console.log('MariaDB Connected');
    connection.release();
  })
  .catch((error) => {
    console.log('Not connected due to error: ' + error);
  });

// Create DB
app.get('/createdb', async (req, res) => {
  try {
    let sql = 'CREATE DATABASE IF NOT EXISTS mycardb';
    await pool.query(sql);
    console.log('Database created...');
    res.send('Database created...');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database creation failed');
  }
});

// Create table
app.get('/createtablecar', async (req, res) => {
  try {
    let sql =
      'CREATE TABLE IF NOT EXISTS mycardb(id int AUTO_INCREMENT, objNr VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, model VARCHAR(255) NOT NULL, kw int NOT NULL, manufactured int NOT NULL, price FLOAT NOT NULL, image_path VARCHAR(255), PRIMARY KEY(id))';
    await pool.query(sql);
    console.log('Table created...');
    res.send('Table created...');
  } catch (err) {
    console.error(err);
    res.status(500).send('Table creation failed');
  }
});

// Insert New Car
app.post('/car', upload.single('car_image'), async (req, res) => {
  try {
    const { objNr, brand, model, kw, manufactured, price } = req.body;

    if (!objNr) {
      throw new Error("Missing required field: 'brand'");
    }
    if (!brand) {
      throw new Error("Missing required field: 'brand'");
    }
    if (!model) {
      throw new Error("Missing required field: 'model'");
    }
    if (!kw) {
      throw new Error("Missing required field: 'kw'");
    }
    if (!manufactured) {
      throw new Error("Missing required field: 'manufactured'");
    }
    if (!price) {
      throw new Error("Missing required field: 'manufactured'");
    }

    let sql = `INSERT INTO mycardb (objNr, brand, model, kw, manufactured, price, image_path) 
    VALUES ('${objNr}', '${brand}', '${model}', ${kw}, '${manufactured}', '${price}', '${req.file?.filename}')`;
    await pool.query(sql);
    res.status(200).send('New Car created...');
  } catch (err) {
    console.error(err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    }
    res.status(500).send('New Car creation failed');
  }
});

// Insert New Car from CSV
app.post('/car/csv', uploadCSV.single('car_csv'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Missing required field: 'car_csv'");
    }
    // Convert raw buffer data to string
    const csvData = req.file.buffer.toString();

    const convertCsvToJson = async (csvData) => {
      try {
        const csvJson = await csvtojsonV2({
          delimiter: ';',
          noheader: false,
          output: 'json',
        }).fromString(csvData);
        return csvJson;
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    const processData = async () => {
      try {
        const csvJson = await convertCsvToJson(csvData);
        //console.log(csvJson);
        // Check if objNr already exists in DB
        const objNrArray = csvJson.map((car) => {
          return car.ObjNr;
        });

        const sqlString = "'" + objNrArray.join("', '") + "'";
        matchObjNr = `SELECT objNr FROM mycardb WHERE objNr IN (${sqlString})`;
        const fetchMatchingCars = await pool.query(matchObjNr);

        const matchedObjNrArray = fetchMatchingCars.map((car) => {
          return car.objNr;
        });

        const checkedCars = csvJson.filter(
          (item) => !matchedObjNrArray.includes(item.ObjNr)
        );

        // Insert new, unique cars into DB
        async function uploadCarsToDatabase() {
          // Array of SQL queries
          const sqlQueries = checkedCars.map((car) => {
            const { ObjNr, Brand, Model, kW, Manufactured, Price } = car;
            return `INSERT INTO mycardb (objNr, brand, model, kw, manufactured, price)
                    VALUES ('${ObjNr}', '${Brand}', '${Model}', ${kW}, '${Manufactured}', '${Price}')`;
          });
          try {
            for (let sql of sqlQueries) {
              await pool.query(sql);
            }
          } catch (error) {
            console.error('New Car creation failed:', error);
            throw error;
          }
        }

        await uploadCarsToDatabase();

        // Response show how many cars were created
        res.status(200).json({
          message: `${checkedCars.length} / ${csvJson.length} cars were created`,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('New Car creation failed');
      }
    };

    await processData(); // Wait for the function to complete
  } catch (err) {
    console.error(err);
    res.status(500).send('New Car creation failed');
  }
});

// Update Car
app.patch('/car/:id', upload.single('car_image'), async (req, res) => {
  try {
    const { objNr, brand, model, kw, manufactured, price } = req.body;
    if (!objNr) {
      throw new Error("Missing required field: 'objNr'");
    }
    if (!brand) {
      throw new Error("Missing required field: 'brand'");
    }
    if (!model) {
      throw new Error("Missing required field: 'model'");
    }
    if (!kw) {
      throw new Error("Missing required field: 'kw'");
    }
    if (!manufactured) {
      throw new Error("Missing required field: 'manufactured'");
    }
    if (!price) {
      throw new Error("Missing required field: 'price'");
    }
    console.log('file', req.file);

    // Find current Image Path
    if (req.file) {
      let findImagePath = `SELECT image_path FROM mycardb WHERE id = ${req.params.id}`;
      const fetchImagePath = await pool.query(findImagePath);
      // Remove current Image
      fs.unlink(
        `uploads/images/${fetchImagePath[0]?.image_path}`,
        (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          }
          console.log('File deleted');
        }
      );
    }

    const sql = `UPDATE mycardb SET objNr = '${objNr}', brand = '${brand}', model = '${model}', kw = '${kw}', manufactured = '${manufactured}', price = '${price}', image_path ='${req.file?.filename}'  WHERE id = ${req.params.id}`;

    await pool.query(sql);
    console.log('Update successful');
    res.status(200).send('Update successful');
  } catch (error) {
    console.log('Update failed' + error);
    res.status(500).send('Update failed');
  }
});

// Select All Cars
app.get('/car', async (req, res) => {
  try {
    let sql = 'SELECT * FROM mycardb';
    const fetchALlCars = await pool.query(sql);
    const jsonS = JSON.stringify(fetchALlCars);
    res.status(200).send(jsonS);
  } catch (error) {
    console.log('Fetch failed');
    res.status(500).send('Fetching all Cars failed');
  }
});

// Select Single Car
app.get('/car/:id', async (req, res) => {
  try {
    let sql = `SELECT * FROM mycardb WHERE id = ${req.params.id}`;
    const fetchCar = await pool.query(sql);
    const jsonS = JSON.stringify(fetchCar);
    res.status(200).send(jsonS);
  } catch (error) {
    console.log('Fetch single car failed');
    res.status(500).send('Fetching single car failed');
  }
});

// Delete post
app.delete('/car/:id', async (req, res) => {
  try {
    let findImagePath = `SELECT image_path FROM mycardb WHERE id = ${req.params.id}`;
    const fetchImagePath = await pool.query(findImagePath);

    let sql = `DELETE FROM mycardb WHERE id = ${req.params.id}`;
    await pool.query(sql);

    fs.unlink(
      `uploads/images/${fetchImagePath[0]?.image_path}`,
      (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
        console.log('File deleted');
      }
    );
    console.log('Post deleted...');
    res.send('Post deleted...');
  } catch (error) {
    console.log('Deletion failed', error);
    res.status(500).send('Deletion failed');
  }
});
