import requests

request = requests.get('http://127.0.0.1:8000/')
print(request.json())

response = requests.get('http://127.0.0.1:8000/api')
if response.status_code == 200:
   print(response.json())
else:
 print(f"Error: {response.status_code},{response.text}")
