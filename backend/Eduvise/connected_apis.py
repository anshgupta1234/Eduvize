from .khan_api import KhanAcademySignIn, KhanAPI
import requests
import json
from bs4 import BeautifulSoup
import lxml

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
            return i["xp"]["points"], i["xp"]["language_name"]
        else:
            raise "username not found in student list"
    return 0

def nitroSearch(username):
    headers = {
        'authority': 'www.nitrotype.com',
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'accept': 'application/json, text/plain, */*',
        'sec-fetch-dest': 'empty',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://www.nitrotype.com',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://www.nitrotype.com/friends',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': 'anonId=99; _gcl_au=1.1.1723704985.1587676559; _ga=GA1.2.900715589.1587676559; _gid=GA1.2.1478331315.1587676559; _fbp=fb.1.1587676559393.853965594; _fsloc=?i=US&c=East Lansing; _fsuid=ac9ebeaf-ccd5-43dd-9247-cab384140872; __gads=ID=9d53fffa784cb61d:T=1587676560:S=ALNI_MZ7JIGALicPb_tipwM1_PaOvtGMyQ; __qca=P0-1472750549-1587676561227; fsbotchecked=true; __cfduid=da58c6ee96c02300fb384c91158c107351587678854; ntdev=97680987; _dc_gtm_UA-231012-32=1; PHPNTSESSION=p0c36ef70277c314209pgiu8gs; ntuserrem=e1302b617370fb571473a3e63687514e9d499afaedffd519c44f0b942d5637f0bb5fe73cf6b4542f91c664ea03272919e252133c63d13b9aa7f2d093a0f8e11d<42930964<1; ntlastaction=1587687524887; p0c36ef70277c314209pgiu8gs=YXBpfGE6MTE6e3M6NjoidXNlcklEIjtpOjQyOTMwOTY0O3M6ODoidXNlcm5hbWUiO3M6NzoiZWR1dmlzZSI7czoxMToiYWNjb3VudFR5cGUiO3M6ODoic3RhbmRhcmQiO3M6MTA6Im1lbWJlcnNoaXAiO3M6NToiYmFzaWMiO3M6NjoidGVhbUlEIjtOO3M6Nzoib2ZmbGluZSI7aTowO3M6MjoiaXAiO3M6MTM6IjY4LjU2LjExMi4xMTAiO3M6MTE6ImZyaWVuZExpbWl0IjtpOjEwMDA7czo5OiJzZWN0aW9uSUQiO047czoxMzoidXNlclNlc3Npb25JRCI7czo5OiIyODU4MzYwMjEiO3M6ODoiZGV2aWNlSUQiO3M6ODoiOTc2ODA5ODciO301Njc2MDBkYjY1YTZjYjg3OTI0OThkMjQzNmE3M2U4YTVmYjEwMzE2NTQ1YzE5YmUwMzFiOTY1ZWY4M2U3ZWMzYjVjMDU3YTU0OTE4MzY0ZThhNGYwMGZhNTZhZWUzODcyMTEyMDFlMTcxOTE0MmM2MjAzZTY2NzViMjRkZjU4Ng%3D%3D; _gali=friendsearch',
    }

    data = {
    'term': username,
    'uhash': 'e1302b617370fb571473a3e63687514e9d499afaedffd519c44f0b942d5637f0bb5fe73cf6b4542f91c664ea03272919e252133c63d13b9aa7f2d093a0f8e11d<42930964<1'
    }

    response = requests.post('https://www.nitrotype.com/api/players-search', headers=headers, data=data)
    try:
        results = response.json()
        userlist = []
        for i in results["data"]:
            id = i["userID"]
            un = i["username"]
            dn = i["displayName"]
            userlist.append({"accountId": id, "username": un, "displayname": dn})
        return json.dumps({"results": userlist})
    except Exception as e:
        print(e)
        return "No users found matching that username"

def nitroUpdate(id):
    url = "https://www.nitrotype.com/api/players/{}".format(id)
    payload = {}
    headers= {}
    response = requests.request("GET", url, headers=headers, data = payload)
    try:
        return response.json()["data"]["avgSpeed"]
    except:
        return 0

def caUpdate(username):
    url = "https://www.codecademy.com/profiles/{}".format(username)

    payload = {}
    headers = {'authority': 'www.codecademy.com','pragma': 'no-cache','cache-control': 'no-cache','Cookie': '_session_id=cb046960b7ebe52b30b7f04950877c46; __cfduid=dc7baf2430d7451b3b3004c4501c622d91587691297; initial_referrer=%24direct; initial_referring_domain=%24direct; zendesk_identify=true'}

    response = requests.request("GET", url, headers=headers, data = payload)

    soup = BeautifulSoup(response.text, 'lxml')
    for p in soup.find_all('p'):
        if "total-points" in str(p):
            return int(p.string)
    return 0

def caLink(username):
    url = "https://www.codecademy.com/profiles/{}".format(username)

    payload = {}
    headers = {'authority': 'www.codecademy.com','pragma': 'no-cache','cache-control': 'no-cache','Cookie': '_session_id=cb046960b7ebe52b30b7f04950877c46; __cfduid=dc7baf2430d7451b3b3004c4501c622d91587691297; initial_referrer=%24direct; initial_referring_domain=%24direct; zendesk_identify=true'}

    response = requests.request("GET", url, headers=headers, data = payload)
    return response.status_code
