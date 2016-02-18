from ckanapi.cli.dump import dump_things, dump_things_worker
from ckanapi.errors import NotFound
import json
import tempfile
import shutil
from os.path import exists

try:
    import unittest2 as unittest
except ImportError:
    import unittest
from io import BytesIO


class MockCKAN(object):
    def call_action(self, name, data_dict):
        try:
            return {
                'package_list': {
                    None: ['12', '34', 'dp']
                    },
                'package_show': {
                    '12': {
                        'id': '12',
                        'name': 'twelve',
                        'title': "Twelve"},
                    '34': {
                        'id': '34',
                        'name': 'thirtyfour',
                        'title': "Thirty-four"},
                    'dp': {
                        'id': 'dp',
                        'name': 'dp',
                        'title': 'Test for datapackage',
                        'resources':[
                            {'name': 'resource1',
                             'format': 'html',
                             'url':'http://example.com/test-file'}]}
                    },
                'group_show': {
                    'ab': {'title': "ABBA"},
                    },
                'organization_show': {
                    'cd': {'title': "Super Trouper"},
                    },
                }[name][data_dict.get('id')]
        except KeyError:
            raise NotFound()


class TestCLIDump(unittest.TestCase):
    def setUp(self):
        self.ckan = MockCKAN()
        self.stdout = BytesIO()
        self.stderr = BytesIO()

    def test_worker_one(self):
        rval = dump_things_worker(self.ckan, 'datasets', {},
            stdin=BytesIO(b'"34"\n'), stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(error, None)
        self.assertEqual(data["title"], "Thirty-four")

    def test_worker_two(self):
        rval = dump_things_worker(self.ckan, 'datasets', {},
            stdin=BytesIO(b'"12"\n"34"\n'), stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response.count(b'\n'), 2, response)
        self.assertEqual(response[-1:], b'\n')
        r1, r2 = response.split(b'\n', 1)
        timstamp, error, data = json.loads(r1.decode('UTF-8'))
        self.assertEqual(error, None)
        self.assertEqual(data["title"], "Twelve")
        timstamp, error, data = json.loads(r2.decode('UTF-8'))
        self.assertEqual(error, None)
        self.assertEqual(data["title"], "Thirty-four")

    def test_worker_error(self):
        dump_things_worker(self.ckan, 'datasets', {},
            stdin=BytesIO(b'"99"\n'), stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(error, "NotFound")
        self.assertEqual(data, None)

    def test_worker_group(self):
        dump_things_worker(self.ckan, 'groups', {},
            stdin=BytesIO(b'"ab"\n'), stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(error, None)
        self.assertEqual(data, {"title":"ABBA"})

    def test_worker_organization(self):
        dump_things_worker(self.ckan, 'organizations', {},
            stdin=BytesIO(b'"cd"\n'), stdout=self.stdout)
        response = self.stdout.getvalue()
        self.assertEqual(response[-1:], b'\n')
        timstamp, error, data = json.loads(response.decode('UTF-8'))
        self.assertEqual(error, None)
        self.assertEqual(data, {"title":"Super Trouper"})

    def test_parent_dump_all(self):
        dump_things(self.ckan, 'datasets', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--output': None,
                '--datapackages': None,
                '--gzip': False,
                '--all': True,
                '--processes': '1',
                '--get-request': False,
            },
            worker_pool=self._mock_worker_pool,
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'dump', 'datasets', '--worker',
            'value-here-to-make-docopt-happy'])
        self.assertEqual(self.worker_processes, 1)
        self.assertEqual(self.worker_jobs,
            [(0, b'"12"\n'), (1, b'"34"\n'), (2, b'"dp"\n')])

    def test_parent_parallel_limit(self):
        self.ckan.parallel_limit = 2
        dump_things(self.ckan, 'datasets', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--output': None,
                '--datapackages': None,
                '--gzip': False,
                '--all': False,
                'ID_OR_NAME': ['12'],
                '--processes': '5',
                '--get-request': False,
            },
            worker_pool=self._mock_worker_pool,
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'dump', 'datasets', '--worker',
            'value-here-to-make-docopt-happy'])
        self.assertEqual(self.worker_processes, 2)

    def test_parent_id_argument(self):
        dump_things(self.ckan, 'groups', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--output': None,
                '--datapackages': None,
                '--gzip': False,
                '--all': False,
                'ID_OR_NAME': ['ab'],
                '--processes': '1',
                '--get-request': False,
            },

            worker_pool=self._mock_worker_pool,
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'dump', 'groups', '--worker',
            'value-here-to-make-docopt-happy'])
        self.assertEqual(self.worker_processes, 1)
        self.assertEqual(self.worker_jobs, [(0, b'"ab"\n')])

    def test_parent_maintain_order(self):
        dump_things(self.ckan, 'organizations', {
                '--quiet': False,
                '--ckan-user': None,
                '--config': None,
                '--remote': None,
                '--apikey': None,
                '--worker': False,
                '--log': None,
                '--output': None,
                '--datapackages': None,
                '--gzip': False,
                '--all': False,
                'ID_OR_NAME': ['P', 'Q', 'R', 'S'],
                '--processes': '1',
                '--get-request': False,
            },
            worker_pool=self._mock_worker_pool_reversed,
            stdout=self.stdout,
            stderr=self.stderr)
        self.assertEqual(self.worker_cmd, [
            'ckanapi', 'dump', 'organizations', '--worker',
            'value-here-to-make-docopt-happy'])
        self.assertEqual(self.worker_processes, 1)
        self.assertEqual(self.stdout.getvalue(),
            b'{"id":"P"}\n'
            b'{"id":"Q"}\n'
            b'{"id":"R"}\n'
            b'{"id":"S"}\n')

    def test_parent_datapackages(self):
        target = tempfile.mkdtemp()
        try:
            dump_things(self.ckan, 'datasets', {
                    '--quiet': False,
                    '--ckan-user': None,
                    '--config': None,
                    '--remote': None,
                    '--apikey': None,
                    '--worker': False,
                    '--log': None,
                    '--output': None,
                    '--datapackages': target,
                    '--gzip': False,
                    '--all': True,
                    '--processes': '1',
                    '--get-request': False,
                },
                worker_pool=self._mock_worker_pool_with_data,
                stdout=self.stdout,
                stderr=self.stderr)
            assert exists(target + '/twelve/datapackage.json')
            assert exists(target + '/thirtyfour/datapackage.json')
            assert exists(target + '/dp/datapackage.json')
            assert exists(target + '/dp/data/test-file')
        finally:
            shutil.rmtree(target)


    def _mock_worker_pool(self, cmd, processes, job_iter):
        self.worker_cmd = cmd
        self.worker_processes = processes
        self.worker_jobs = list(job_iter)
        for i, j in self.worker_jobs:
            jname = json.loads(j.decode('UTF-8'))
            yield [[], i, json.dumps(['some-date', None, {'id': jname}]
                ).encode('UTF-8') + b'\n']

    def _mock_worker_pool_reversed(self, cmd, processes, job_iter):
        return reversed(list(
            self._mock_worker_pool(cmd, processes, job_iter)))

    def _mock_worker_pool_with_data(self, cmd, processes, job_iter):
        self.worker_cmd = cmd
        self.worker_processes = processes
        self.worker_jobs = list(job_iter)
        for i, j in self.worker_jobs:
            jname = json.loads(j.decode('UTF-8'))
            yield [[], i, json.dumps(['some-date', None,
                self.ckan.call_action('package_show', {'id': jname})]
                ).encode('UTF-8') + b'\n']

