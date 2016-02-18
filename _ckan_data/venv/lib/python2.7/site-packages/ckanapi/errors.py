class ServerIncompatibleError(Exception):
    """
    The error raised from RemoteCKAN.call_action when the API doesn't behave
    like a CKAN API.
    """


class CKANAPIError(Exception):
    """
    The error raised from RemoteCKAN.call_action when no other error
    is recognized.

    If importing CKAN source fails then new versions of NotAuthorized,
    ValidationError, NotFound, SearchQueryError, SearchError and
    SearchIndexError are created as subclasses of this class so that they
    provide a helpful str() for tracebacks.
    """

    def __init__(self, extra_msg=None):
        self.extra_msg = extra_msg

    def __str__(self):
        return self.extra_msg


try:
    import ckan

except ImportError:
    # Implement the minimum to be compatible with existing errors
    # without requiring CKAN

    class NotAuthorized(CKANAPIError):
        pass

    class ValidationError(CKANAPIError):
        def __init__(self, error_dict):
            self.error_dict = error_dict
        def __str__(self):
            return repr(self.error_dict)

    class NotFound(CKANAPIError):
        def __init__(self, extra_msg=None):
            self.extra_msg = extra_msg
        def __str__(self):
            return self.extra_msg

    class SearchQueryError(CKANAPIError):
        pass

    class SearchError(CKANAPIError):
        pass

    class SearchIndexError(CKANAPIError):
        pass

else:
    # import ckan worked, so these must not fail
    from ckan.logic import (NotAuthorized, NotFound, ValidationError)
    from ckan.lib.search import (SearchQueryError, SearchError,
                                 SearchIndexError)

