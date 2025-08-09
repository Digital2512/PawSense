from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from behaviour_prediction.model import predict_next_activity
from client import retrieve_client_data

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=["POST"])
def predict():
    data = request.json
    current_activity = data.get('current_activity')
    if not current_activity:
        return jsonify({'error': 'No Current Activity Provided'})
    
    next_activity, time_to_next = predict_next_activity(current_activity)
    return jsonify({
        'next_activity': next_activity,
        'time_to_next_minutes': time_to_next
    })

# Returns data fromt he client as a JSON back to caller
@app.route("/data", methods=["GET"])
def get_data():
    client_data = retrieve_client_data()
    return jsonify(client_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)