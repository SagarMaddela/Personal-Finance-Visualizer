const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) and PDF files are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Route to upload and process receipt
router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';

    if (fileExtension === '.pdf') {
      // Process PDF file
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else {
      // Process image file using OCR
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m)
      });
      extractedText = result.data.text;
    }

    // Clean up the uploaded file
    await fs.remove(filePath);

    // Extract potential transaction items from text
    const extractedItems = extractTransactionItems(extractedText);

    res.json({
      success: true,
      originalText: extractedText,
      extractedItems: extractedItems
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ error: 'Error processing receipt' });
  }
});

// Function to extract potential transaction items from text
function extractTransactionItems(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const items = [];
  
  // Common patterns for receipt items
  const patterns = [
    // Pattern: item name followed by price (e.g., "Coffee $3.50")
    /^([A-Za-z\s]+)\s*[\$₹]?\s*(\d+\.?\d*)/,
    // Pattern: price followed by item name (e.g., "$3.50 Coffee")
    /[\$₹]?\s*(\d+\.?\d*)\s*([A-Za-z\s]+)/,
    // Pattern: item with quantity and price (e.g., "2x Coffee $7.00")
    /(\d+)x?\s*([A-Za-z\s]+)\s*[\$₹]?\s*(\d+\.?\d*)/,
    // Pattern: simple item and price (e.g., "Bread 2.99")
    /^([A-Za-z\s]+)\s+(\d+\.?\d*)$/
  ];

  lines.forEach(line => {
    for (let pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let itemName, amount;
        
        if (match.length === 3) {
          // Standard pattern: item and price
          itemName = match[1].trim();
          amount = parseFloat(match[2]);
        } else if (match.length === 4) {
          // Pattern with quantity
          itemName = match[2].trim();
          amount = parseFloat(match[3]);
        }

        if (itemName && amount && amount > 0 && amount < 10000) {
          items.push({
            description: itemName,
            amount: amount,
            category: '' // User will select category
          });
        }
        break;
      }
    }
  });

  // If no items found with patterns, try to extract any numbers as potential amounts
  if (items.length === 0) {
    const numberPattern = /(\d+\.?\d*)/g;
    const numbers = text.match(numberPattern);
    if (numbers) {
      numbers.forEach(num => {
        const amount = parseFloat(num);
        if (amount > 0 && amount < 10000) {
          items.push({
            description: 'Extracted Item',
            amount: amount,
            category: ''
          });
        }
      });
    }
  }

  return items;
}

module.exports = router; 