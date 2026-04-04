import sys

def test_fetch():
    try:
        from curl_cffi import requests
        print("curl_cffi imported successfully")
    except ImportError:
        print("Please install curl_cffi: pip install curl_cffi")
        return

    url1 = "https://example.com"
    url2 = "https://medium.com/analytics-vidhya/step-by-step-guide-to-setup-gpu-with-tensorflow-on-windows-laptop-c84634f59857"
    url3 = "https://www.flipkart.com/"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    print("Testing Medium...")
    try:
        r2 = requests.get(url2, headers=headers, impersonate="chrome110", timeout=15)
        print(f"Medium Status: {r2.status_code}")
    except Exception as e:
        print(f"Medium Error: {e}")

    print("Testing Flipkart...")
    try:
        r3 = requests.get(url3, headers=headers, impersonate="chrome110", timeout=15)
        print(f"Flipkart Status: {r3.status_code}")
    except Exception as e:
        print(f"Flipkart Error: {e}")

if __name__ == "__main__":
    test_fetch()
