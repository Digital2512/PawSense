from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from behaviour_prediction.model import predict_next_activity
from fake_smart_collar_client import generate_random_data, html_form, possible_values, mode

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

# Initial page when request is detected
@app.route("/", methods=["GET"])
def home():
    return render_template_string(html_form, possible_values=possible_values)

# Returns data as a JSON back to caller
@app.route("/data", methods=["GET"])
def get_data():
    # mode is random or manual
    mode = request.form.get("mode")
    current_data = generate_random_data()
    if mode == "manual":
        for var, values in possible_values.items():
            val = request.form.get(var)
            if val == "random":
                current_data[var] = random.choice(values)
            else:
                try:
                    current_data[var] = int(val)
                except ValueError:
                    current_data[var] = val
        current_data["timestamp"] = datetime.now(timezone.utc).isoformat()
    return jsonify(current_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)