# Generated by Django 4.2 on 2024-12-05 23:06

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='address',
            options={'ordering': ('-date_added', '-status'), 'verbose_name_plural': 'Addresses'},
        ),
        migrations.AlterField(
            model_name='address',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, validators=[django.core.validators.EmailValidator()]),
        ),
        migrations.AlterField(
            model_name='address',
            name='mobile',
            field=models.CharField(blank=True, max_length=15, null=True, validators=[django.core.validators.RegexValidator('^\\+?\\d{10,15}$', message='Invalid phone number.')]),
        ),
        migrations.AddConstraint(
            model_name='address',
            constraint=models.UniqueConstraint(condition=models.Q(('status', True)), fields=('user',), name='unique_default_address'),
        ),
    ]
