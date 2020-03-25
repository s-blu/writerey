import unittest
from pathUtils import PathUtils


class PathUtilsTest(unittest.TestCase):

    def test_concatPathParts(self):
        testData = {
            "this/is/a/path": ["this", "is", "a", "path"],
            "this/is//a///pathWithDouble/Slashes": ["this", "is//", "a", "///pathWithDouble/", "/Slashes/"],
            "path/With/emptyElement": ["path", "With", "", "emptyElement"],
            "incomplete/splitted/path/list": ["incomplete", "splitted/path/list"],
            "incomplete/splitted\\windows/path\\list": ["incomplete", "splitted\\windows/path\\list"],
            "": [""],
            "": []
        }
        for result, testList in testData.items():
            self.assertEqual(PathUtils.concatPathParts(testList), result)

    def test_sanitizePathString(self):
        testData = {
            "this/is/a/path": "this/is/a/path",
            "this/is/a/pathWithDouble/Slashes": "this/is/a///pathWithDouble//Slashes",
            "path/With/LeadingAndEnding/Slash": "/path/With/LeadingAndEnding/Slash/",
            "windowsstyled/path/withBackslashes": "\\windowsstyled\\path\\withBackslashes",
            "": ""
        }
        for result, testData in testData.items():
            self.assertEqual(PathUtils.sanitizePathString(testData), result)

    def test_sanitizePathList(self):
        testData = {
            "this/is/a/path": ["this", "is", "a", "path"],
            "this/is/a/pathWithDouble/Slashes": ["this", "is//", "a", "///pathWithDouble/", "/Slashes/"],
            "path/With/emptyElement": ["path", "With", "", "emptyElement"],
            "incomplete/splitted/path/list": ["incomplete", "splitted/path/list"],
            "incomplete/splitted/windows/path/list": ["incomplete", "splitted\\windows/path\\list"],
            "": [""],
            "": []
        }
        for result, testList in testData.items():
            self.assertEqual(PathUtils.sanitizePathList(testList), result)

    def test_sanitizeFilename(self):
        testData = {
            "aCompletely_ValidFilename-that-needs.no.substitution": "aCompletely_ValidFilename-that-needs.no.substitution",
            "one_invalid_character": "one?invalid_character" ,
            "_a__lot_of_invalid_characters_": "<a//lot?of*invalid'characters>",
            "": ""
        }
        self.assertEqual(PathUtils.sanitizeFilename(None), '')
        for result, testData in testData.items():
            self.assertEqual(PathUtils.sanitizeFilename(testData), result)


if __name__ == '__main__':
    unittest.main()
