import math
import random
from pymongo_setup import get_database

# visualize latitude and longitude
# https://fthmb.tqn.com/rrQ9wCXTML9ViuYa29UtMHyvrcA=/1500x1000/filters:fill(auto,1)/Latitude-and-Longitude-58b9d1f35f9b58af5ca889f1.jpg


# Converts ft and in to m
def feet_inch_to_m(feet, inches=0):
    return feet * 0.3048 + inches * 0.0254


# Add a distance to [lat, long] coordinates
# reference: https://stackoverflow.com/questions/2839533/adding-distance-to-a-gps-coordinate/2839560
#            https://stackoverflow.com/questions/15886846/python-elegant-way-of-finding-the-gps-coordinates-of-a-circle-around-a-certain
def add_distance(lat_initial, lng_initial, lat_offset, lng_offset):
    lat = lat_initial + (180/math.pi)*(lat_offset/6378137)
    lng = lng_initial + (180/math.pi)*(lng_offset /
                                       6378137)/math.cos(lat_initial*math.pi/180)

    return {"lat": lat, "lng": lng}


# Calculates lat offset (in m) and lng offset (in m) using distance (in m) + bearing (in deg)
def calc_offsets(distance, bearing):
    return (distance * math.cos(bearing * math.pi/180), distance * math.sin(bearing * math.pi/180))


# Add a distance with bearing to lat,lng coords
def add_distance_2(coords, distance, bearing):
    offset = calc_offsets(distance, bearing)
    return add_distance(coords["lat"], coords["lng"], offset[0], offset[1])


# calculate 4 vertices of plot
# must specify (pass in) to function: width, height, top left vertex coords, orientation
# * orientation: 0 degrees means that when u are looking @ gravestone, you are looking North
#                90 degrees is east, 180 is south, 270 is west
# * assumes plot is rectangle (has 4 right angles)
# * if plotNumber provided then function updates db
def calc_plot(width, height, top_left, orientation, plotNumber=None, registeredName="Unknown"+str(random.randint(0, 10000))):
    top_right = add_distance_2(top_left, width, 90+orientation)
    bottom_left = add_distance_2(top_left, height, orientation-180)
    bottom_right = add_distance_2(bottom_left, width, 90+orientation)

    if plotNumber and type(plotNumber) is int:
        print('updated', plotNumber)
        upsert_plot({"plotNumber": plotNumber, "registeredName": registeredName,
                    "coordinates": [top_left, top_right, bottom_right, bottom_left]})

    return [top_left, top_right, bottom_right, bottom_left]


# calculate coordinates for a row of plots
# plots = [{"plotNumber": 55, "height": in m},....]
def calc_plot_rows(const_width, plots, first_plot_top_left,  orientation):
    top_left = first_plot_top_left
    for plot in plots:
        top_left = calc_plot(const_width, plot["height"],
                             top_left, orientation, plot["plotNumber"], plot["registeredName"])[3]


def get_plot_coords(plotNumber):
    return get_database().get_collection('plots').find_one(
        {"plotNumber": plotNumber})["coordinates"]


# updates a vertex of a plot in db
def update_vertex(lat, lng, plotNumber, corner):
    get_database().get_collection('plots').find_one_and_update(
        {"plotNumber": plotNumber},
        {"$set": {
            "coordinates."+corner: {"lat": lat, "lng": lng}}})


# updates plot coordinates (all) in db
def update_coordinates(coordinates, plotNumber):
    get_database().get_collection('plots').find_one_and_update(
        {"plotNumber": plotNumber},
        {"$set": {"coordinates": coordinates}})


def upsert_plot(plot):
    get_database().get_collection('plots').update_one(
        {"plotNumber": plot["plotNumber"]}, {"$set": plot}, upsert=True)


initial_point = {"lat": -36.87247175496873,
                 "lng": 174.7802858655402}

# new_point = add_distance_2(initial_point, imperial_to_metric(
#     8), 217.514-90)  # og deg 217.514
# # new_point = add_distance_2(initial_point, 1, 0)
# plot_coords = calc_plot(imperial_to_metric(8), imperial_to_metric(
# 5), initial_point, 217.514-180, 55)

northwest_wall_angle = 216.5  # degrees from true north
plot2_coords = {"lat": -36.87241435760838, "lng": 174.780340850825}
row1_plots = [
    {"plotNumber": 102, "height": feet_inch_to_m(
        5, 9), "registeredName": "Kidd"},
    {"plotNumber": 103, "height": feet_inch_to_m(
        12, 10), "registeredName": "Whisker"},
    {"plotNumber": 104, "height": feet_inch_to_m(
        6, 3), "registeredName": "Stanley"},
    {"plotNumber": 105, "height": feet_inch_to_m(
        5), "registeredName": "Wilson"},
    {"plotNumber": 106, "height": feet_inch_to_m(
        7), "registeredName": "Allom"},
    {"plotNumber": 107, "height": feet_inch_to_m(
        3), "registeredName": "Wills"},
    {"plotNumber": 108, "height": feet_inch_to_m(
        8, 9), "registeredName": "Clayton"},
    {"plotNumber": 109, "height": feet_inch_to_m(
        9), "registeredName": "Jones"},
    {"plotNumber": 110, "height": feet_inch_to_m(
        7, 6), "registeredName": "Shipherd"},
    {"plotNumber": 111, "height": feet_inch_to_m(
        6, 6), "registeredName": "Phillipson"},
    # map is ambiguous ^ 🤨
    {"plotNumber": 112, "height": feet_inch_to_m(
        4, 6), "registeredName": "Cook"},
    {"plotNumber": 113, "height": feet_inch_to_m(
        9), "registeredName": "McQuillen"},
]
calc_plot_rows(feet_inch_to_m(8), row1_plots,
               plot2_coords, northwest_wall_angle+.125-180)

row2_plots = [
    {"plotNumber": 114, "height": feet_inch_to_m(
        7), "registeredName": "Palmer"},
    {"plotNumber": 115, "height": feet_inch_to_m(
        4), "registeredName": "Bassett"},
    {"plotNumber": 116, "height": feet_inch_to_m(
        12), "registeredName": "Banks"},
    {"plotNumber": 117, "height": feet_inch_to_m(
        3), "registeredName": "G.U."},
    # ambiguous name ^
    {"plotNumber": 118, "height": feet_inch_to_m(
        4), "registeredName": "Burnette"},
]
calc_plot_rows(feet_inch_to_m(8), row2_plots,
               add_distance_2(get_plot_coords(113)[3], feet_inch_to_m(3), northwest_wall_angle+.125), northwest_wall_angle+.125-180)
# print(add_distance_2(get_plot_coords(113)[3],
#       feet_inch_to_m(3), northwest_wall_angle+.125))
# print(get_plot_coords(113))

row3_plots = [
    {"plotNumber": 119, "height": feet_inch_to_m(
        4), "registeredName": "Cromby"},
    {"plotNumber": 120, "height": feet_inch_to_m(
        8), "registeredName": "Heywood"},
    {"plotNumber": 121, "height": feet_inch_to_m(
        8), "registeredName": "Buchanan"},
    {"plotNumber": 122, "height": feet_inch_to_m(
        8, 6), "registeredName": "Harrop"},
    {"plotNumber": 123, "height": feet_inch_to_m(
        9, 9), "registeredName": "Hesketh"},
    {"plotNumber": 124, "height": feet_inch_to_m(
        5), "registeredName": "Coster"},
    {"plotNumber": 125, "height": feet_inch_to_m(
        9), "registeredName": "Serle"},
]

calc_plot_rows(feet_inch_to_m(8), row3_plots,
               add_distance_2(get_plot_coords(118)[1], feet_inch_to_m(3, 5), northwest_wall_angle+.125), northwest_wall_angle+.125-180)


row4_plots = [

    {"plotNumber": 126, "height": feet_inch_to_m(
        9), "registeredName": "W.Horn"},
]

calc_plot_rows(feet_inch_to_m(8), row4_plots,
               add_distance_2(get_plot_coords(125)[3], feet_inch_to_m(0, 10), northwest_wall_angle+.125), northwest_wall_angle+.125-180)

row5_plots = [

    {"plotNumber": 127, "height": feet_inch_to_m(
        7), "registeredName": "Mucklestone"},
    {"plotNumber": 128, "height": feet_inch_to_m(
        9), "registeredName": "Crisp"},
    {"plotNumber": 129, "height": feet_inch_to_m(
        9), "registeredName": "Railey"},
    {"plotNumber": 130, "height": feet_inch_to_m(
        7), "registeredName": "Alderton"},
    {"plotNumber": 131, "height": feet_inch_to_m(
        9), "registeredName": "Holmes"},
    {"plotNumber": 132, "height": feet_inch_to_m(
        9), "registeredName": "Barnett"},
    {"plotNumber": 133, "height": feet_inch_to_m(
        4, 6), "registeredName": "Charles"},
]

calc_plot_rows(feet_inch_to_m(8), row5_plots,
               add_distance_2(add_distance_2(get_plot_coords(102)[1], feet_inch_to_m(4), northwest_wall_angle+.125-90), 0.5, northwest_wall_angle+.125), northwest_wall_angle+.125-180)
