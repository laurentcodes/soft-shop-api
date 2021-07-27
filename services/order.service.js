import Order from '../models/order.model.js';
import User from '../models/user.model.js';

const getOrders = async (urlParams) => {
	try {
		const limit = Number(urlParams.limit);
		const skip = Number(urlParams.skip);
		return await Order.find()
			.sort({ createdDate: -1 }) // -1 for descending sort
			.limit(limit)
			.skip(skip)
			.populate('product_meta.product_id')
			.populate({ path: 'store', select: '-password' })
			.populate({ path: 'user', select: '-password' });
	} catch (error) {
		return { err: 'error loading products' };
	}
};

const createOrder = async (orderParam) => {
	try {
		//creates an order for user
		const order = new Order(orderParam);
		return order.save();
	} catch (error) {
		return { err: 'error creating order' };
	}
};

const toggleFavorite = async (orderID) => {
	try {
		//adds or remove users favorite order
		const order = await Order.findById(orderID);

		if (!order) {
			throw { err: 'Invalid Order' };
		}

		order.favoriteAction(); //calls an instance method
		order.save();

		if (order.favorite) {
			return { msg: 'Order marked as favorite' };
		} else {
			return { msg: 'Order removed from favorites' };
		}

		// return order;
	} catch (err) {
		return { err: 'Error marking order as favorite' };
	}
};

const getFavorites = async (userID, urlParams) => {
	try {
		const limit = Number(urlParams.limit);
		const skip = Number(urlParams.skip);
		//get users favorite orders
		let favoriteOrders = await Order.find({ user: userID, favorite: true })
			.sort({ createdDate: -1 }) // -1 for descending sort
			.limit(limit)
			.skip(skip)
			.populate('product_meta.product_id')
			.populate({ path: 'Store', select: '-password' })
			.populate({ path: 'User', select: '-password' });

		return favoriteOrders;
	} catch (err) {
		return { err: 'Error getting your favorite orders' };
	}
};

const getOrderDetails = async (orderID) => {
	try {
		const order = await Order.findById(orderID);

		console.log(order);
		if (!order) {
			throw { err: 'Error getting this order details' };
		}
		//get users order details
		//can be used by users, stores and admin
		const orderDetails = await Order.findById(orderID)
			.populate('product_meta.product_id')
			.populate({ path: 'Store', select: '-password' })
			.populate({ path: 'User', select: '-password' });

		return orderDetails;
	} catch (err) {
		// return { err: 'error getting this order details' };
		return err;
	}
};

const getOrderHistory = async (userID, urlParams) => {
	try {
		const limit = Number(urlParams.limit);
		const skip = Number(urlParams.skip);
		//gets user order history
		return await Order.find({ user: userID })
			.sort({ createdDate: -1 }) // -1 for descending sort
			.limit(limit)
			.skip(skip)
			.populate('product_meta.product_id')
			.populate({ path: 'store', select: '-password' })
			.populate({ path: 'user', select: '-password' });
	} catch (error) {
		return { err: 'error getting the order history' };
	}
};

const getStoreOrderHistory = async (storeID, urlParams) => {
	console.log(storeID, urlParams);
	try {
		const limit = Number(urlParams.limit);
		const skip = Number(urlParams.skip);

		//gets store order history
		return await Order.find({ store: storeID })
			.sort({ createdDate: -1 }) // -1 for descending sort
			.limit(limit)
			.skip(skip)
			.populate('product_meta.product_id')
			.populate({ path: 'store', select: '-password' })
			.populate({ path: 'user', select: '-password' });
	} catch (error) {
		return { err: 'error getting the order history' };
	}
};

const editOrder = async (orderID, orderParam) => {
	try {
		//can be used by both stores and users
		const newOrder = await Order.findByIdAndUpdate(
			orderID,
			{ $set: orderParam },
			{ omitUndefined: true, new: true }
		);
		return newOrder;
	} catch (error) {
		console.log(error);
		return { err: 'error editing this order' };
	}
};

const cancelOrder = async (orderID) => {
	try {
		//user/store cancel order
		let order = await Order.findById(orderID);
		if (!order) throw { err: 'unable to cancel order' };
		order.CancelOrder();
		order.save();
		return order;
	} catch (error) {
		console.log(error);
		return { err: 'error canceling order' };
	}
};

const completeOrder = async (orderID) => {
	try {
		//fires after payment is confirmed
		let order = await Order.findById(orderID);
		if (!order) throw { err: 'unable to complete order' };
		order.completeOrder();
		order.save();
		return order;
	} catch (error) {
		console.log(error);
		return { err: 'error completing this order' };
	}
};

const receiveOrder = async (orderID) => {
	try {
		//store acknoledges order
		let order = await Order.findById(orderID);
		if (!order) throw { err: 'unable to receive order' };
		order.receiveOrder();
		order.save();
		return order;
	} catch (error) {
		return { err: 'error receiving this order' };
	}
};

const deliverOrder = async (orderID) => {
	try {
		//store delivers order
		let order = await Order.findById(orderID);
		if (!order) throw { err: 'unable to deliver order' };
		order.deliverOrder();
		order.save();
		return order;
	} catch (error) {
		return { err: 'error delivering this order' };
	}
};

const getCartItems = async (userID) => {
	try {
		//get user cart items
		return await User.findById(userID)
			.select('cart')
			.populate('cart.product_id');
	} catch (error) {
		return { err: 'error getting user cart items' };
	}
};

export {
	getOrders,
	createOrder,
	toggleFavorite,
	getOrderDetails,
	getFavorites,
	getOrderHistory,
	getCartItems,
	editOrder,
	cancelOrder,
	getStoreOrderHistory,
	completeOrder,
	deliverOrder,
	receiveOrder,
};
