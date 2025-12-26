#!/usr/bin/env python3

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure API key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set. Add it to .env before running tests.")

genai.configure(api_key=api_key)

print("Testing available Gemini models...")
print(f"Using API key: {api_key[:10]}...")

# List of models to test
models_to_test = [
    'models/gemini-2.0-flash',
    'gemini-2.0-flash', 
    'models/gemini-1.5-flash',
    'gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'gemini-1.5-pro',
    'models/gemini-pro',
    'gemini-pro',
    'models/gemini-1.0-pro',
    'gemini-1.0-pro'
]

working_models = []

for model_name in models_to_test:
    try:
        model = genai.GenerativeModel(model_name)
        
        # Try a simple generation to test if it works
        response = model.generate_content(
            "Hello", 
            generation_config=genai.GenerationConfig(max_output_tokens=10)
        )
        
        if response.text:
            working_models.append(model_name)
            print(f"✅ {model_name} - WORKING")
        else:
            print(f"❌ {model_name} - Empty response")
            
    except Exception as e:
        print(f"❌ {model_name} - Error: {str(e)}")

print(f"\n🎉 Working models found: {len(working_models)}")
for model in working_models:
    print(f"   - {model}")

if working_models:
    print(f"\n💡 Recommended model to use: {working_models[0]}")
else:
    print("\n⚠️  No working models found. Please check your API key.")

# Also try to list models using the API
print("\n📋 Attempting to list all available models via API...")
try:
    models = genai.list_models()
    print("Available models:")
    for m in models:
        print(f"   - {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
