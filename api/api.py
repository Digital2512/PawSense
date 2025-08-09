from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
from pawsense.behaviour_prediction.model import predict_chain

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=["POST"])
def predict():
    data = request.json
    current_activity = data.get('current_activity')
    last_activity_time_str = data.get('last_activity_time')

    if not current_activity:
        return jsonify({'error': 'No Current Activity Provided'})
    
    if not last_activity_time_str:
        return jsonify({'error': 'No Last Activity Time Provided'})
    
    try:
        last_activity_time = datetime.fromisoformat(last_activity_time_str)
        now = datetime.now(timezone.utc)
        minutes_since_last = (now - last_activity_time).total_seconds()/60
    except Exception:
        return jsonify({'error': 'Invalid last_activity_time format'}), 400
    
    predictions = predict_chain(current_activity)

    top_3 = predictions[:3]

    result = []
    for activity, time_to_next, prob in top_3:
        result.append({
            'next_activity': activity,
            'time_to_next_minutes': time_to_next,
            'probability': prob
        })

    return jsonify({'predictions': result})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port or default to 5000 locally
    app.run(host="0.0.0.0", port=port, debug=True)