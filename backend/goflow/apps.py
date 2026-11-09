from django.contrib.admin.apps import AdminConfig
from django.contrib.auth.apps import AuthConfig
from django.contrib.contenttypes.apps import ContentTypesConfig


class GoFlowAdminConfig(AdminConfig):
    default_auto_field = "django.db.models.BigAutoField"


class GoFlowAuthConfig(AuthConfig):
    default_auto_field = "django.db.models.BigAutoField"


class GoFlowContentTypesConfig(ContentTypesConfig):
    default_auto_field = "django.db.models.BigAutoField"