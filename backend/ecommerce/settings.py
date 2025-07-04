import environ

import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

env = environ.Env(
    DEBUG=(bool, False)
)
from corsheaders.defaults import default_headers


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'channels',
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    "djoser",
    'core',
    'social_accounts',
    'rest_framework_simplejwt.token_blacklist',
    'userauths',
    'product',
    'vendor',
    'order',
    'address',
    'customer',
    'payments',
    'ckeditor',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    # 'order.middleware.CartIDMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'ecommerce.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ecommerce.wsgi.application'
ASGI_APPLICATION = 'ecommerce.asgi.application'

# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels_redis.core.RedisChannelLayer",
#         "CONFIG": {
#             "hosts": [("127.0.0.1", 6379)],
#         },
#     },
# }

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'userauths.authentication.CustomJWTAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.IsAuthenticated',
    # ],

    # 'DEFAULT_THROTTLE_RATES': {
    #     'anon': '4000/day',
    #     'user': '1000/day',
    # }
}

 



GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET_ID = env('GOOGLE_CLIENT_SECRET_ID')
SOCIAL_AUTH_PASSWORD = env('SOCIAL_AUTH_PASSWORD')


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CKEDITOR_UPLOAD_PATH = 'uploads/'

AUTHENTICATION_BACKENDS = [
    'userauths.backends.EmailOrPhoneBackend',
    'django.contrib.auth.backends.ModelBackend',
]

AUTH_USER_MODEL = 'userauths.User'

######################################
PAYSTACK_SECRET_KEY = "sk_test_08697652e07898b20f337875bdd241b668a2abaa"
PAYSTACK_PUBLIC_KEY = "pk_test_1a9405c84346cd5f9b41a65524aa546d859be3d0"
######################################

SITE_NAME="NegroMart"
DOMAIN = "http://localhost:3000"

# Emailing settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'oseiagyemanjohn@gmail.com'
EMAIL_HOST_PASSWORD = 'jrsbfgzjqvtytcdc'
EMAIL_PORT = 587
EMAIL_USE_TLS = True


SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
# SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
SESSION_CACHE_ALIAS = 'default'
# SESSION_SAVE_EVERY_REQUEST = True 

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',  # Connect to remote Redis server
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'MAX_CONNECTION_POOL_SIZE': 10,
            'IGNORE_EXCEPTIONS': True,
        },
    }
}

# CELERY_BROKER_URL = 'redis://localhost:6379/0'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'


DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': env('REDIRECT_URLS').split(',')
}

from datetime import timedelta

AUTH_COOKIE = 'access'
AUTH_ACCESS_MAX_AGE = timedelta(hours=1).total_seconds()
AUTH_REFRESH_MAX_AGE = timedelta(days=60).total_seconds()
AUTH_COOKIE_SECURE = False
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'Lax'

from datetime import timedelta

SIMPLE_JWT = {
    # Access Token Lifetime - 1 hour to balance security and UX
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    
    # Refresh Token Lifetime - 60 days, for long-term sessions
    'REFRESH_TOKEN_LIFETIME': timedelta(days=60),
    
    # Enable token rotation for better security
    'ROTATE_REFRESH_TOKENS': True,
    
    # Blacklist old refresh tokens after they are rotated
    'BLACKLIST_AFTER_ROTATION': False,
    
    # Algorithm for signing the JWT
    'ALGORITHM': 'HS256',
    
    # HTTP Header for token authorization
    'AUTH_HEADER_TYPES': ('Bearer',),

    
    # Enabling sliding token lifetimes for smoother sessions
    'SLIDING_TOKEN_LIFETIME': timedelta(hours=1),  # Sliding token lifetime 1 hour
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=60),  # Refresh token sliding window
    
    # Token user class (use custom user model if required)
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
    # Enable JTI claim for each token (JWT ID)
    'JTI_CLAIM': 'jti',

    # Security leeway for potential timing discrepancies
    'LEEWAY': 30,  # Allow a 30-second leeway for clock discrepancies
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js frontend URL
]
# CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-guest-cart",
    "x-ssr-refresh",
    'cache-control'
]


# SESSION_COOKIE_SAMESITE = 'None'
# SESSION_COOKIE_HTTPONLY = True
# SESSION_COOKIE_SECURE = False  # True in production
