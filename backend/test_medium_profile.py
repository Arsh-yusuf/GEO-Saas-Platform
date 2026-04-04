import sys
from curl_cffi import requests

def test_medium():
    url = "https://medium.com/analytics-vidhya/step-by-step-guide-to-setup-gpu-with-tensorflow-on-windows-laptop-c84634f59857"
    
    profiles = ["chrome100", "chrome110", "chrome120", "edge99", "safari15_3", "safari15_5"]
    
    for profile in profiles:
        print(f"Testing profile: {profile}")
        try:
            r = requests.get(url, impersonate=profile, timeout=10)
            print(f"Success! Profile {profile} gives status {r.status_code}")
            return profile
        except Exception as e:
            print(f"Failed {profile}: {str(e)}")

if __name__ == "__main__":
    test_medium()
