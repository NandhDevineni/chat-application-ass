var UserService = require('../Services/user.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

exports.test = async (req, res) => {
	res.status(200).json({
		message: 'Service Working',
	});
};

exports.createUser = async (req, res) => {
	let user = await UserService.getOneByEmail({ email: req.body.email });
	console.log('user', user);
	if (user) return res.status(200).json({ message: 'User already registered' });

	user = await UserService.createUser({
		user_name: req.body.user_name,
		password: req.body.password,
		email: req.body.email,
		status: 'Active'
	});

	res.status(200).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		message: 'User Created Success',
	});
};

exports.signIn = async (req, res) => {
	console.log('someone trying to connect..');

	console.log(req.body);

	let user = await UserService.getOneByEmail({ email: req.body.email });

	console.log('user', user);

	if (!user) {
		return res.status(200).json({ message: 'Invalid Email' });
	}

	const hash = user.password;

	bcrypt.compare(req.body.password, hash, function (err, result) {
		if (result) {
			const token = jwt.sign(
				{
					name: user.user_name,
					email: user.email,
					userId: user._id,
				},
				config.get('myprivatekey'),
				{
					expiresIn: '1h',
				}
			);
			console.log('login success ' + token);

			res.header('x-auth-token', token)
				.status(200)
				.json({
					message: 'Login Successfuly...!!!',
					token: token,
					Userdata: {
						name: user.user_name,
						email: user.email,
						userId: user._id,
					},
				});
		} else {
			res.status(200).json({
				message: 'Wrong password',
			});
		}
	});
};

exports.updateUser = async (req, res) => {
	
	try {
		
		const { userId } = req.params;
		const updatedUser = await UserService.updateUser({_id:userId},req.body);
		res.status(200).json({
			user: updatedUser,
			message: 'User Updated Success',
		});
		
	} catch (error) {

		res.status(200).json({
			message: 'Can not update user server error',
			error: error
		});
	}

	

}

exports.getOneByID = async (req,res) => {

	try {
		const user = await UserService.getOneByID(req.params.userId);
		res.status(200).json({
			user: user,
			message: 'User found success',
		});
	} catch (error) {
		res.status(200).json({
			message: 'Can not found user by id',
		});
	}
}

exports.getOneByEmail = async (req,res) => {
	
	try {
		const user = await  UserService.getOneByEmail({email:req.params.email});
		if(user){
			res.status(200).json({
				user: user,
				message: 'User found success',
			});
		}else{
			res.status(200).json({
				message: 'Can not found user by email',
			});
		}
		
	} catch (error) {
		
	}
}

exports.getAll = async (req,res) => {
	try {
		const userList = await UserService.getAllUsers();
		res.status(200).json({
			userList,
			message: 'Users found success',
		});
	} catch (error) {
		res.status(200).json({
			message: 'Can not found users',
		});
	}
}

exports.deleteUser = async (req,res) =>{

	let user = await UserService.getOneByEmail({ email: req.body.email });
	
	if (!user) {
		return res.status(200).json({ message: 'Invalid Email' });
	}

	const hash = user.password;

	bcrypt.compare(req.body.password, hash, async function (err, result) {
		if (result) {
			try {

				const updatedUser = await UserService.updateUser({_id:req.params.userId,},{status:'Deleted'});
				res.status(200).json({
					user: updatedUser,
					message: 'User Deleted Success',
				});
				
			} catch (error) {
		
				res.status(200).json({
					message: 'Can not delte user server error',
					error: error
				});
			}
		} else {
			res.status(200).json({
				message: 'Wrong password',
			});
		}
	});
}

exports.forgetPassword = async (req,res) =>{

	let {oldPassword, newPassword} = req.body;

	let user = await UserService.getOneByID(req.params.userId);

	if (!user) {
		return res.status(200).json({ message: 'Invalid User Id' });
	}

	const hash = user.password;

	bcrypt.compare(oldPassword, hash, async function (err, result) {
		if (result) {
			
			const password = await bcrypt.hash(newPassword, 10);

			try {

				const updatedUser = await UserService.updateUser({_id:req.params.userId},{password});
				res.status(200).json({
					user: updatedUser,
					message: 'User Password Updated Success',
				});
				
			} catch (error) {
		
				res.status(200).json({
					message: 'Can not update user password server error',
					error: error
				});
			}

		} else {
			res.status(200).json({
				message: 'Wrong Old Password',
			});
		}
	});
	
}