```prompt
---
mode: 'agent'
model: GPT-4.1
description: 'Update Django backend files for MongoDB, CORS, and API scaffolding'
---

# Django App Updates

- All Django project files are in the `octofit-tracker/backend/octofit_tracker` directory.

1. Update `settings.py` to configure the MongoDB connection (via Djongo) and add the required CORS support entries.
2. Update `models.py`, `serializers.py`, `urls.py`, `views.py`, `tests.py`, and `admin.py` to support users, teams, activities, leaderboard, and workouts collections.
3. Ensure the root path `/` points to the API, and include an `api_root` entry in `urls.py`.
```
