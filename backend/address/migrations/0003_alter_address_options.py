# Generated by Django 4.2 on 2024-12-11 12:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0002_alter_address_options_alter_address_email_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='address',
            options={'ordering': ('-status',), 'verbose_name_plural': 'Addresses'},
        ),
    ]
