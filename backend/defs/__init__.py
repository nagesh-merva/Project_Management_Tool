"""
Definition modules for API endpoints.
This package contains all business logic functions organized by category.
"""

from . import auth
from . import utils
from . import employees
from . import departments
from . import tasks_updates
from . import projects
from . import clients
from . import analytics
from . import goals
from . import reports

__all__ = [
    'auth',
    'utils',
    'employees',
    'departments',
    'tasks_updates',
    'projects',
    'clients',
    'analytics',
    'goals',
    'reports',
]
