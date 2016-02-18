from ckanapi.cli.load import load_things, load_things_worker
from ckanapi.errors import NotFound, ValidationError, NotAuthorized
import json

try:
    import unittest2 as unittest
except ImportError:
    import unittest
from io import BytesIO

class MockCKAN(object):
    def call_action(self, name, data_dict):
        if name == 'package_show' and data_dict['id'] == 'seekrit':
            raise NotAuthorized('naughty user')
        if name == 'package_create' and data_dict['name'] == '34':
            raise ValidationError({'name': 'That URL is already in use.'})
        if name == 'organization_update':
            if data_dict['id'] == 'used' and data_dict.get('users') != [
                    'people']:
                raise ValidationError({'users': 'should be unchanged'})
            if data_dict['id'] == 'unused' and data_dict.get('users') != []:
                raise ValidationError({'users': 'should be cleared'})
        try:
            return {
                'package_show': {
                    '12': {'title': "Twelve"},
                    '30ish': {'id': '34', 'title': "Thirty-four"},
                    '34': {'id': '34', 'title': "Thirty-four"},
                    },
                'group_show': {
                    'ab': {'title': "ABBA"},
                    },
                'organization_show': {
                    'cd': {'id': 'cd', 'title': "Super Trouper"},
                    'used': {'users': ['people']},
                    'unused': {'users': ['people']},
                    },
                'package_create': {
                    None: {'name': 'something-new'},
                    },
                'package_update': {
                    '34': {'name': 'something-updated'},
                    },
                'group_update': {
                    'ab': {'name': 'group-updated'},
                    },
                'organization_update': {
                    'cd': {'name': 'org-updated'},
                    'used': {'name': 'users-unchanged'},
                    'unused': {'name': 'users-cleared'},
                    },
                'organization_create': {
                    None: {'name': 'org-created'},
                    },
                }[name][data_dict.get('id')]
        except KeyError:
            raise NotFound()


class TestCLILoad(unittest.TestCase):
    def setUp(self):
        self.ckan = MockCKAN()
        self.stdout = BytesIO()
        self.stderr = BytesIO()

    def test_create(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"name": "45","title":"Forty-five"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'create')
        self.assertEqual(error, None)
        self.assertEqual(data, 'something-new')

    def test_create_only(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': True,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"name": "45","title":"Forty-five"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'create')
        self.assertEqual(error, None)
        self.assertEqual(data, 'something-new')

    def test_create_bad_option(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': False,
                '--update-only': True,
                },
            stdin=BytesIO(b'{"name": "45","title":"Forty-five"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'show')
        self.assertEqual(error, 'NotFound')
        self.assertEqual(data, [None, '45'])

    def test_update(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"name": "30ish","title":"3.4 times ten"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'something-updated')

    def test_update_only(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': False,
                '--update-only': True,
                },
            stdin=BytesIO(b'{"name": "34","title":"3.4 times ten"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'something-updated')

    def test_update_bad_option(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': True,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"name": "34","title":"3.4 times ten"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'create')
        self.assertEqual(error, 'ValidationError')
        self.assertEqual(data, {'name': 'That URL is already in use.'})

    def test_update_unauthorized(self):
        load_things_worker(self.ckan, 'datasets', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"name": "seekrit", "title": "Things"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'show')
        self.assertEqual(error, 'NotAuthorized')
        self.assertEqual(data, 'naughty user')

    def test_update_group(self):
        load_things_worker(self.ckan, 'groups', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"id": "ab","title":"a balloon"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'group-updated')

    def test_update_organization_two(self):
        load_things_worker(self.ckan, 'organizations', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(
                b'{"name": "cd", "title": "Go"}\n'
                b'{"name": "ef", "title": "Play"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response.count(b'\n'), 2, response)
        self.assertEqual(response[-1:], b'\n')
        r1, r2 = response.split(b'\n', 1)
        timstamp, action, error, data = json.loads(r1.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'org-updated')
        timstamp, action, error, data = json.loads(r2.decode('UTF-8'))
        self.assertEqual(action, 'create')
        self.assertEqual(error, None)
        self.assertEqual(data, 'org-created')

    def test_update_organization_with_users_unchanged(self):
        load_things_worker(self.ckan, 'organizations', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"id": "used", "title": "here"}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'users-unchanged')

    def test_update_organization_with_users_cleared(self):
        load_things_worker(self.ckan, 'organizations', {
                '--create-only': False,
                '--update-only': False,
                },
            stdin=BytesIO(b'{"id": "unused", "users": []}\n'),
            stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, action, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(action, 'update')
        self.assertEqual(error, None)
        self.assertEqual(data, 'users-cleared')

    def test_parent_load_two(self):
        load_things(self.ckan, 'datasets', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--gzip': False,
                '--processes': '1',
                '--input': None,
                '--create-only': False,
                '--update-only': False,
                '--start-record': '1',
                '--max-records': None,
            },
            worker_pool=self._mock_worker_pool,
            stdin=BytesIO(
                b'{"name": "cd", "title": "Go"}\n'
                b'{"name": "ef", "title": "Play"}\n'
                ),
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'load', 'datasets', '--worker'])
        self.assertEqual(self.worker_processes, 1)
        self.assertEqual(self.worker_jobs, [
            (1, b'{"name": "cd", "title": "Go"}\n'),
            (2, b'{"name": "ef", "title": "Play"}\n'),
            ])

    def test_parent_load_start_max(self):
        load_things(self.ckan, 'groups', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--gzip': False,
                '--processes': '1',
                '--input': None,
                '--create-only': False,
                '--update-only': False,
                '--start-record': '2',
                '--max-records': '2',
            },
            worker_pool=self._mock_worker_pool,
            stdin=BytesIO(
                b'{"name": "cd", "title": "Go"}\n'
                b'{"name": "ef", "title": "Play"}\n'
                b'{"name": "gh", "title": "Hotel"}\n'
                b'{"name": "ij", "title": "Ambient"}\n'
                ),
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'load', 'groups', '--worker'])
        self.assertEqual(self.worker_processes, 1)
        self.assertEqual(self.worker_jobs, [
            (2, b'{"name": "ef", "title": "Play"}\n'),
            (3, b'{"name": "gh", "title": "Hotel"}\n'),
            ])

    def test_parent_parallel_limit(self):
        self.ckan.parallel_limit = 2
        load_things(self.ckan, 'datasets', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--gzip': False,
                '--processes': '5',
                '--input': None,
                '--create-only': False,
                '--update-only': False,
                '--start-record': '1',
                '--max-records': None,
            },
            worker_pool=self._mock_worker_pool,
            stdin=BytesIO(
                b'{"name": "cd", "title": "Go"}\n'
                b'{"name": "ef", "title": "Play"}\n'
                ),
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'load', 'datasets', '--worker'])
        self.assertEqual(self.worker_processes, 2)

    def _mock_worker_pool(self, cmd, processes, job_iter):
        self.worker_cmd = cmd
        self.worker_processes = processes
        self.worker_jobs = list(job_iter)
        for i, j in self.worker_jobs:
            jname = json.loads(j.decode('UTF-8'))
            yield [[], i, json.dumps(['some-date', None, None, {'id':jname}]
                ).encode('UTF-8') + b'\n']


