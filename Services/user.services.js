var {User} = require('../Model/user.model');
const bcrypt = require("bcrypt");


exports.getAllUsers = async function () {
    const users = await User.find();
    return users;
    
}

exports.createUser = async (query) => {
    const user = new User(query);
    console.log(user);
    user.password = await bcrypt.hash(user.password, 10);
    console.log(user);
    return await user.save();
};

exports.updateUser = async (query , data) => {
    
    try {
        const user = User.findOneAndUpdate(query,data,{
            new: true
        });
        console.log(user);
        return user;

    } catch (error) {
        return error
    }
    


}

exports.getOneByEmail = async function (query) {
    
    const user = await User.findOne(query);
    return user;
   
}

exports.getOneByID = async (userId) => {
    const user = await User.findById(userId);
    return user;
}