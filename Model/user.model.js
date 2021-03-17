const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
	user_name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	status:{
		type: String, 
		enum: ['Active', 'Deleted', 'Blocked']
	},
	about:{
		type: String,
	}
}, { timestamps: { createdAt: 'created_at' }});

const user = mongoose.model('User', UserSchema);
exports.User = user;
