const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
