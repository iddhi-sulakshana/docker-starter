import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TestData = mongoose.model(
    "TestData",
    new mongoose.Schema({
        id: Number,
        name: String,
        value: Number,
    })
);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = "images/";
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
});

const DB_URL =
    process.env.MONGODB_URI ||
    "mongodb://admin:password@localhost:27017/docker_starter?authSource=admin";

mongoose
    .connect(DB_URL)
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
app.use("/images", express.static(path.join(__dirname, "images")));

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

app.post("/data", async (req, res) => {
    const { name, value } = req.body;
    if (!name || !value) {
        return res.status(400).send("Name and value are required");
    }
    // get the last item id and increment it by 1
    const lastItem = await TestData.findOne().sort({ id: -1 });
    const id = lastItem ? lastItem.id + 1 : 1;
    const data = new TestData({ id, name, value });
    await data.save();
    // remove _id and __v from the response
    data.id = data._id;
    delete data._id;
    delete data.__v;
    res.send(data);
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Please upload a file" });
    }
    res.status(200).json({
        message: "File uploaded successfully",
        filename: req.file.filename,
    });
});

app.get("/imagelist", (req, res) => {
    fs.readdir("images", (err, files) => {
        if (err) {
            return res.status(500).send("Unable to scan directory");
        }
        res.send(files);
    });
});

app.delete("/image/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "images", filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).send("Failed to delete file");
        }
        res.status(200).send("File deleted successfully");
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
