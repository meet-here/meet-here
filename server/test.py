import requests
from credentials import *

x= requests.get('http://places.api.here.com/places/v1/discover/search',params={'app_code':app_code, 'app_id':app_id, 'at':'52.531,13.3848', 'pretty':'true','q':'coffee'})

l=[]

for loc in ['52.5191,13.356','52.531,13.3848', '52.4842,13.3333','52.4689,13.3153', '52.4296,13.2663','52.3932,13.1269']:
#for loc in ['52.3932,13.1269']:
    x = requests.get('http://places.api.here.com/places/v1/discover/search',params={'app_code':app_code, 'app_id':app_id, 'at':loc, 'pretty':'true','q':'coffee'})
    l.append(x.content.decode())
    
    
    
