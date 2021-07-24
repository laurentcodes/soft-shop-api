import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware.js';
import cors from 'cors';
// import { jwt } from './middleware/jwtMiddleware.js';

import connectDB from './config/db.js';

import userRoutes from './routes/user.routes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());

app.use('/users', userRoutes);

// api routes
// app.use('/admin', require('./controllers/admin.controller'));
// app.use('/store', require('./controllers/store.controller'));
// app.use('/order', require('./controllers/order.controller'));
// app.use('/product', require('./controllers/product.controller'));
// app.use('/category', require('./controllers/category.controller'));

// this is just here to verify if the server is online
// app.use('/', require('./controllers/app.controller'));

app.get('/', (req, res) => {
	res.send('API is running...');
});

// global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
