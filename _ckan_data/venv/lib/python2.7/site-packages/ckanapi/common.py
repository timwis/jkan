"""
Code shared by LocalCKAN, RemoteCKAN and TestCKAN
"""

import json

from ckanapi.errors import (CKANAPIError, NotAuthorized, NotFound,
    ValidationError, SearchQueryError, SearchError, SearchIndexError,
    ServerIncompatibleError)

class ActionShortcut(object):
    """
    ActionShortcut(foo).bar(baz=2) <=> foo.call_action('bar', {'baz':2})

    An instance of this class is used as the .action attribute of
    LocalCKAN and RemoteCKAN instances to provide a short way to call
    actions, e.g::

        pkg = demo.action.package_show(id='adur_district_spending')

    instead of::

        pkg = demo.call_action('package_show', {'id':'adur_district_spending'})

    File-like values (objects with a 'read' attribute) are
    sent as file-uploads::

        pkg = demo.action.resource_update(package_id='foo', upload=open(..))

    becomes::

        pkg = demo.call_action('resource_update',
            {'package_id': 'foo'}, files={'upload': open(..)})

    """
    def __init__(self, ckan):
        self._ckan = ckan

    def __getattr__(self, name):
        def action(**kwargs):
            files = {}
            for k, v in kwargs.items():
                if is_file_like(v):
                    files[k] = v
            if files:
                nonfiles = dict((k, v) for k, v in kwargs.items()
                    if k not in files)
                return self._ckan.call_action(name,
                    data_dict=nonfiles,
                    files=files)
            return self._ckan.call_action(name, data_dict=kwargs)
        return action


def is_file_like(v):
    """
    Return True if this object is file-like or is a tuple in a format
    that the requests library would accept for uploading.
    """
    # see http://docs.python-requests.org/en/latest/user/quickstart/#more-complicated-post-requests
    return hasattr(v, 'read') or (
        isinstance(v, tuple) and len(v) >= 2 and hasattr(v[1], 'read'))


def prepare_action(action, data_dict=None, apikey=None, files=None):
    """
    Return action_url, data_json, http_headers
    """
    if not data_dict:
        data_dict = {}
    headers = {}
    if files:
        # when uploading files all parameters must be strings and
        # no nesting is allowed because request is sent as multipart
        items = data_dict.items()
        data_dict = {}
        for (k, v) in items:
            if v is None:
                continue  # assuming missing will work the same as None
            if isinstance(v, (int, float)):
                v = unicode(v)
            data_dict[k.encode('utf-8')] = v.encode('utf-8')
    else:
        data_dict = json.dumps(data_dict).encode('ascii')
        headers['Content-Type'] = 'application/json'
    if apikey:
        apikey = str(apikey)
        headers['X-CKAN-API-Key'] = apikey
        headers['Authorization'] = apikey
    url = 'api/action/' + action
    return url, data_dict, headers


def reverse_apicontroller_action(url, status, response):
    """
    Make an API call look like a direct action call by reversing the
    exception -> HTTP response translation that ApiController.action does
    """
    try:
        parsed = json.loads(response)
        if parsed.get('success'):
            return parsed['result']
        if hasattr(parsed, 'get'):
            err = parsed.get('error', {})
        else:
            err = {}
    except (AttributeError, ValueError):
        err = {}

    if not isinstance(err, dict):  # possibly a Socrata API.
        raise ServerIncompatibleError(repr([url, status, response]))

    etype = err.get('__type')
    emessage = err.get('message', '').split(': ', 1)[-1]
    if etype == 'Search Query Error':
        # I refuse to eval(emessage), even if it would be more correct
        raise SearchQueryError(emessage)
    elif etype == 'Search Error':
        # I refuse to eval(emessage), even if it would be more correct
        raise SearchError(emessage)
    elif etype == 'Search Index Error':
        raise SearchIndexError(emessage)
    elif etype == 'Validation Error':
        raise ValidationError(err)
    elif etype == 'Not Found Error':
        raise NotFound(emessage)
    elif etype == 'Authorization Error':
        raise NotAuthorized(err)

    # don't recognize the error
    raise CKANAPIError(repr([url, status, response]))
