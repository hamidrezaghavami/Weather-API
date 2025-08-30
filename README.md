# Weather API Wrapper Service

A Node.js-based API that fetches and returns weather data from a third-party provider, incorporating caching with Redis and rate limiting using express-rate-limit.

## 🚀 Features
	•	Third-Party API Integration: Retrieves weather data from Visual Crossing’s free API.
	•	Caching with Redis: Implements in-memory caching to reduce redundant API calls.
	•	Rate Limiting: Protects the API from abuse by limiting requests per IP.
	•	Environment Variables: Utilizes .env files for sensitive configurations.

## 🔧 Technologies Used
	•	Node.js (v22.18.0)
	•	Express.js
	•	Redis
	•	axios
	•	express-rate-limit

## ⚙️ Setup
	1.	Clone the repository:
 git clone https://github.com/yourusername/weather-api-wrapper-service.git
 cd weather-api-wrapper-service
install dependencies and Create a .env file and add your API key:
API_KEY=your_visual_crossing_api_key
start the server: npm start
The API will be available at http://localhost:3000.

## 📄 Endpoints
	•	GET /weather?location={city_name}: Returns current weather data for the specified location.

 ## 🔐 Rate Limiting
	•	Window: 15 minutes
	•	Max Requests: 100 per IP

 ## 🧪 Testing:
curl "http://localhost:3000/weather?location=Istanbul"

To test the API: curl "http://localhost:3000/weather?location=Istanbul"
project file: [Link](https://roadmap.sh/projects/weather-api-wrapper-service)
