import os
import pandas as pd
from datetime import datetime, timedelta
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(BASE_DIR, "pet_activity_simulation.csv")

df = pd.read_csv(csv_path)

df['start_time'] = pd.to_datetime(df['start_time'])

def time_to_seconds(t):
    return t.hour * 3600 + t.minute * 60 + t.second

df['start_seconds'] = df['start_time'].dt.time.apply(time_to_seconds)

avg_seconds = df.groupby('activity')['start_seconds'].mean()

def seconds_to_hms(seconds):
    seconds = int(seconds)
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"

def predict_day():
    avg_times_list = []
    for activity, avg_sec in avg_seconds.items():
        avg_times_list.append({
            'activity': activity,
            'average_start_time': seconds_to_hms(avg_sec)
        })

    print(avg_times_list)
    return avg_times_list
