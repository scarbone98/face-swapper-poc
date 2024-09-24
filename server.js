const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Set up multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const workflowJson = JSON.parse(fs.readFileSync('expression-changer-api-format.json', 'utf8'));

// API endpoint to process the image
app.post('/process-image', upload.single('image'), async (req, res) => {
    try {
        // Check if file is provided
        if (!req.file) {
            return res.status(400).send({ error: 'No image file provided' });
        }

        // Save the uploaded image temporarily
        const inputImagePath = path.join(__dirname, 'temp_input.png');
        fs.writeFileSync(inputImagePath, req.file.buffer);  // Save the buffer as a PNG file

        // Update the workflow to use the input image
        workflowJson["15"].inputs.image = inputImagePath;

        // Send the workflow to ComfyUI
        const response = await fetch('http://localhost:8188/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: workflowJson })
        });

        if (!response.ok) {
            throw new Error(`ComfyUI responded with ${response.status}: ${response.statusText}`);
        }

        const { prompt_id } = await response.json();

        // Poll for the result
        let result;
        while (!result) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            const historyResponse = await fetch('http://localhost:8188/history');
            const history = await historyResponse.json();
            result = history[prompt_id];
        }

        // Get the output image
        const outputImageNode = result.outputs['34']; // Node ID for PreviewImage
        if (outputImageNode && outputImageNode.images.length > 0) {
            const outputImageName = outputImageNode.images[0];

            // Fetch the image from the ComfyUI server
            const outputImageResponse = await fetch(`http://127.0.0.1:8188/view?filename=${outputImageName.filename}&type=${outputImageName.type}`);
            const outputImageBuffer = await outputImageResponse.arrayBuffer(); // ArrayBuffer for binary data

            // Clean up temporary files
            fs.unlinkSync(inputImagePath);

            // Send the processed image as binary data
            res.set('Content-Type', 'image/png');
            res.send(Buffer.from(outputImageBuffer)); // Send the image buffer directly
        } else {
            // Clean up temporary files
            fs.unlinkSync(inputImagePath);
            throw new Error('No output image found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to process the image: ' + err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
