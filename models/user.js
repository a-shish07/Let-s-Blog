const { createHmac, randomBytes } = require('crypto');

const { Schema, model } = require("mongoose");
const { createTokenForUser } = require('../services/auth');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    //   required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/Images/profile.png",
    },
    role: {
        type: String,
        enum : ["USER" , "ADMIN"],
        default: "USER",
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
    const user = this;

    if(!user.isModified("password"))return ;

    // const salt  = randomBytes(16).toString();   // like a secret random key for evry user
    const salt  = 'secrets';   // like a secret random key for evry user
    const hashedPassword = createHmac('sha256' , salt)
                            .update(user.password)
                            .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken' , async function (email, password) {
    const user = await this.findOne({ email });
    if(!user)  new Error('User not found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256' , salt)
                                .update(password)
                                .digest('hex');

    if(hashedPassword!==userProvidedHash)throw new Error('Incorrect Password');  

    // if matched
    // return { user };

    const token = createTokenForUser(user);
    return token;

})

const User = model('user' , userSchema);

module.exports = User;
