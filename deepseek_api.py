from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # 允许跨域

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"  # 替换为实际 DeepSeek API 地址
DEEPSEEK_API_KEY = "sk-5224fe6de5344937950426b71a44a7de"  # 替换为你的 DeepSeek API Key

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message")
    history = data.get("history", [])

    payload = {
        "model": "deepseek-chat",  # 替换为实际模型名
        "messages": history + [{"role": "user", "content": message}]
    }

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        ai_reply = resp.json()["choices"][0]["message"]["content"]
        return jsonify({"reply": ai_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)