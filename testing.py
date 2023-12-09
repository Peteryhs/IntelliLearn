from openai import OpenAI
from dotenv import load_dotenv
import os

# Set your OpenAI API key
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI()

assistant = client.beta.assistants.retrieve("asst_nddeCyW1ur0LWOiLyV8C7XXv")

thread = client.beta.threads.create()

