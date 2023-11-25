import json

with open("data/mbta/routings.json") as raw:
	j = json.load(raw)

data = {}

for i in j["OL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLE"]:
	shortened=i[:-7]
	if shortened + " (GL-D)" in j["GLD"] or shortened + " (GL-C)" + " (GL-C)" in j["GLC"] or shortened + " (GL-B)" in j["GLB"]:
		data[i] = {"name": shortened, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLD"]:
	shortened=i[:-7]
	if shortened + " (GL-E)" in j["GLE"] or shortened + " (GL-C)" in j["GLC"] or shortened + " (GL-B)" in j["GLB"]:
		data[i] = {"name": shortened, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLB"]:
	shortened=i[:-7]
	if shortened + " (GL-D)" in j["GLD"] or shortened + " (GL-E)" in j["GLE"] or shortened + " (GL-C)" in j["GLC"]:
		data[i] = {"name": shortened, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLC"]:
	shortened=i[:-7]
	if shortened + " (GL-D)" in j["GLD"] or shortened + " (GL-E)" in j["GLE"] or shortened + " (GL-B)" in j["GLB"]:
		data[i] = {"name": shortened, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["BL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["RLA"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["RLB"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["RLM"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}


with open('blah.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
