
from __future__ import division
from builtins import str
from builtins import range
from builtins import object
from past.utils import old_div
import hashlib
from math import *
import random

#Note, the following import is not required, but you may uncomment it
#if you want to use numpy as part of your solution:
#import numpy as np

# STUDENT ID

# Please specify your GT login ID in the whoami variable (ex: jsmith123).

whoami = 'msaleh33'

# QUESTION 1

# What is the probability that zero particles are in state A?

q1_n_1  = 0.75
q1_n_4  = 0.3164
q1_n_10 = 0.0563135

# QUESTION 2

q2_1_step_A = 3.0
q2_1_step_B = 3.0
q2_1_step_C = 3.0
q2_1_step_D = 3.0
q2_infinite_step_A = 3.0
q2_infinite_step_B = 3.0
q2_infinite_step_C = 3.0
q2_infinite_step_D = 3.0

# QUESTION 3

# Put 0 for unchecked, 1 for checked

q3_works_fine                 = 0
q3_ignores_robot_measurements = 1
q3_ignores_robot_motion       = 0
q3_it_likely_fails            = 1
q3_none_of_above              = 0

# QUESTION 4

def q4_move(self, motion):
    # You can replace the INSIDE of this function with the move function you modified in the Udacity quiz
    theta = self.orientation
    steer_angle = random.gauss(motion[0], self.steering_noise)
    dist = random.gauss(motion[1], self.distance_noise)
    
    turn_angle = (dist/self.length) * tan(steer_angle)
    
    if turn_angle < 0.001:
        xprime = self.x + ( dist * cos(theta) )
        yprime = self.y + ( dist * sin(theta) )
        thetaprime = (theta + turn_angle) % (2*pi)
    else: 
        turn_radius = (dist/turn_angle)
        cx = self.x - (sin(theta) * turn_radius)
        cy = self.y + (cos(theta) * turn_radius)
        xprime = cx + ( sin(theta+turn_angle)*turn_radius )
        yprime = cy - ( cos(theta+turn_angle)*turn_radius )
        thetaprime = (theta + turn_angle) % (2*pi)
    
    # new_orient = self.orientation + float(motion[0]) + random.gauss(0.0, self.steering_noise)
    # set particle
    res = robot(self.length,q4_move)
    res.set_noise(self.bearing_noise, self.steering_noise, self.distance_noise)
    res.set(xprime, yprime, thetaprime)

    return res # make sure your move function returns an instance
                # of the robot class with the correct coordinates.

# QUESTION 5

def q5_sense(self, add_noise):
    # You can replace the INSIDE of this function with the sense function you modified in the Udacity quiz
    # You can ignore add_noise for Q5
    Z = []

    # ENTER CODE HERE
    # HINT: You will probably need to use the function atan2()
    theta = self.orientation
    for i in range(len(landmarks)):
        deltax = (landmarks[i][1] - self.x)
        deltay = (landmarks[i][0] - self.y)
        bearing = (atan2(deltay,deltax) - theta) % (2*pi)
        Z.append(bearing)

    return Z #Leave this line here. Return vector Z of 4 bearings.

# QUESTION 6

def q6_move(self, motion):
    # You can replace the INSIDE of this function with the move and sense functions you modified in the Udacity quiz
    # Note that there is no motion noise parameter necessary
    theta = self.orientation
    steer_angle = random.gauss(motion[0], self.steering_noise)
    dist = random.gauss(motion[1], self.distance_noise)
    
    turn_angle = (dist/self.length) * tan(steer_angle)
    
    if turn_angle < 0.001:
        xprime = self.x + ( dist * cos(theta) )
        yprime = self.y + ( dist * sin(theta) )
        thetaprime = (theta + turn_angle) % (2*pi)
    else: 
        turn_radius = (dist/turn_angle)
        cx = self.x - (sin(theta) * turn_radius)
        cy = self.y + (cos(theta) * turn_radius)
        xprime = cx + ( sin(theta+turn_angle)*turn_radius )
        yprime = cy - ( cos(theta+turn_angle)*turn_radius )
        thetaprime = (theta + turn_angle) % (2*pi)
    
    # new_orient = self.orientation + float(motion[0]) + random.gauss(0.0, self.steering_noise)
    # set particle
    res = robot(self.length,q6_move,q6_sense )
    res.set_noise(self.bearing_noise, self.steering_noise, self.distance_noise)
    res.set(xprime, yprime, thetaprime)

    return res    #return a new robot object that you create here.

def q6_sense(self, add_noise=1):
    # You can replace the INSIDE of this function with what you changed in the Udacity quiz
    # Note the add_noise parameter is passed to sense()
    Z = []
    
    theta = self.orientation
    for i in range(len(landmarks)):
        deltax = (landmarks[i][1] - self.x)
        deltay = (landmarks[i][0] - self.y)
        
        bearing = atan2(deltay,deltax) - theta
        if add_noise:
            bearing += random.gauss(0.0, self.bearing_noise)
            
        bearing = bearing % (2*pi)
        Z.append(bearing)

    return Z

######################################################################
# Grading methods
#
# Do not modify code below this point.
#
# The auto-grader does not use any of the below code
# 
######################################################################
landmarks  = [[0.0, 100.0], [0.0, 0.0], [100.0, 0.0], [100.0, 100.0]]
world_size = 100.0
max_steering_angle = old_div(pi, 4)  # You do not need to use this value, but keep in mind the limitations of a real car.
bearing_noise = 0.1 # Noise parameter: should be included in sense function.
steering_noise = 0.1 # Noise parameter: should be included in move function.
distance_noise = 5.0 # Noise parameter: should be included in move function.
tolerance_xy = 15.0 # Tolerance for localization in the x and y directions.
tolerance_orientation = 0.25 # Tolerance for orientation.
class robot(object):
    def __init__(self, length = 10.0, move=None, sense=None):
        self.x = random.random() * world_size # initial x position
        self.y = random.random() * world_size # initial y position
        self.orientation = random.random() * 2.0 * pi # initial orientation
        self.length = length # length of robot
        self.bearing_noise  = 0.0 # initialize bearing noise to zero
        self.steering_noise = 0.0 # initialize steering noise to zero
        self.distance_noise = 0.0 # initialize distance noise to zero
        self.move_func = move
        self.sense_func = sense
    
    def __repr__(self):
        return '[x=%.6s y=%.6s orient=%.6s]' % (str(self.x), str(self.y), str(self.orientation))

    def set(self, new_x, new_y, new_orientation):

        if new_orientation < 0 or new_orientation >= 2 * pi:
            raise ValueError('Orientation must be in [0..2pi]')
        self.x = float(new_x)
        self.y = float(new_y)
        self.orientation = float(new_orientation)

    def set_noise(self, new_b_noise, new_s_noise, new_d_noise):
        self.bearing_noise  = float(new_b_noise)
        self.steering_noise = float(new_s_noise)
        self.distance_noise = float(new_d_noise)

    def measurement_prob(self, measurements):
        predicted_measurements = self.sense(0) 

        if not isinstance(predicted_measurements, list) and not isinstance(predicted_measurements, tuple):
            raise RuntimeError( 'sense() expected to return a list, instead got %s' % type(predicted_measurements) )

        if len(predicted_measurements) != len(measurements):
            raise RuntimeError( '%d measurements but %d predicted measurements from sense'
                                % (len(measurements), len(predicted_measurements)) )

        error = 1.0
        for i in range(len(measurements)):
            error_bearing = abs(measurements[i] - predicted_measurements[i])
            error_bearing = (error_bearing + pi) % (2.0 * pi) - pi
            
            error *= (old_div(exp(old_div(- (error_bearing ** 2), (self.bearing_noise ** 2)) / 2.0),  
                      sqrt(2.0 * pi * (self.bearing_noise ** 2))))

        return error
    
    def move(self, motion):
        if self.move_func is not None:
            return self.move_func(self, motion)
        else:
            return self
    
    def sense(self, add_noise=1):
        if self.sense_func is not None:
            return self.sense_func(self, add_noise)
        else:
            return []