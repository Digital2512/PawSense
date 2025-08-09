# from flask import Flask, request, jsonify, render_template_string
import random
from datetime import datetime, timezone

# --- Available values for manual selection ---
possible_values = {
    {
        "Neutral": {
            "size": ["Small", "Medium", "Large"],
            "age_group": ["Puppy", "Adult", "Senior"],
            "heart_rate": ["Small", "Medium", "Large"],
            "tail_wag_speed": list(range(60, 181, 0.1)),
            "tail_wag_amplitude": list(range(30, 60)),
            "tail_position": ["Neutral"],
            "tail_stiffness": ["Loose"],
            "wag_direction": ["Neutral", "Right_Slight"],
            "bark_pitch": ["Small", "Medium", "Large"],
            "bark_loudness": ["Small", "Medium", "Large"],
            "bark_duration": list(range(0, 0.5, 0.01)),
            "posture": ["Relaxed", "Standing", "Lying"],
            "head_tilt": ["None"],
            "context": ["Home", "Rest"]
        },
        "Excited": {
            #code here
        },
        "Sad": {
            #code here
        }
        # Continue code here

    }
}

# # HTML UI for manual/random selection
# html_form = """
# <!DOCTYPE html>
# <html>
# <head>
#     <title>Fake Smart Collar</title>
# </head>
# <body>
#     <h2>Fake Smart Collar - Data Generator</h2>
#     <form action="/data" method="post">
#         {% for var, values in possible_values.items() %}
#             <label>{{ var }}:</label>
#             {% if values|length > 10 %}
#                 <select name="{{ var }}">
#                     {% for v in values %}
#                         <option value="{{ v }}">{{ v }}</option>
#                     {% endfor %}
#                 </select>
#             {% else %}
#                 <select name="{{ var }}">
#                     <option value="random">Random</option>
#                     {% for v in values %}
#                         <option value="{{ v }}">{{ v }}</option>
#                     {% endfor %}
#                 </select>
#             {% endif %}
#             <br><br>
#         {% endfor %}
#         <button type="submit" name="mode" value="manual">Submit</button>
#     </form>
#     <br>
#     <form action="/data" method="post">
#         <button type="submit" name="mode" value="random">Generate Completely Random Data</button>
#     </form>
# </body>
# </html>
# """

# Helper: generate random dataset
def retrieve_client_data():
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "bark_pitch": random.choice(possible_values["bark_pitch"]),
        "bark_volume": random.choice(possible_values["bark_volume"]),
        "bark_duration": random.choice(possible_values["bark_duration"]),
        "location": random.choice(possible_values["location"]),
        "tail_wag_frequency": random.choice(possible_values["tail_wag_frequency"]),
        "tail_wag_amplitude": random.choice(possible_values["tail_wag_amplitude"]),
        "heart_rate_bpm": random.choice(possible_values["heart_rate_bpm"]),
        "time_of_day": random.choice(possible_values["time_of_day"]),
        "body_position": random.choice(possible_values["body_position"]),
        "head_tilt": random.choice(possible_values["head_tilt"])
    }

# Initial page when request is detected
# @app.route("/", methods=["GET"])
# def home():
#     return render_template_string(html_form, possible_values=possible_values)

# # Returns data as a JSON back to caller
# @app.route("/data", methods=["POST"])
# def get_data_both():
#     # mode is random or manual
#     mode = request.form.get("mode")
#     current_data = generate_random_data()
#     if mode == "manual":
#         for var, values in possible_values.items():
#             val = request.form.get(var)
#             if val == "random":
#                 current_data[var] = random.choice(values)
#             else:
#                 try:
#                     current_data[var] = int(val)
#                 except ValueError:
#                     current_data[var] = val
#         current_data["timestamp"] = datetime.now(timezone.utc).isoformat()
#     return jsonify(current_data)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", debug=True)
# if __name__ == "__main__":
#     app.run(debug=True)

