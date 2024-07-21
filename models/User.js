import mongoose from "mongoose";



const User = mongoose.Schema(
  {
    name: String,
    email: String,
    elo: Number,
    joined: Date,
    photoURL: String,
    playedGames: [String],

  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", User);