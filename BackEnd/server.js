const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const multer = require("multer");
const { getFirestore } = require("firebase-admin/firestore");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle new lines in the key
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "your-firebase-storage-bucket", // Replace with your Firebase Storage bucket name
});

const db = getFirestore();
const auth = admin.auth();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register endpoint
app.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        res.status(201).json({ message: "User registered successfully", user: userRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (userRecord) {
            res.status(200).json({ message: "Login successful", user: userRecord });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add Product endpoint
app.post("/add-product", upload.array("images", 10), async (req, res) => {
    const { productName, productDescription, price, userId } = req.body;
    const images = req.files; // Access uploaded files

    try {
        // Check if at least 3 images are uploaded
        if (!productName || !productDescription || !price || images.length < 3) {
            return res.status(400).json({ error: "All fields are required, including at least 3 images." });
        }

        // Here, you can handle the image upload to your storage (Firebase Storage, AWS S3, etc.)
        const imageUrls = []; // Array to hold URLs of uploaded images
        for (const image of images) {
            // For demo purposes, this just simulates the URL storage.
            // Replace this with actual upload logic (to Firebase Storage or similar)
            const fileName = `${Date.now()}-${image.originalname}`;
            // Simulate saving file URL
            imageUrls.push(`https://your-storage-url/${fileName}`);
        }

        // Save product data to Firestore
        await db.collection("AddProduct").add({
            productName,
            productDescription,
            price,
            userId,
            images: imageUrls, // Store the URLs of uploaded images
        });

        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({ error: "Failed to add product: " + error.message });
    }
});

// Products endpoint
app.get("/products", async (req, res) => {
    try {
        // Fetch products from Firebase or use mock data
        const snapshot = await admin.firestore().collection('AddProduct').get();
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
