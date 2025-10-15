# 计算机网络 - (七)WebSocket实时通信

学习WebSocket技术。

---


```python
import asyncio
import websockets

# WebSocket服务器
async def websocket_server(websocket, path):
    """
    WebSocket服务器
    """
    print(f"客户端连接: {websocket.remote_address}")
    
    try:
        async for message in websocket:
            print(f"收到消息: {message}")
            
            # 广播给所有连接
            response = f"Echo: {message}"
            await websocket.send(response)
    
    except websockets.exceptions.ConnectionClosed:
        print("连接关闭")

# 启动服务器
# asyncio.run(websockets.serve(websocket_server, "localhost", 8765))

# WebSocket客户端
async def websocket_client():
    """
    WebSocket客户端
    """
    uri = "ws://localhost:8765"
    
    async with websockets.connect(uri) as websocket:
        # 发送消息
        await websocket.send("Hello, Server!")
        
        # 接收响应
        response = await websocket.recv()
        print(f"收到响应: {response}")

# asyncio.run(websocket_client())
```

---

**本章完**
