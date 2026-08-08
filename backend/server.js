const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// =====================================================
// FIREBASE
// =====================================================

const { initializeApp, cert } = require("firebase-admin/app");

const {
    getFirestore,
    FieldValue
} = require("firebase-admin/firestore");

const serviceAccount =
    require("./firebase-service-account.json");

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

console.log("Firebase connected successfully");

// =====================================================
// GEMINI CONFIGURATION
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// =====================================================
// MULTER / FILE UPLOAD CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [

            "application/pdf",

            "image/jpeg",

            "image/png"

        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only PDF, JPG and PNG files are allowed"
                )
            );

        }

    }

});

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.send("DocTrust AI Backend Running");

});

// =====================================================
// BACKEND CONNECTION TEST
// =====================================================

app.get("/api/hello", (req, res) => {

    res.json({

        success: true,

        message: "Backend is reachable"

    });

});

// =====================================================
// GEMINI CONNECTION TEST
// =====================================================

app.get("/api/test-gemini", async (req, res) => {

    try {

        const response =
            await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents:
                    "Reply with exactly: Gemini connection successful"

            });

        res.json({

            success: true,

            message: response.text

        });

    } catch (error) {

        console.error(
            "Gemini Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Gemini connection failed",

            error:
                error.message

        });

    }

});

// =====================================================
// DOCUMENT VERIFICATION
// =====================================================

app.post(
    "/api/verify",
    upload.single("document"),
    async (req, res) => {

        try {

            // =================================================
            // 1. CHECK FILE
            // =================================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No document uploaded"

                });

            }

            console.log(
                "File received:",
                req.file.originalname
            );

            // =================================================
            // 2. READ FILE
            // =================================================

            const filePath =
                req.file.path;

            const fileData =
                fs.readFileSync(filePath);

            // =================================================
            // 3. GENERATE SHA-256 HASH
            // =================================================

            const documentHash =
                crypto
                    .createHash("sha256")
                    .update(fileData)
                    .digest("hex");

            console.log(
                "Document Hash:",
                documentHash
            );

            // =================================================
            // 4. CHECK DUPLICATE IN FIRESTORE
            // =================================================

            const duplicateSnapshot =
                await db
                    .collection("verifications")
                    .where(
                        "documentHash",
                        "==",
                        documentHash
                    )
                    .limit(1)
                    .get();

            if (!duplicateSnapshot.empty) {

                console.log(
                    "Duplicate document detected"
                );

                return res.json({

                    success: true,

                    message:
                        "Duplicate document detected",

                    verification: {

                        status:
                            "DUPLICATE",

                        missingFields: [],

                        validationErrors: [

                            "This document has already been verified"

                        ]

                    },

                    file: {

                        originalName:
                            req.file.originalname,

                        type:
                            req.file.mimetype,

                        size:
                            req.file.size,

                        hash:
                            documentHash

                    }

                });

            }

            // =================================================
            // 5. CONVERT FILE TO BASE64
            // =================================================

            const base64Data =
                fileData.toString("base64");

            // =================================================
            // 6. GEMINI PROMPT
            // =================================================

            const prompt = `

You are a professional document information extraction system.

Analyze the uploaded document carefully.

Extract ONLY the information that is actually present.

Return ONLY valid JSON.

Use exactly this structure:

{
    "documentType": null,
    "name": null,
    "documentNumber": null,
    "organization": null,
    "issueDate": null,
    "expiryDate": null,
    "missingFields": []
}

Rules:

1. Never invent information.
2. If information is not present, return null.
3. Add important missing information to missingFields.
4. Convert dates to YYYY-MM-DD whenever possible.
5. Return ONLY JSON.

`;

            // =================================================
            // 7. SEND DOCUMENT TO GEMINI
            // =================================================

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-2.5-flash",

                    contents: [

                        {
                            text: prompt
                        },

                        {
                            inlineData: {

                                mimeType:
                                    req.file.mimetype,

                                data:
                                    base64Data

                            }

                        }

                    ]

                });

            // =================================================
            // 8. PROCESS GEMINI RESPONSE
            // =================================================

            let result =
                response.text;

            console.log(
                "Gemini Raw Response:",
                result
            );

            result =
                result
                    .replace(
                        /```json/g,
                        ""
                    )
                    .replace(
                        /```/g,
                        ""
                    )
                    .trim();

            // =================================================
            // 9. PARSE JSON
            // =================================================

            let extractedData;

            try {

                extractedData =
                    JSON.parse(result);

            } catch (jsonError) {

                console.error(
                    "JSON Parsing Error:",
                    jsonError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Gemini returned invalid JSON",

                    rawResponse:
                        result

                });

            }

            // =================================================
            // VALIDATION ENGINE
            // =================================================

            // =================================================
            // 10. REQUIRED FIELDS
            // =================================================

            const requiredFields = [

                "documentType",

                "name",

                "documentNumber",

                "organization",

                "issueDate"

            ];

            const missingFields = [];

            for (
                const field
                of requiredFields
            ) {

                if (
                    !extractedData[field] ||
                    extractedData[field]
                        .toString()
                        .trim() === ""
                ) {

                    missingFields.push(
                        field
                    );

                }

            }

            // =================================================
            // 11. VALIDATION ERRORS
            // =================================================

            const validationErrors = [];

            // =================================================
            // 12. ISSUE DATE VALIDATION
            // =================================================

            if (
                extractedData.issueDate
            ) {

                const issueDate =
                    new Date(
                        extractedData.issueDate
                    );

                if (
                    isNaN(
                        issueDate.getTime()
                    )
                ) {

                    validationErrors.push(
                        "Invalid issue date"
                    );

                }

            }

            // =================================================
            // 13. EXPIRY DATE VALIDATION
            // =================================================

            if (
                extractedData.expiryDate
            ) {

                const expiryDate =
                    new Date(
                        extractedData.expiryDate
                    );

                if (
                    isNaN(
                        expiryDate.getTime()
                    )
                ) {

                    validationErrors.push(
                        "Invalid expiry date"
                    );

                }

            }

            // =================================================
            // 14. CHECK EXPIRY
            // =================================================

            if (
                extractedData.expiryDate
            ) {

                const expiryDate =
                    new Date(
                        extractedData.expiryDate
                    );

                const today =
                    new Date();

                if (
                    expiryDate < today
                ) {

                    validationErrors.push(
                        "Document has expired"
                    );

                }

            }

            // =================================================
            // 15. DOCUMENT NUMBER VALIDATION
            // =================================================

            if (
                extractedData.documentNumber
            ) {

                const documentNumber =
                    extractedData.documentNumber
                        .toString()
                        .trim();

                if (
                    documentNumber.length < 4
                ) {

                    validationErrors.push(
                        "Document number appears invalid"
                    );

                }

            }

            // =================================================
            // 16. FINAL STATUS
            // =================================================

            let status =
                "VERIFIED";

            if (
                missingFields.length > 0
            ) {

                status =
                    "NEEDS_REVIEW";

            }

            if (
                validationErrors.length > 0
            ) {

                status =
                    "NEEDS_REVIEW";

            }

            // =================================================
            // 17. SAVE TO FIRESTORE
            // =================================================

            const verificationData = {

                documentHash:
                    documentHash,

                originalFileName:
                    req.file.originalname,

                fileType:
                    req.file.mimetype,

                fileSize:
                    req.file.size,

                documentType:
                    extractedData.documentType,

                name:
                    extractedData.name,

                documentNumber:
                    extractedData.documentNumber,

                organization:
                    extractedData.organization,

                issueDate:
                    extractedData.issueDate,

                expiryDate:
                    extractedData.expiryDate,

                status:
                    status,

                missingFields:
                    missingFields,

                validationErrors:
                    validationErrors,

                createdAt:
                    FieldValue.serverTimestamp()

            };

            const docRef =
                await db
                    .collection("verifications")
                    .add(
                        verificationData
                    );

            console.log(
                "Verification saved:",
                docRef.id
            );

            // =================================================
            // 18. FINAL RESPONSE
            // =================================================

            res.json({

                success: true,

                message:
                    "Document processed successfully",

                verification: {

                    id:
                        docRef.id,

                    status:
                        status,

                    missingFields:
                        missingFields,

                    validationErrors:
                        validationErrors

                },

                file: {

                    originalName:
                        req.file.originalname,

                    type:
                        req.file.mimetype,

                    size:
                        req.file.size,

                    hash:
                        documentHash

                },

                extractedData:
                    extractedData

            });

        } catch (error) {

            console.error(
                "Document Processing Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Document processing failed",

                error:
                    error.message

            });

        }

    }
);
// =====================================================
// GET VERIFICATION HISTORY
// =====================================================

app.get("/api/verifications", async (req, res) => {

    try {

        const snapshot = await db
            .collection("verifications")
            .orderBy("createdAt", "desc")
            .limit(50)
            .get();

        const verifications = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            verifications.push({

                id: doc.id,

                documentHash:
                    data.documentHash,

                originalFileName:
                    data.originalFileName,

                documentType:
                    data.documentType,

                name:
                    data.name,

                documentNumber:
                    data.documentNumber,

                organization:
                    data.organization,

                issueDate:
                    data.issueDate,

                expiryDate:
                    data.expiryDate,

                status:
                    data.status,

                missingFields:
                    data.missingFields || [],

                validationErrors:
                    data.validationErrors || [],

                createdAt:
                    data.createdAt
                        ? data.createdAt.toDate().toISOString()
                        : null

            });

        });

        res.json({

            success: true,

            count: verifications.length,

            verifications: verifications

        });

    } catch (error) {

        console.error(
            "History Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not fetch verification history",

            error:
                error.message

        });

    }

});
// =====================================================
// DASHBOARD STATISTICS
// =====================================================

app.get("/api/dashboard/stats", async (req, res) => {

    try {

        const snapshot = await db
            .collection("verifications")
            .get();

        let total = 0;
        let verified = 0;
        let duplicate = 0;
        let needsReview = 0;

        snapshot.forEach((doc) => {

            const data = doc.data();

            total++;

            if (data.status === "VERIFIED") {
                verified++;
            }

            if (data.status === "DUPLICATE") {
                duplicate++;
            }

            if (data.status === "NEEDS_REVIEW") {
                needsReview++;
            }

        });

        res.json({

            success: true,

            statistics: {

                totalDocuments: total,

                verified: verified,

                duplicate: duplicate,

                needsReview: needsReview

            }

        });

    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not fetch dashboard statistics",

            error:
                error.message

        });

    }

});
// =====================================================
// ADD AUTHORIZED RECORD
// =====================================================

app.post("/api/authorized-records", async (req, res) => {

    try {

        const {
            documentNumber,
            name,
            organization,
            documentType
        } = req.body;

        // Check required fields

        if (
            !documentNumber ||
            !name ||
            !organization ||
            !documentType
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }

        // Save record

        const record = {

            documentNumber:
                documentNumber.trim(),

            name:
                name.trim(),

            organization:
                organization.trim(),

            documentType:
                documentType.trim(),

            createdAt:
                FieldValue.serverTimestamp()

        };

        const docRef =
            await db
                .collection("authorizedRecords")
                .add(record);

        res.json({

            success: true,

            message:
                "Authorized record added successfully",

            recordId:
                docRef.id,

            record:
                record

        });

    } catch (error) {

        console.error(
            "Authorized Record Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not create authorized record",

            error:
                error.message

        });

    }

});

// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);
