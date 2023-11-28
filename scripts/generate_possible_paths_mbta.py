import json
import random

with open("data/mbta/routings.json", "r") as r:
	routings = json.load(r)

with open("data/transfers.json", "r") as r:
	transfers = json.load(r)

def lines_for_station(station):
	l = []
	for k in routings.keys():
		if station in routings[k]:
			l.append(k)
	if len(l) == 0:
		return "NOT FOUND " + station
	return l

routes = {}
answers = []

stationary_answers_in_order = [
	[
		"Forest Hills",
        "State Street (O)",
        "State Street (B)",
        "Government Center (B)",
        "Government Center (GL-D)",
        "Fenway"
    ],
    [
        "Charles/MGH",
        "Downtown Crossing (R)",
        "Downtown Crossing (O)",
        "North Station (O)",
        "North Station (GL-E)",
        "Ball Square"
    ],
    [
        "Northeastern University",
        "Haymarket (GL-E)",
        "Haymarket (O)",
        "North Station (O)",
        "North Station (GL-E)",
        "Brigham Circle"
    ],
    [
        "Oak Grove",
        "State Street (O)",
        "State Street (B)",
        "Government Center (B)",
        "Government Center (GL-E)",
        "Magoun Square"
    ]]

for line in routings.keys():
	for starting_station in routings[line]:
		for possible_transfer_arrival in routings[line]:
			if starting_station!=possible_transfer_arrival and possible_transfer_arrival in transfers:
				for possible_transfer in transfers[possible_transfer_arrival]:
					next_lines = lines_for_station(possible_transfer)
					for next_line in next_lines:
						for second_possible_transfer_arrival in routings[next_line]:
							if second_possible_transfer_arrival != possible_transfer and second_possible_transfer_arrival in transfers:
								for second_possible_transfer in transfers[second_possible_transfer_arrival]:
									final_lines = lines_for_station(second_possible_transfer)
									for final_line in final_lines:
										for destination in routings[final_line]:
											if destination != second_possible_transfer:
												trip_str = '-'.join([starting_station, possible_transfer_arrival, possible_transfer, second_possible_transfer_arrival, second_possible_transfer, destination])
												if trip_str in routes:
													routes[trip_str]["solution"].append(line + "-" + next_line + "-" + final_line)
												else:
													routes[trip_str] = {"solution": [line + "-" + next_line + "-" + final_line], "origin": starting_station, "first_transfer_arrival": possible_transfer_arrival, "first_transfer_departure": possible_transfer, "second_transfer_arrival": second_possible_transfer_arrival, "second_transfer_departure": second_possible_transfer, "destination": destination}
												trip = [starting_station, possible_transfer_arrival, possible_transfer, second_possible_transfer_arrival, second_possible_transfer, destination]
												if trip not in stationary_answers_in_order:
													answers.append(trip)

with open("generated_solutions.json", "w") as f:
	json.dump(obj=routes, fp=f, indent=4)

with open("generated_answers.json", "w") as f:
	random.shuffle(answers)
	answers = stationary_answers_in_order + answers
	json.dump(obj=answers, fp=f, indent=4)
