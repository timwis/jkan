import sys
from ckan.lib.cli import CkanCommand

from ckanapi.cli import main

class _Options(object):
    pass

class _DelegateParsing(object):
    usage = main.__doc__

    def parse_args(self, args):
        assert sys.argv[1:3] == ['--plugin=ckanapi', 'ckanapi'], sys.argv
        del sys.argv[1:3]
        arguments = main.parse_arguments()
        cfg = arguments['--config']
        options = _Options()
        options.config = cfg if cfg is not None else './development.ini'
        return options, []

class CKANAPICommand(CkanCommand):
    summary = main.__doc__.split('\n')[0]
    usage = main.__doc__
    parser = _DelegateParsing()

    def command(self):
        self._load_config()

        return main.main(running_with_paster=True)
