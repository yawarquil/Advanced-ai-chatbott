import os
import requests
from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv
import io

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)

# Get the API key from environment variables
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

# Define the model endpoints
model_endpoints = {
    'stable-diffusion-v1-5': 'runwayml/stable-diffusion-v1-5',
    'stable-diffusion-xl-base-1.0': 'stabilityai/stable-diffusion-xl-base-1.0',
}

@app.route("/api/generate-image", methods=["POST"])
def generate_image():
    """
    This endpoint receives a prompt and a model, then calls the appropriate
    image generation service and returns the image.
    """
    data = request.get_json()
    prompt = data.get("prompt")
    model = data.get("model")

    if not prompt or not model:
        return jsonify({"error": "Prompt and model are required"}), 400

    if model in model_endpoints:
        if not HF_API_KEY:
            return jsonify({"error": "Hugging Face API key is not configured on the server."}), 500
        
        endpoint = model_endpoints[model]
        api_url = f"https://api-inference.huggingface.co/models/{endpoint}"
        headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        payload = {"inputs": prompt}

        try:
            response = requests.post(api_url, headers=headers, json=payload)
            if response.status_code == 200 and response.headers.get("Content-Type") == "image/jpeg":
                return send_file(io.BytesIO(response.content), mimetype='image/jpeg')
            else:
                return jsonify({"error": "Failed to generate image from Hugging Face", "details": response.text}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif model == "pollinations":
        try:
            encoded_prompt = requests.utils.quote(prompt)
            pollinations_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            response = requests.get(pollinations_url)
            if response.status_code == 200:
                return send_file(io.BytesIO(response.content), mimetype='image/jpeg')
            else:
                return jsonify({"error": "Pollinations API failed"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid model specified"}), 400

if __name__ == "__main__":
    # The server will run on port 5001
    app.run(host="0.0.0.0", port=5001)