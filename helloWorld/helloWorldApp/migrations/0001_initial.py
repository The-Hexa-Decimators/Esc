# Generated by Django 4.1.7 on 2023-02-21 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=255)),
                ('subcatgeory', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('amount', models.PositiveIntegerField()),
            ],
        ),
    ]
