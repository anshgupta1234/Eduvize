# Eduvize

Eduvize is an app for iOS and Android designed to incentivize students to continue learning - even when not required by teachers.

Eduvize works by allowing students to integrate the independent learning app of their choice, like Khan Academy or Duolingo, to their Eduvize account. Eduvize then monitors the student's progress in all of their connected apps and awards them tokens accordingly. These tokens can be used to purchase real gift cards or make in-app purchases. Eduvize also can use the data it collects on each student in order to effectively suggest other content for students to learn or practice based on what other similar users study. This helps keep students interested in learning!

## Backend Structure

#### GET "/":
The basic webpage with minimal information on how our product works.

### Authentication Layout:

#### POST "/auth/register/":
```{"display_name": "Eric", "email": "eric@gmail.com", "password": "password"}```
This will create a user in the database and return a sessionId cookie to use for auth in all other webhooks.

#### POST "/auth/login/":
```{"email": "eric@gmail.com", "password": "password"}```
This will find your user in the database and log you in and return a sessionId cookie to use for auth in all other webhooks.

#### GET/POST "/auth/logout":
This clears your app's saved cookies and logs you out of your account.

#### GET "/auth/web_profile/":
Returns your linked email account.

### API Integrations:

#### GET "/api/ka":
Redirects the client to the Khan Academy website which uses oauth and returns to our callback url. Used to link your Eduvize account to Khan Academy.

#### GET "/api/ca?username=placeholder":
Searches Codeacademy for a matching username, and if one matches it adds that username to your Eduvize account.

#### POST "/api/duolingo":
```{"username": "placeholder"}```
Saves your duolingo username to the database and then prompts you to join the Eduvize Duolingo class to share your progress.

#### GET "/api/nt?q=placeholder":
Searches Nitrotype for users with similar usernames and prompts you to select which one is yours.

#### POST "/api/nt":
```{"accountId": "placeholder"}```
Use this webhook to send the server your chose Nitrotype ID from the previous request.

#### GET "/api/update":
Fetches the current point data for all attached services to the logged in user and returns points for each.

#### GET "/api/lb":
Displays the current leaderboard of points for all top users along with their display names.

### Machine Learning Recommendations:

#### GET "/explore/train/":
GET this url in order to retrain the ML model.

#### POST "/explore/recommend/":
This webhook analyzes as much data it can from your account, including what language you are learning on Duolingo and what courses you are taking on Khan Academy in order to recommend further resources to you that are relevant to what you are doing.

## Frontend Structure

### Explore Tab:
The explore tab helps users find new areas to explore on Khan academy using /explore

### Dashboard Tab:
Shows a summary of tokens earned and is the portal for connecting new services. Accomplished mainly through /api/ka. Uses Expo's Web Browser to redirect with OAuth

### Leaderboard Tab:
Shows most amount of tokens earned with react-native-leaderboard. Uses /api/lb to pull this data.

### Store Tab:
Mainly for style, not actually implemented yet.
