"""
implementation of load cli command
"""

import sys
import gzip
import json
from datetime import datetime

from ckanapi.errors import (NotFound, NotAuthorized, ValidationError,
    SearchIndexError)
from ckanapi.cli import workers
from ckanapi.cli.utils import completion_stats, compact_json, quiet_int_pipe

try:
    unicode
except NameError:
    unicode = str


def load_things(ckan, thing, arguments,
        worker_pool=None, stdin=None, stdout=None, stderr=None):
    """
    create and update datasets, groups and orgs

    The parent process creates a pool of worker processes and hands
    out json lines to each worker as they finish a task. Status of
    last record completed and records being processed is displayed
    on stderr.
    """
    if worker_pool is None:
        worker_pool = workers.worker_pool
    if stdin is None:
        stdin = getattr(sys.stdin, 'buffer', sys.stdin)
    if stdout is None:
        stdout = getattr(sys.stdout, 'buffer', sys.stdout)
    if stderr is None:
        stderr = getattr(sys.stderr, 'buffer', sys.stderr)

    if arguments['--worker']:
        return load_things_worker(ckan, thing, arguments)

    log = None
    if arguments['--log']:
        log = open(arguments['--log'], 'a')

    jsonl_input = stdin
    if arguments['--input']:
        jsonl_input = open(arguments['--input'], 'rb')
    if arguments['--gzip']:
        jsonl_input = gzip.GzipFile(fileobj=jsonl_input)

    def line_reader():
        """
        handle start-record and max-records options
        """
        start_record = int(arguments['--start-record'])
        max_records = arguments['--max-records']
        if max_records is not None:
            max_records = int(max_records)
        for num, line in enumerate(jsonl_input, 1): # records start from 1
            if num < start_record:
                continue
            if max_records is not None and num >= start_record + max_records:
                break
            yield num, line

    cmd = _worker_command_line(thing, arguments)
    processes = int(arguments['--processes'])
    if hasattr(ckan, 'parallel_limit'):
        # add your sites to ckanapi.remoteckan.MY_SITES instead of removing
        processes = min(processes, ckan.parallel_limit)
    stats = completion_stats(processes)
    pool = worker_pool(cmd, processes, line_reader())

    with quiet_int_pipe() as errors:
        for job_ids, finished, result in pool:
            timestamp, action, error, response = json.loads(
                result.decode('utf-8'))

            if not arguments['--quiet']:
                stderr.write(('%s %s %s %s %s %s\n' % (
                    finished,
                    job_ids,
                    next(stats),
                    action,
                    error,
                    compact_json(response).decode('utf-8') if response else ''
                    )).encode('utf-8'))

            if log:
                log.write(compact_json([
                    timestamp,
                    finished,
                    action,
                    error,
                    response,
                    ]) + b'\n')
                log.flush()
    if 'pipe' in errors:
        return 1
    if 'interrupt' in errors:
        return 2


def load_things_worker(ckan, thing, arguments,
        stdin=None, stdout=None):
    """
    a process that accepts lines of json on stdin which is parsed and
    passed to the {thing}_create/update actions.  it produces lines of json
    which are the responses from each action call.
    """
    if stdin is None:
        stdin = getattr(sys.stdin, 'buffer', sys.stdin)
    if stdout is None:
        stdout = getattr(sys.stdout, 'buffer', sys.stdout)

    thing_show, thing_create, thing_update = {
        'datasets': (
            'package_show', 'package_create', 'package_update'),
        'groups': (
            'group_show', 'group_create', 'group_update'),
        'organizations': (
            'organization_show', 'organization_create', 'organization_update'),
        }[thing]

    def reply(action, error, response):
        """
        format messages to be sent back to parent process
        """
        stdout.write(compact_json([
            datetime.now().isoformat(),
            action,
            error,
            response]) + b'\n')
        stdout.flush()

    for line in iter(stdin.readline, b''):
        try:
            obj = json.loads(line.decode('utf-8'))
        except UnicodeDecodeError as e:
            obj = None
            reply('read', 'UnicodeDecodeError', unicode(e))
            continue

        if obj:
            existing = None
            if not arguments['--create-only']:
                # use either id or name to locate existing records
                name = obj.get('id')
                if name:
                    try:
                        existing = ckan.call_action(thing_show,
                            {'id': name, 'include_datasets': False})
                    except NotFound:
                        pass
                    except NotAuthorized as e:
                        reply('show', 'NotAuthorized', unicode(e))
                        continue
                name = obj.get('name')
                if not existing and name:
                    try:
                        existing = ckan.call_action(thing_show, {'id': name})
                    except NotFound:
                        pass
                    except NotAuthorized as e:
                        reply('show', 'NotAuthorized', unicode(e))
                        continue

                if existing:
                    _copy_from_existing_for_update(obj, existing, thing)

                # FIXME: compare and reply when 'unchanged'?

            if not existing and arguments['--update-only']:
                reply('show', 'NotFound', [obj.get('id'), obj.get('name')])
                continue

            act = 'update' if existing else 'create'
            try:
                if existing:
                    r = ckan.call_action(thing_update, obj)
                else:
                    r = ckan.call_action(thing_create, obj)
            except ValidationError as e:
                reply(act, 'ValidationError', e.error_dict)
            except SearchIndexError as e:
                reply(act, 'SearchIndexError', unicode(e))
            except NotAuthorized as e:
                reply(act, 'NotAuthorized', unicode(e))
            except NotFound:
                reply(act, 'NotFound', obj)
            else:
                reply(act, None, r['name'])


def _worker_command_line(thing, arguments):
    """
    Create a worker command line suitable for Popen with only the
    options the worker process requires
    """
    def a(name):
        "options with values"
        return [name, arguments[name]] * (arguments[name] is not None)
    def b(name):
        "boolean options"
        return [name] * bool(arguments[name])
    return (
        ['ckanapi', 'load', thing, '--worker']
        + a('--config')
        + a('--ckan-user')
        + a('--remote')
        + a('--apikey')
        + b('--create-only')
        + b('--update-only')
        )


def _copy_from_existing_for_update(obj, existing, thing):
    """
    modifies obj dict in place, copying values from existing.

    the id is alwasys copied from existing to make sure update updates
    the correct object.

    users lists for groups and orgs are maintained if not present in obj
    """
    if 'id' in existing:
        obj['id'] = existing['id']

    if thing in ('organizations', 'groups'):
        if 'users' not in obj and 'users' in existing:
            obj['users'] = existing['users']
