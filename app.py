from flask import Flask, request, render_template
import openai, os
from dotenv import load_dotenv

app = Flask(__name__)

# Set your OpenAI API key
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = openai.Client(OPENAI_API_KEY)


assistant = client.beta.assistants.create(
    name=""

)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.form['user_input']

    # Call the OpenAI API to get a response
    response = openai.Ccreate(
        engine="gpt3.5",
        prompt=user_input,
        max_tokens=150  # Adjust as needed
    )

    chatbot_response = response['choices'][0]['text'].strip()
    return chatbot_response

if __name__ == '__main__':
    app.run(debug=True)
