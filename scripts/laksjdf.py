import json

with open("data/mbta/routings.json") as raw:
	j = json.load(raw)

data = {}

for i in j["OL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GL-E"]:
	if i in j["GL-D"] or i in j["GL-C"] or i in j["GL-B"]:
		data[i + " (GL-E)"] = {"name": i , "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GL-D"]:
	if i in j["GL-E"] or i in j["GL-C"] or i in j["GL-B"]:
		data[i + " (GL-D)"] = {"name": i, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GL-B"]:
	if i in j["GL-D"] or i in j["GL-E"] or i in j["GL-C"]:
		data[i + " (GL-B)"] = {"name": i , "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["GL-C"]:
	if i in j["GL-D"] or i in j["GL-E"] or i in j["GL-B"]:
		data[i + " (GL-C)"] = {"name": i, "longitude": 0, "latitude": 0}
	else:
		data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["BL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}

for i in j["RL"]:
	data[i] = {"name": i, "longitude": 0, "latitude": 0}


with open('blah.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
