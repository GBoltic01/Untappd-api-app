from flask import Flask, render_template, url_for, request, redirect
import requests
import json
import os

api_endpoint = str(os.environ.get("UNTAPPD_API_KEY"))
print(api_endpoint)

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

        beer_url = 'https://api.untappd.com/v4/search/beer?q={}&' + api_endpoint   
        beer_params = {'q': brewery}  
        beer_response = requests.get(beer_url, params=beer_params)   
        beer_1 = beer_response.json()

        # Extract relevant data from JSON

        name = brewery_json['response']['brewery']['items'][0]['brewery']['brewery_name']
        city = brewery_json['response']['brewery']['items'][0]['brewery']['location']['brewery_city'] + ', '
        country = brewery_json['response']['brewery']['items'][0]['brewery']['country_name']
        beer_nr = brewery_json['response']['brewery']['items'][0]['brewery']['beer_count']
        untappd_url = 'untappd.com' + brewery_json['response']['brewery']['items'][0]['brewery']['brewery_page_url']
        beer_styles = json_extract(beer_1, 'beer_style')

        # Create filter/count criteria 

        find_ipa = ['IPA', 'India Pale Ale']
        find_dark = ['Stout', 'Porter']
        find_sour = ['Sour', 'Farmhouse', 'Gose', 'Lambic']
        find_belgian = ['Belgian']
        find_lager = ['Lager', 'Pilsner', 'Bock', 'Keller']
        find_pale_ale = ['Pale Ale']

        # Count number of beers by style

        dark_all = [s for s in beer_styles if any(xs in s for xs in find_dark)]
        dark_count = len(dark_all)

        ipa_all = [s for s in beer_styles if any(xs in s for xs in find_ipa)]
        ipa_count = len(ipa_all)

        sour_all = [s for s in beer_styles if any(xs in s for xs in find_sour)]
        sour_count = len(sour_all)

        belgian_all = [s for s in beer_styles if any(xs in s for xs in find_belgian)]
        belgian_count = len(belgian_all)

        lager_all = [s for s in beer_styles if any(xs in s for xs in find_lager)]
        lager_count = len(lager_all)

        pale_ale_all = [s for s in beer_styles if any(xs in s for xs in find_pale_ale)]
        pale_ale_count = len(pale_ale_all)

        other_all = len(beer_styles) - dark_count - ipa_count - sour_count - belgian_count - lager_count - pale_ale_count


        # Pass all relevant variables to index.html

        return render_template('index.html', name=name, city=city, country=country, beer_nr=beer_nr, untappd_url=untappd_url, beer_styles=beer_styles,
                                             dark_count=dark_count, ipa_count=ipa_count, sour_count=sour_count, belgian_count=belgian_count, lager_count=lager_count,
                                             other_all=other_all, pale_ale_count=pale_ale_count)
    else:
        return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
