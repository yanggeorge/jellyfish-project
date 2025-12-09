def test_predict_red_alert(client):
    """测试红色预警逻辑"""
    # 1. 先上传一条必定触发预警的数据 (Temp > 25, Chl > 1.5)
    payload = {
        "zone_id": 999,
        "record_time": "2025-12-09T12:00:00", # 最新时间
        "temperature": 28.0, # 高温
        "salinity": 30.0,
        "current_speed": 1.0,
        "chlorophyll": 3.0,  # 高叶绿素
        "dissolved_oxygen": 5.0,
        "jellyfish_density": 10.0
    }
    client.post("/api/monitor/upload", json=payload)

    # 2. 调用预测接口
    response = client.post("/api/analysis/predict")
    assert response.status_code == 200
    data = response.json()
    
    # 3. 验证结果
    assert data["level"] == "RED"
    assert "高温" in data["message"]

def test_predict_green_status(client):
    """测试正常状态逻辑"""
    # 1. 上传一条正常数据
    payload = {
        "zone_id": 999,
        "record_time": "2025-12-09T13:00:00", # 更晚的时间，成为 latest
        "temperature": 18.0, # 正常
        "salinity": 30.0,
        "current_speed": 1.0,
        "chlorophyll": 0.5,  # 正常
        "dissolved_oxygen": 8.0,
        "jellyfish_density": 0.1
    }
    client.post("/api/monitor/upload", json=payload)

    # 2. 调用预测接口
    response = client.post("/api/analysis/predict")
    data = response.json()
    
    # 3. 验证结果
    assert data["level"] == "GREEN"