from flask import Flask, jsonify, send_from_directory
import os

# 1. Setup Flask
# static_folder='.' means "Look in the current folder"
app = Flask(__name__, static_folder='.', static_url_path='')

# 2. Serve the Homepage
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# 3. The API: Scan folders for images
@app.route('/api/photos/<category>')
def get_photos(category):
    # Path: current_folder / images / category
    folder_path = os.path.join(os.getcwd(), 'images', category)

    if not os.path.exists(folder_path):
        return jsonify([]) # Return empty list if folder is missing

    files = os.listdir(folder_path)
    
    # Filter for image files only
    images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    return jsonify(images)

# --- DEBUG TOOL (DELETE THIS LATER) ---
@app.route('/debug')
def debug_server():
    import os
    file_structure = []
    # Walk through the entire folder structure
    for root, dirs, files in os.walk('.'):
        for name in files:
            # Add the full path to the list
            file_structure.append(os.path.join(root, name))
    return jsonify(file_structure)

if __name__ == '__main__':
    print("Server is running at http://localhost:5000")
    app.run(debug=True, port=5000)