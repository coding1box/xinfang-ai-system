from flask import Flask, request, jsonify, Response, stream_template
from flask_cors import CORS
import requests
import json

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

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    data = request.get_json()
    print("收到前端流式请求：", data)
    message = data.get("message")
    history = data.get("history", [])

    # 过滤掉没有content的消息
    filtered_history = [m for m in history if m.get("content")]

    payload = {
        "model": "deepseek-chat",
        "messages": filtered_history + [{"role": "user", "content": message}],
        "stream": True  # 启用流式输出
    }
    print("请求DeepSeek流式payload：", payload)

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    def generate():
        try:
            # 发送流式请求到DeepSeek
            resp = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers, stream=True, timeout=60)
            resp.raise_for_status()
            
            for line in resp.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        data_str = line[6:]  # 移除 'data: ' 前缀
                        if data_str.strip() == '[DONE]':
                            yield f"data: [DONE]\n\n"
                            break
                        try:
                            data_json = json.loads(data_str)
                            if 'choices' in data_json and len(data_json['choices']) > 0:
                                choice = data_json['choices'][0]
                                if 'delta' in choice and 'content' in choice['delta']:
                                    content = choice['delta']['content']
                                    if content:
                                        yield f"data: {json.dumps({'content': content})}\n\n"
                        except json.JSONDecodeError:
                            continue
                            
        except Exception as e:
            print("DeepSeek流式请求异常：", e)
            error_msg = "AI服务超时或异常，请稍后再试。"
            yield f"data: {json.dumps({'error': error_msg})}\n\n"

    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(port=3001, debug=True)