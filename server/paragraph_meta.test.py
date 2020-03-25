import unittest

class PathUtilsTest(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOo')

if __name__ == '__main__':
    unittest.main()