import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
from app import models
from app import *

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'


class TestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'user1',
                KEY_EXPECTED: True,
            },
            {
                KEY_INPUT: 'tejas',
                KEY_EXPECTED: True,
            },
            {
                KEY_INPUT: 'Naman',
                KEY_EXPECTED: False,
            },
        ]

        self.success_test_params2 = [
            {
                KEY_INPUT: 'tejas',
                KEY_EXPECTED: {
                    INITIAL_USERNAME: 90,
                    'tejas': 100
                },
            },
            {
                KEY_INPUT: 'bob',
                KEY_EXPECTED: {
                    INITIAL_USERNAME: 90,
                    'tejas': 100,
                    'bob': 100
                },
            },
            {
                KEY_INPUT: 'guy',
                KEY_EXPECTED: {
                    INITIAL_USERNAME: 90,
                    'tejas': 100,
                    'bob': 100,
                    'guy': 100
                },
            },
        ]

        initial_person = models.Person(username=INITIAL_USERNAME, score=90)
        self.initial_list_mock = ['user1', 'tejas']
        self.initial_db_mock = [initial_person]

    def mocked_db_session_add(self, user):
        self.initial_db_mock.append(user)

    def mocked_db_session_commit(self):
        pass

    def mocked_person_query_all(self):
        return self.initial_db_mock

    def mocked_person_query_filter_by(self, user):
        if user in self.initial_list_mock:
            return True
        else:
            return False

    def test_success(self):
        print("TEST #1")
        for test in self.success_test_params:
            with patch('models.Person.query') as mocked_query:
                mocked_query.filter_by = self.mocked_person_query_filter_by
                actual_result = self.mocked_person_query_filter_by(test[KEY_INPUT])
                print("Actual: ", actual_result)
                expected_result = test[KEY_EXPECTED]
                print("Expected: ", expected_result)

                self.assertEqual(actual_result, expected_result)
                self.assertEqual(type(actual_result), type(expected_result))

    def test_success2(self):
        print("\nTEST #2")
        for test in self.success_test_params2:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit',
                          self.mocked_db_session_commit):
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        actual_result = add_to_db(test[KEY_INPUT])
                        print("Actual: ", actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print("Expected: ", expected_result)

                        self.assertDictEqual(actual_result, expected_result)
                        self.assertEqual(len(actual_result), len(expected_result))


if __name__ == '__main__':
    unittest.main()
