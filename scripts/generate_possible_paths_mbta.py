import json
import random

with open("data/mbta/routings.json", "r") as r:
	routings = json.load(r)

with open("data/transfers.json", "r") as r:
	transfers = json.load(r)

def line_for_station(station):
	for k in routings.keys():
		if station in routings[k]:
			return k 
	return "NOT FOUND " + station

routes = {}
answers = []

for line in routings.keys():
	for starting_station in routings[line]:
		for possible_transfer_arrival in routings[line]:
			if starting_station!=possible_transfer_arrival and possible_transfer_arrival in transfers:
				for possible_transfer in transfers[possible_transfer_arrival]:
					next_line = line_for_station(possible_transfer)
					for second_possible_transfer_arrival in routings[next_line]:
						if second_possible_transfer_arrival != possible_transfer and second_possible_transfer_arrival in transfers:
							for second_possible_transfer in transfers[second_possible_transfer_arrival]:
								final_line = line_for_station(second_possible_transfer)
								for destination in routings[final_line]:
									if destination != second_possible_transfer:
										trip_str = '-'.join([starting_station, possible_transfer_arrival, possible_transfer, second_possible_transfer_arrival, second_possible_transfer, destination])
										routes[trip_str] = {"solution": line + "-" + next_line + "-" + final_line, "origin": starting_station, "first_transfer_arrival": possible_transfer_arrival, "first_transfer_departure": possible_transfer, "second_transfer_arrival": second_possible_transfer_arrival, "second_transfer_departure": second_possible_transfer, "destination": destination}
										answers.append([starting_station, possible_transfer_arrival, possible_transfer, second_possible_transfer_arrival, second_possible_transfer, destination])

with open("generated_solutions.json", "w") as f:
	json.dump(obj=routes, fp=f, indent=4)

with open("generated_answers.json", "w") as f:
	random.shuffle(answers)
	json.dump(obj=answers, fp=f, indent=4)