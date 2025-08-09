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

def predict_chain(current_activity, current_activity_start, max_depth=2):
    """
    Predicts chains of activities up to max_depth starting from current_activity.

    Returns a list of tuples:
    [(activity_1, start_time_1), (activity_2, start_time_2), ...]
    """
    results = []

    def helper(activity, start_time, depth):
        if depth > max_depth:
            return
        subset = transition_stats[transition_stats['activity'] == activity]
        if subset.empty:
            return
        for _, row in subset.iterrows():
            next_act = row['next_activity']
            duration = row['time_to_next_activity']
            next_start = start_time + pd.to_timedelta(duration, unit='m')
            results.append((next_act, next_start))
            helper(next_act, next_start, depth + 1)

    helper(current_activity, current_activity_start, 1)
    return results

current_activity = "Feeding"
current_activity_start = pd.Timestamp('2025-08-09 15:00:00')
now = pd.Timestamp('2025-08-09 15:20:00')  # Current real time, e.g. could be now()

df_predictions = predict_chain(current_activity, current_activity_start, max_depth=6)

if df_predictions:
    for activity, start_time in df_predictions:
        print(f"{activity} at {start_time}")
else:
    print("No predictions available.")
