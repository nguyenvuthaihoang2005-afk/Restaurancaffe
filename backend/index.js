const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');  // ← Thêm dòng này
require('dotenv').config();  // Load .env

const usersRouter = require('./routes/users');
const menuRouter = require('./routes/menu');
const tablesRouter = require('./routes/tables');
const reservationsRouter = require('./routes/reservations');
const ordersRouter = require('./routes/orders');
const promotionsRouter = require('./routes/promotions');
const invoicesRouter = require('./routes/invoices');
const paymentsRouter = require('./routes/payments');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve ảnh tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', usersRouter);
app.use('/api/menu', menuRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/promotions', promotionsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/payments', paymentsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));