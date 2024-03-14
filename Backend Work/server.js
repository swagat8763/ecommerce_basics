const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoriesRouter = require('./routes/categories');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://swagatnaik8763:Zon0KLiBklc2COgr@cluster0.xtci2ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{dbName : 'ecommerce-fashion'}, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log('Connected'))
.catch((e)=>console.log(e,'Something went wrong'))

app.use(cors());
app.use(bodyParser.json());

// Mount the categories router on a specific path
app.use('/api/category', categoriesRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = server;