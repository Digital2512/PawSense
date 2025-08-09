import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(BASE_DIR, "pet_activity_simulation.csv")

df = pd.read_csv(csv_path)
df['start_time'] = pd.to_datetime(df['start_time'])
df = df.sort_values('start_time')

df['next_activity'] = df['activity'].shift(-1)
df['next_start_time'] = df['start_time'].shift(-1)
df['time_to_next_activity'] = (df['next_start_time'] - df['start_time']).dt.total_seconds() / 60

df = df[:-1]

transition_stats = df.groupby(['activity', 'next_activity']).agg({'time_to_next_activity': 'mean', 'next_activity': 'count'}).rename(columns = {'next_activity': 'count'}).reset_index()

total_counts = transition_stats.groupby('activity')['count'].transform('sum')
transition_stats['probability'] = transition_stats['count'] / total_counts

print(transition_stats)

def predict_next_activity(current_activity):
    subset = transition_stats[transition_stats['activity'] == current_activity]
    if subset.empty:
        return None, None

    prediction = subset.loc[subset['probability'].idxmax()]
    return prediction['next_activity'], prediction['time_to_next_activity']

current_activity = "Feeding"
next_activity, time_to_next = predict_next_activity(current_activity)

if next_activity:
    print(f"Alert: Your dog is likely to {next_activity} in about {int(time_to_next)} minutes!")
else:
    print("No prediction available")