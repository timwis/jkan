import ckanapi
try:
    import unittest2 as unittest
except ImportError:
    import unittest


class TestCallAction(unittest.TestCase):
    def test_local_fail(self):
        try:
            import ckan
        except ImportError:
            raise unittest.SkipTest('ckan not importable')
        self.assertRaises(
            ckanapi.CKANAPIError,
            ckanapi.LocalCKAN('fake').call_action,
            'fake', {}, {}, 'apikey not allowed')

    def test_remote_fail(self):
        self.assertRaises(
            ckanapi.CKANAPIError,
            ckanapi.RemoteCKAN('fake').call_action,
            'fake', {}, 'context not allowed')

    def test_test_fail(self):
        self.assertRaises(
            ckanapi.CKANAPIError,
            ckanapi.TestAppCKAN('fake').call_action,
            'fake', {}, 'context not allowed')
