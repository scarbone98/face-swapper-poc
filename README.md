# AI Facial Expression Changer

This project is a web application that allows users to upload an image, select a region of a face, and change the facial expression using AI. It uses a Node.js backend with Express.js and integrates with ComfyUI for AI-powered facial expression manipulation.

## Features

- Upload and display images in the browser
- Select a specific region of the image using a draggable selection box
- Send the selected region to the backend for processing
- Use ComfyUI to change the facial expression of the selected region
- Display the modified image with the new facial expression

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12 or higher)
- ComfyUI set up and running locally

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-facial-changer
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Make sure ComfyUI is running on `http://localhost:8188`.

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:3000`.

3. Upload an image using the file input.

4. Use your mouse to drag and select the region of the face you want to modify.

5. Click the "Send Selected Region to API" button to process the image.

6. The modified image with the new facial expression will be displayed on the canvas.

## Project Structure

- `server.js`: The main Express.js server file
- `public/index.html`: The frontend HTML file with JavaScript for image handling
- `expression-changer-api-format.json`: ComfyUI workflow configuration

## Dependencies

- express: Web server framework
- multer: Middleware for handling multipart/form-data
- canvas: Image processing library
- axios: HTTP client for making requests
- form-data: Library for creating form data

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page] if you want to contribute.

## License

This project is licensed under the ISC License.
