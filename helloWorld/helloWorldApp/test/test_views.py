from django.test import TestCase, Client
from django.urls import reverse

class ViewsTestCase(TestCase):
    def test_index_loads_properly(self):
        """The page loads properly"""
        url = reverse("home_view")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

class ViewsTestCase(TestCase):
    def test_index_loads_properly(self):
        """The page loads properly"""
        url = reverse("home")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200) 