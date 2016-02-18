"""
ckanapi
-------

This module a thin wrapper around the CKAN's action API.
"""

from ckanapi.errors import (
    CKANAPIError,
    NotAuthorized,
    NotFound,
    ValidationError,
    SearchQueryError,
    SearchError,
    SearchIndexError,
    ServerIncompatibleError,
    )
from ckanapi.localckan import LocalCKAN
from ckanapi.remoteckan import RemoteCKAN
from ckanapi.testappckan import TestAppCKAN






