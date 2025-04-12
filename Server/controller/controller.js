const {userModel} = require('../models/model');
const mongoose=require('mongoose');
const updateProfilePicture = async (req, res) => {
    try {
        const userId =new mongoose.Types.ObjectId(req.params.id);
        const imageUrl = req.file.path; // Cloudinary gives this path

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { ProfilePicture: imageUrl },
            { new: true }
        );

        res.status(200).json({
            message: 'Profile picture updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload profile picture' });
    }
};
module.exports ={updateProfilePicture};
