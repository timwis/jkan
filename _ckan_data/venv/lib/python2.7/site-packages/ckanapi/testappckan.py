import os.path

from ckanapi.errors import CKANAPIError
from ckanapi.common import (ActionShortcut, prepare_action,
    reverse_apicontroller_action)

class TestAppCKAN(object):
    """
    An interface to the the CKAN API actions on a paste TestApp

    :param test_app: the paste.fixture.TestApp instance, stored as
                    self.test_app
    :param apikey: the API key to pass as an 'X-CKAN-API-Key' header
                    when actions are called, stored as self.apikey
    """
    def __init__(self, test_app, apikey=None):
        self.test_app = test_app
        self.apikey = apikey
        self.action = ActionShortcut(self)

    def call_action(self, action, data_dict=None, context=None, apikey=None,
            files=None):
        """
        :param action: the action name, e.g. 'package_create'
        :param data_dict: the dict to pass to the action as JSON,
                          defaults to {}
        :param context: not supported
        :param files: None or {field-name: file-to-be-sent, ...}

        This function parses the response from the server as JSON and
        returns the decoded value.  When an error is returned this
        function will convert it back to an exception that matches the
        one the action function itself raised.
        """
        if context:
            raise CKANAPIError("TestAppCKAN.call_action does not support "
                "use of context parameter, use apikey instead")
        url, data, headers = prepare_action(action, data_dict,
                                            apikey or self.apikey, files)

        kwargs = {}
        if files:
            # Convert the list of (fieldname, file_object) tuples into the
            # (fieldname, filename, file_contents) tuples that webtests needs.
            upload_files = []
            for fieldname, file_ in files.items():
                if hasattr(file_, 'name'):
                    filename = os.path.split(file_.name)[1]
                else:
                    filename = fieldname
                upload_files.append( (fieldname, filename, file_.read()) )
            kwargs['upload_files'] = upload_files

        r = self.test_app.post('/' + url, data, headers, expect_errors=True,
                               **kwargs)
        return reverse_apicontroller_action(url, r.status, r.body)
