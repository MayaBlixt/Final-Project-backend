import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints';
import mongoose from "mongoose";

// Setting up Mongooose connection
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://myDBuser:JVX2vj1t8L36NkNf@cluster0.bfng5.mongodb.net/AugustClownen?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose model for storing highscore
const Highscore = mongoose.model("Highscore", {
  name: { 
    type: String 
  },
  score: { 
    type: Number 
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


//get highscore
app.get("/highscore", async (req, res) => {
  try {
    const highscore = await Highscore.find()
      //.sort({ score: "desc" })
      .limit(10)
      .exec();
    res.json(highscore);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Could not get highscores",
      errors: err.errors,
    });
  }
});

//post highscore
app.post("/highscore", async (req, res) => {
  const { name, score } = req.body;
  const newHighscore = await new Highscore({ name, score });
  try {
    const savedHighscore = await newHighscore.save();
    res.status(201).json(savedHighscore);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Could not post highscore",
      errors: err.errors,
    });
  }
});