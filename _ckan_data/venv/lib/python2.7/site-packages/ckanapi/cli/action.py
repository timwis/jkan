"""
implementation of the action cli command
"""

import sys
import json
from ckanapi.cli.utils import compact_json, pretty_json


def action(ckan, arguments,
        stdin=None):
    """
    call an action with KEY=VALUE args, yield the result
    """
    if stdin is None:
        stdin = getattr(sys.stdin, 'buffer', sys.stdin)

    if arguments['--input-json']:
        action_args = json.loads(stdin.read().decode('utf-8'))
    elif arguments['--input']:
        action_args = json.loads(open(
            arguments['--input']).read().decode('utf-8'))
    else:
        action_args = {}
        for kv in arguments['KEY=VALUE']:
            key, p, value = kv.partition('=')
            action_args[key] = value
    result = ckan.call_action(arguments['ACTION_NAME'], action_args)

    if arguments['--output-jsonl']:
        if isinstance(result, list):
            for r in result:
                yield compact_json(r) + b'\n'
        else:
            yield compact_json(result) + b'\n'
    elif arguments['--output-json']:
        yield compact_json(result) + b'\n'
    else:
        yield pretty_json(result) + b'\n'
