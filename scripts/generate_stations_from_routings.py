import json

with open("data/mbta/routings.json") as raw:
	j = json.load(raw)

data = {}

for i in j["OL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLE"]:
	if i in j["GLD"] or i in j["GLC"] or i in j["GLB"]:
		data[i + " (GL-E)"] = {"name": i , "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLD"]:
	if i in j["GLE"] or i in j["GLC"] or i in j["GLB"]:
		data[i + " (GL-D)"] = {"name": i, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLB"]:
	if i in j["GLD"] or i in j["GLE"] or i in j["GLC"]:
		data[i + " (GL-B)"] = {"name": i , "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GLC"]:
	if i in j["GLD"] or i in j["GLE"] or i in j["GLB"]:
		data[i + " (GL-C)"] = {"name": i, "longitude": 0, "latitude": 0}
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
