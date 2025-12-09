def test_create_sensor_log(client):
    """测试上传传感器数据"""
    payload = {
        "zone_id": 999,  # 对应 conftest 中预制的 ID
        "record_time": "2025-12-09T10:00:00",
        "temperature": 26.5,
        "salinity": 30.2,
        "current_speed": 1.2,
        "chlorophyll": 2.1,
        "dissolved_oxygen": 6.5,
        "jellyfish_density": 0.8
    }
    response = client.post("/api/monitor/upload", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["temperature"] == 26.5
    assert data["zone_id"] == 999
    assert "id" in data

def test_get_realtime_data(client):
    """测试获取实时数据列表"""
    response = client.get("/api/monitor/realtime")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # 因为刚才上传了一条，所以列表不为空
    assert len(data) > 0
    assert data[0]["jellyfish_density"] == 0.8

def test_get_history_data(client):
    """测试获取历史数据"""
    # zone_id 999
    response = client.get("/api/monitor/history/999")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)