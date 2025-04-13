// Import necessary packages
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20'); // Google OAuth 2.0 strategy from passport
const User = require('../models/User');  // Sequelize model to interact with your User table

// Configure Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,         // Google client ID fetched from environment variables.
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables.
  callbackURL: '/auth/google/callback',           // URL where Google will redirect after authentication.
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create the user in your database based on the Google profile ID
    const [user, created] = await User.findOrCreate({
      where: { googleId: profile.id },  // Match the user's Google ID with the ID in your User table.
      defaults: {                       // If user doesn't exist, create them with the following info.
        username: profile.displayName,   // Set the username from the Google profile
        email: profile.emails[0].value,  // Use the email from the Google profile
        googleId: profile.id,           // Store the Google ID for future logins
        profilePic: profile.photos && profile.photos.length ? profile.photos[0].value : null,  // Store the user's profile picture, if available
      },
    });

    // If the user was created, you can add additional logic here (e.g., sending a welcome email)
    if (created) {
      console.log(`New user created: ${user.username}`);
    }

    // Pass the user to the next step in the authentication process
    return done(null, user);  // Pass the user object to serialize
  } catch (error) {
    // Handle any errors that may occur during user lookup or creation
    return done(error);  // If an error occurs, pass it to the done callback to handle the failure
  }
}));

// Serialize the user for storing in session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session
  done(null, user.id);  // Store only the user ID in the session to keep it lightweight
});

// Deserialize the user based on the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve the full user data from the database using the user ID stored in the session.
    const user = await User.findByPk(id);  // Fetch the user from the database using Sequelize
    done(null, user);  // Pass the user object to the next middleware
  } catch (error) {
    // If an error occurs while deserializing, handle it
    done(error);  // Pass the error to the done callback
  }
});
