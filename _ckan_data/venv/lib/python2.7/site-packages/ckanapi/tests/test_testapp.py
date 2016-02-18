
import json
from io import BytesIO
try:
    import unittest2 as unittest
except ImportError:
    import unittest

import ckanapi


UPLOAD_DATA = b"""
public info
""".lstrip()

def wsgi_app(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'application/json')]

    path = environ['PATH_INFO']
    if path == '/api/action/hello_world':
        response = {'success': True, 'result': 'how are you?'}
    elif path == '/api/action/invalid':
        response = {'success': False, 'error': {'__type': 'Validation Error'}}
    elif path == '/api/action/echo':
        content = environ['wsgi.input'].read()
        response = {'success': True, 'result':
            json.loads(content)['message']}
    elif path == '/api/action/upload':
        # poor man's multipart parsing
        data = environ['wsgi.input'].read().split('\r\n')
        saw_file = False
        for i, s in enumerate(data):
            if saw_file:
                if s == b'':
                    break
            elif b'filename="f"' in s:
                saw_file = True
        response = {'success': True, 'result': data[i + 1].decode('ascii')}
    elif path == '/api/action/not_ckan':
        response = {'success': False, 'error': True}

    start_response(status, headers)
    return [json.dumps(response)]


class TestTestAPPCKAN(unittest.TestCase):
    def setUp(self):
        try:
            import paste.fixture
        except ImportError:
            raise unittest.SkipTest('paste not importable')
        self.test_app = paste.fixture.TestApp(wsgi_app)
        self.ckan = ckanapi.TestAppCKAN(self.test_app)

    def test_simple(self):
        self.assertEqual(
            self.ckan.action.hello_world(), 'how are you?')

    def test_invalid(self):
        self.assertRaises(
            ckanapi.ValidationError,
            self.ckan.action.invalid)

    def test_data(self):
        self.assertEqual(
            self.ckan.action.echo(message='for you'), 'for you')

    def test_upload_action(self):
        self.assertEqual(
            self.ckan.action.upload(package_id='42',
                f=BytesIO(UPLOAD_DATA)), 'public info\n')

    def test_not_ckan(self):
        self.assertRaises(
            ckanapi.ServerIncompatibleError,
            self.ckan.action.not_ckan)
