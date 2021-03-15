import unittest
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
from app import models
from app import *

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

class TestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'user1',
                KEY_EXPECTED: models.Person(username='user1', score=100)
            },
            {
                KEY_INPUT: 'Bob',
                KEY_EXPECTED: models.Person(username='Bob', score=100)
            },
            {
                KEY_INPUT: '!A@user!#$',
                KEY_EXPECTED: models.Person(username='!A@user!#$', score=100)
            },
            
        ]
        
        self.success_test_params2 = [
            {
                KEY_INPUT: 100,
                KEY_EXPECTED: 101
            },
            {
                KEY_INPUT: 5000,
                KEY_EXPECTED: 5001
            },
            {
                KEY_INPUT: 0,
                KEY_EXPECTED: 1
            }

            
        ]
        
        self.success_test_params3 = [
            {
                KEY_INPUT: 100,
                KEY_EXPECTED: 99
            },
            {
                KEY_INPUT: 2000,
                KEY_EXPECTED: 1999
            },
            {
                KEY_INPUT: 0,
                KEY_EXPECTED: -1
            },
        ]


    def test_success(self):
        for test in self.success_test_params:
            actual_result = new_user(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            
            self.assertEqual(actual_result.username, expected_result.username)
            self.assertEqual(actual_result.score, expected_result.score)
            
    def test_success2(self):
        for test in self.success_test_params2:
            actual_result = win_update(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(type(actual_result), type(expected_result))
    
    def test_success3(self):
        for test in self.success_test_params3:
            actual_result = lose_update(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(type(actual_result), type(expected_result))

if __name__ == '__main__':
    unittest.main()