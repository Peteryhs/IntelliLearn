from flask import Flask, request, jsonify, render_template
import openai, os
from dotenv import load_dotenv
import time

app = Flask(__name__)

load_dotenv()

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

    # Run
    run = openai.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ass_id,
    ) 

    return run.id

def check_status(run_id, thread_id):
    run = openai.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id,
    )
    return run.status

def get_last_response(thread_id):
    response = openai.beta.threads.messages.list(
      thread_id=thread_id
    )
    if response.data:
        return response.data[0].content[0].text.value
    else:
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    # Pass the user input to the create_thread function
    my_run_id = create_thread(assistant_id, user_input, my_thread_id)

    status = check_status(my_run_id, my_thread_id)

    while (status != "completed"):
        status = check_status(my_run_id, my_thread_id)
        time.sleep(2)

    response = get_last_response(my_thread_id)
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
