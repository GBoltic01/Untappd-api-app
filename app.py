from flask import Flask, render_template, url_for, request, redirect
from collections import Counter
import urllib.parse
import requests
import json
import os
import re

api_endpoint = str(os.environ.get("UNTAPPD_API_KEY"))

# Recursive function to extract specific values of a key in JSON tree

def json_extract(obj, key):

    arr = []

    def extract(obj, arr, key):

        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    extract(v, arr, key)
                elif k == key:
                    arr.append(v)
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr

    values = extract(obj, arr, key)
    return values



app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':

        brewery = request.form["brewery_entry"] 


        # Get brewery and beer info from Untappd

        brewery_url = 'https://api.untappd.com/v4/search/brewery?q={}&' + api_endpoint
        brewery_params = {'q': brewery}
        brewery_response = requests.get(brewery_url, params=brewery_params)
        brewery_json = brewery_response.json()

        beer_url = 'https://api.untappd.com/v4/search/beer?q={}&limit=50&' + api_endpoint   
        beer_params = {'q': brewery}  
        beer_response = requests.get(beer_url, params=beer_params)   
        beer_1 = beer_response.json()

        # Remove all entries that don't match the seacrh input string (brewery name)
        # Problem with serach entry. If this code is included, misspelling causes trouble. Try to find a way aound it 
        '''for element in beer_1['response']['beers']['items']:
            if brewery.title() not in element['brewery']['brewery_name']:   
                element.pop('beer') 
        
        print(json_extract(beer_1, 'beer_name'))

        # Extract relevant data from JSON'''

        name = brewery_json['response']['brewery']['items'][0]['brewery']['brewery_name']
        image = brewery_json['response']['brewery']['items'][0]['brewery']['brewery_label']
        city = brewery_json['response']['brewery']['items'][0]['brewery']['location']['brewery_city'] + ', '
        country = brewery_json['response']['brewery']['items'][0]['brewery']['country_name']
        beer_nr = brewery_json['response']['brewery']['items'][0]['brewery']['beer_count']
        untappd_url = 'www.untappd.com' + brewery_json['response']['brewery']['items'][0]['brewery']['brewery_page_url']
        latitude = brewery_json['response']['brewery']['items'][0]['brewery']['location']['lat']
        longitude = brewery_json['response']['brewery']['items'][0]['brewery']['location']['lng']
        beer_styles = json_extract(beer_1, 'beer_style')

        #print(beer_1['response']['beers']['items'])
        most_popular_beer = json_extract(beer_1, 'beer_name')[0]

        # Create filter/count criteria 

        find_ipa = ['IPA', 'India Pale Ale']
        find_dark = ['Stout', 'Porter']
        find_sour = ['Sour', 'Farmhouse', 'Gose', 'Lambic']
        find_belgian = ['Belgian']
        find_lager = ['Lager', 'Pilsner', 'Bock', 'Keller']
        find_pale_ale = ['Pale Ale']

        all_filters = ['IPA', 'India Pale Ale', 'Stout', 'Porter', 'Sour', 'Farmhouse', 'Gose', 'Lambic', 'Belgian', 'Lager', 'Pilsner', 'Bock', 'Keller', 'Pale Ale']
        

        # Count number of beers by style

        dark_all = [s for s in beer_styles if any(xs in s for xs in find_dark)]
        dark_count = len(dark_all)
        dark_substyles = dict(Counter(dark_all))

        ipa_all = [s for s in beer_styles if any(xs in s for xs in find_ipa)]
        ipa_count = len(ipa_all)
        ipa_substyles = dict(Counter(ipa_all))

        sour_all = [s for s in beer_styles if any(xs in s for xs in find_sour)]
        sour_count = len(sour_all)
        sour_substyles = Counter(sour_all)

        belgian_all = [s for s in beer_styles if any(xs in s for xs in find_belgian)]
        belgian_count = len(belgian_all)
        belgian_substyles = Counter(belgian_all)

        lager_all = [s for s in beer_styles if any(xs in s for xs in find_lager)]
        lager_count = len(lager_all)
        lager_substyles = Counter(lager_all)

        pale_ale_all = [s for s in beer_styles if any(xs in s for xs in find_pale_ale)]
        pale_ale_count = len(pale_ale_all)
        pale_ale_substyles = Counter(pale_ale_all)

        other_all = [s for s in beer_styles if not any(xs in s for xs in all_filters)]
        other_count = len(other_all)
        other_substyles = Counter(other_all)

        
        # ADD OTHER SUBSTYLES

        most_popular= max(dark_count, ipa_count, sour_count, belgian_count, lager_count, pale_ale_count)

        # Relabel to display most popular style 

        if most_popular == ipa_count:
            most_popular = "IPA"
        elif most_popular == pale_ale_count:
            most_popular = "Pale Ale"
        elif most_popular == sour_count:
            most_popular = "Sour"
        elif most_popular == belgian_count:
            most_popular = "Belgian"
        elif most_popular == lager_count:
            most_popular = "Lager"
        elif most_popular == dark_count:
            most_popular = "Stout/Porter"

        # Create three dictionaries to pass data to client side

        brewery_dictionary = {
            'name': name,
            'image': image,
            'city': city,
            'country': country,
            'beer_nr': beer_nr,
            'untappd_url': untappd_url,
            'beer_styles': beer_styles,
            'most_popular': most_popular, 
            'most_popular_beer': most_popular_beer,
            'latitude': latitude, 
            'longitude': longitude 
        }

        beer_dictionary = {
            'dark_count': dark_count,
            'ipa_count': ipa_count, 
            'sour_count': sour_count, 
            'belgian_count': belgian_count,
            'lager_count': lager_count,
            'other_all': other_count, 
            'pale_ale_count': pale_ale_count
        }

        beer_styles_dictionary = {
            'dark_substyles' : dark_substyles,
            'ipa_substyles' : ipa_substyles,
            'sour_substyles' : sour_substyles,
            'belgian_substyles' : belgian_substyles,
            'lager_substyles' : lager_substyles,
            'other_substyles' : other_substyles,
            'pale_ale_substyles' : pale_ale_substyles
        }

        # Pass data to index.html

        return render_template('reload.html', brewery_dictionary=brewery_dictionary, beer_dictionary=beer_dictionary, beer_styles_dictionary=beer_styles_dictionary)
    else:
        return render_template('index.html')

@app.route('/about')
def about():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(debug=True)
