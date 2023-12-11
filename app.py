# Import necessary modules
from flask import Flask, request, jsonify, render_template
import openai, os
from dotenv import load_dotenv
import time

app = Flask(__name__)

load_dotenv()

# Define OpenAI API key and assistant ID
openai.api_key = os.getenv("OPENAI_API_KEY")
assistant_id = "asst_nddeCyW1ur0LWOiLyV8C7XXv"

# Create a thread outside the function
thread = openai.beta.threads.create()
my_thread_id = thread.id

def create_thread(ass_id, prompt, thread_id):
    # Create a message
    message = openai.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=prompt
    )

    # Run the assistant
    run = openai.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ass_id,
    ) 

    return run.id

def check_status(run_id, thread_id):
    # Check the status of the assistant run
    run = openai.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id,
    )
    return run.status

def get_last_response(thread_id):
    # Get the last response from the assistant
    response = openai.beta.threads.messages.list(
      thread_id=thread_id
    )
    if response.data:
        return response.data[0].content[0].text.value
    else:
        return None

@app.route('/')
def home():
    # Render the home page
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    # Get user input from the request
    user_input = request.json.get('message')

    # Pass the user input to the create_thread function
    my_run_id = create_thread(assistant_id, user_input, my_thread_id)

    # Check the status of the assistant run
    status = check_status(my_run_id, my_thread_id)

    # Wait until the assistant run is completed
    while (status != "completed"):
        status = check_status(my_run_id, my_thread_id)
        time.sleep(2)

    # Get the last response from the assistant
    response = get_last_response(my_thread_id)
    
    # Return the response as JSON
    return jsonify({'response': response})

if __name__ == '__main__':
    # Run the Flask app in debug mode
    app.run(debug=True)
