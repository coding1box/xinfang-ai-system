from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # 允许跨域

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"  # 替换为实际 DeepSeek API 地址
DEEPSEEK_API_KEY = "sk-771840d51c2d4b72b0eb29fc8deb9422"  # 替换为你的 DeepSeek API Key

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    print("收到前端请求：", data)
    message = data.get("message")
    history = data.get("history", [])

    # 过滤掉没有content的消息
    filtered_history = [m for m in history if m.get("content")]

    payload = {
        "model": "deepseek-chat",
        "messages": filtered_history + [{"role": "user", "content": message}]
    }
    print("请求DeepSeek payload：", payload)

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers, timeout=60)
        print("DeepSeek响应：", resp.json())
        resp.raise_for_status()
        ai_reply = resp.json()["choices"][0]["message"]["content"]
        return jsonify({"reply": ai_reply})
    except Exception as e:
        print("DeepSeek请求异常：", e)
        return jsonify({"reply": "AI服务超时或异常，请稍后再试。"}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)