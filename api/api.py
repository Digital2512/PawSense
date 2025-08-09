from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
from pawsense.behaviour_prediction.model import predict
import os

app = Flask(__name__)
CORS(app)

@app.route('/predict_chain', methods=["POST"])
def predict_chain():
    data = request.json
    current_activity = data.get('current_activity')
    current_activity_time = data.get('last_activity_time')

    if not current_activity:
        return jsonify({'error': 'No Current Activity Provided'})
    
    if not current_activity_time:
        return jsonify({'error': 'No Last Activity Time Provided'})
    
    try:
        last_activity_time = datetime.fromisoformat(current_activity_time)
        now = datetime.now(timezone.utc)
        minutes_since_last = (now - last_activity_time).total_seconds()/60
    except Exception:
        return jsonify({'error': 'Invalid last_activity_time format'}), 400
    
    predictions = predict(current_activity, current_activity_time, max_depth=6)

    result = []
    for activity, time_to_next, prob in predictions[1:]:
        result.append({
            'next_activity': activity,
            'time_to_next_minutes': time_to_next,
            'probability': prob
        })

    return jsonify({'predictions': result})

@app.route('/predict_next', methods=["POST"])
def predict_next():
    data = request.json
    current_activity = data.get('current_activity')
    current_activity_time = data.get('last_activity_time')

    if not current_activity:
        return jsonify({'error': 'No Current Activity Provided'})
    
    if not current_activity_time:
        return jsonify({'error': 'No Last Activity Time Provided'})
    
    try:
        last_activity_time = datetime.fromisoformat(current_activity_time)
        now = datetime.now(timezone.utc)
        minutes_since_last = (now - last_activity_time).total_seconds()/60
    except Exception:
        return jsonify({'error': 'Invalid last_activity_time format'}), 400
    
    predictions = predict(current_activity, current_activity_time)

    result = []
    for activity, time_to_next, prob in predictions[1:]:
        result.append({
            'next_activity': activity,
            'time_to_next_minutes': time_to_next,
            'probability': prob
        })

    return jsonify({'predictions': result})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port or default to 5000 locally
    app.run(host="0.0.0.0", port=port, debug=True)