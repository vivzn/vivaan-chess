import mongoose from "mongoose";



const Game = mongoose.Schema(
  {

    fen: String,
 
  },
  {
    strict: false

  }
);

export default mongoose.models.Game || mongoose.model("Game", Game);
