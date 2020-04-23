from khan_api import KhanAcademySignIn, KhanAPI
import requests
import json

def khanUpdate(access_token, access_token_secret):
    kapi = KhanAPI(access_token, access_token_secret, "/api/internal/user")
    kaid = kapi.user()["kaid"]
    profile = KhanAPI(access_token, access_token_secret, "/api/internal/user/profile")
    person = profile.user({"kaid": kaid})
    nickname = person["nickname"]
    points = person["points"]
    return nickname, points

def duolingoUpdate(username):
    url = "https://schools.duolingo.com/api/1/observers/classroom_students?classroom_id=3735642&_=1587666580975"
    payload = {}
    headers = {
        'authority': 'schools.duolingo.com',
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'sec-fetch-dest': 'empty',
        'x-requested-with': 'XMLHttpRequest',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://schools.duolingo.com/classroom/3735642',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': 'wuuid=6c437d6c-6e8d-4806-94af-729769837c4d; lang=en; __utma=149745716.290956087.1587664318.1587664318.1587664318.1; __utmc=149745716; __utmz=149745716.1587664318.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); G_ENABLED_IDPS=google; csrf_token=IjIyYjY3MmM5Y2JmYzRiMTQ5NDM1NTcxNjRhNGZkNzg3Ig==; lp=N/A; lu=N/A; initial_referrer=N/A; _ga=GA1.2.519015919.1587664758; _gid=GA1.2.977685171.1587664758; _fbp=fb.1.1587664757893.740114012; logged_out_uuid=619340809; logged_in=true; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjYzMDcyMDAwMDAsImlhdCI6MCwic3ViIjo2MTkzNDA4MDl9.LtduvJ3tDvb1JRKr-CfuFIIGUvnnWTXEAIsjXXVGVG4; tsl=1587664758204; _pxvid=26f3074a-858c-11ea-a217-0242ac120009; __gads=ID=02724c89b962e0d8:T=1587664820:S=ALNI_MZw9JSQDhrKINwgv6oVTWt1_F2_nA; _px3=a3624013ee88481a0d094c3d112d73dd2cd247d24d7769fb06321904a1397f6d:6blFyDXoOAwqxJZncMQVO04/LyNnWd4tkDkSDphMGJhoF745ZeEWbMy/X5r66ixm1wMPbYjZLV0XMJf47ikkaw==:1000:Pyb/JbJZ1ffB05kGINOVB3MsUgv6QyEiYllY/iI2RDqwleyWEBqSX7agaTd77lpAyf2S52ubYOf5JY6CXZ+eYIUdj62sIySIp5jLOL7+y21cKvwN87KOlS0BWq0DYi9El1glt+ihvHk0GpDeTrhBkH/bzbYIdz0PhNo5ePk/fe4=; mp_mixpanel__c=1; __utmt=1; __utmb=149745716.13.10.1587664318'
        }
    response = requests.request("GET", url, headers=headers, data = payload)
    students = response.json()["students"]
    for i in students:
        if i["username"] == username:
            return i["xp"]["points"]
        else:
            raise "username not found in student list"
    return 0