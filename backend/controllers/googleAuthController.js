import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { auth } from "../config/firebase.js";

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No ID token provided" });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId: uid,
        avatar: picture,
      });
    } else if (!user.googleId) {
      user.googleId = uid;
      user.avatar = picture; 
      await user.save();
    }

  
    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};