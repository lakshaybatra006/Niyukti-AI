import sys
import json
import joblib
import pandas as pd

import os
model_path = os.path.join(os.path.dirname(__file__), "fraud_model.pkl")
model = joblib.load(model_path)
input_data = sys.stdin.read()
features = json.loads(input_data)

# FORCE correct column order (VERY IMPORTANT)
columns = [
    "skillCount",
    "projectCount",
    "experience",
    "resumeLength",
    "aiKeywordCount",
    "mlKeywordCount"
]

df = pd.DataFrame([[features[c] for c in columns]], columns=columns)

prob = model.predict_proba(df)[0][1]

print(json.dumps({
    "fraudProbability": float(prob)
}))