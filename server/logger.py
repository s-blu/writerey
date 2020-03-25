from writerey_config import debugMode


class Logger:
    def __init__(self, pre=''):
        self.prefix = pre

    def logDebug(self, *msg):
        if (debugMode):
            print('[debug]', '[' + self.prefix + ']', msg)
