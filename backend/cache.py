import time

class Cache:
    def __init__(self):
        self._cache = {}

    def get(self, key):
        item = self._cache.get(key)
        if item and item['expires_at'] > time.time():
            return item['value']
        self.delete(key) # Item expired
        return None

    def set(self, key, value, ttl):
        self._cache[key] = {
            'value': value,
            'expires_at': time.time() + ttl
        }

    def delete(self, key):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache = {}

# Instantiate a global cache object
cache = Cache()

# Existing KMA warnings cache (can be integrated into the new Cache class later if needed)
kma_warnings_cache = {"data": []}
