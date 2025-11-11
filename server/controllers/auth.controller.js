
import generateToken from '../utils/jwt.js'
import User from '../models/user.model.js'

export default {

    signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      };

      const token = generateToken(user);

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,    // Prevents client-side JS from accessing the cookie
        secure: true,      // Only sent over HTTPS
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 3600000   // 1 hour expiry (in milliseconds)
      });

      // console.log("User: ", user);

      return res.status(200).json(
        {
          message: 'Login successful',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          token
        });
    }
    catch (error) {
      res.status(500).json({ message: error.message });
    };
  }
}

// const signin = async (req, res) => {
//     try {
//         let user = await User.findOne({ "email": req.body.email });

//         if (!user) return res.status(401).json({ error: "User not found" });
//         if (!user.authenticate(req.body.password)) return res.status(401).send({ error: "Email and password don't match." });
        
//         const token = generateToken(user);
//         res.cookie('t', token, { expire: new Date() + 9999 });

//         res.status(200).json({
//             message: "Signed in successfully",
//             token,
//             user
//         });
//     } catch (err) {
//         return res.status(401).json({ error: "Could not sign in" });
//     }
// };

// const signout = (req, res) => {
//     res.clearCookie("t");

//     return res.status(200).json({ message: "signed out" });
// };

// export default { signin, signout }