import requests
from credentials import *

x= requests.get('http://places.demo.api.here.com/places/v1/discover/search',params={'app_code':app_code, 'app_id':app_id, 'at':'52.531,13.3848', 'pretty':'true','q':'code'})
