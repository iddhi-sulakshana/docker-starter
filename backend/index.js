import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const TestData = mongoose.model(
    "TestData",
    new mongoose.Schema({
        id: Number,
        name: String,
        value: Number,
    })
);

mongoose
    .connect("mongodb://localhost:27017/docker_starter")
    .then(() => {
        console.log("Connected to MongoDB");
        // check if the collection is empty
        TestData.countDocuments().then((count) => {
            if (count === 0) {
                // insert some data
                TestData.insertMany([
                    { id: 1, name: "First", value: 100 },
                    { id: 2, name: "Second", value: 200 },
                    { id: 3, name: "Third", value: 300 },
                ]);
            }
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/data", async (req, res) => {
    const data = await TestData.find();
    // remove _id and __v from the response
    data.forEach((item) => {
        item.id = item._id;
        delete item._id;
        delete item.__v;
    });
    res.send(data);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
