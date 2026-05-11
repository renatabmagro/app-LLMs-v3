const fs = require('fs');

const key = {
  "type": "service_account",
  "project_id": "project-llms-491212",
  "private_key_id": "6d700c5cddb40e89294287692934ef052db34a08",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLT42sBzyY0TDz\ntlTFB9oKFLQA60qVCwG9n1MChxJujKrs1du34GZyoP9IxKJwaEcSjZj65Px6TYAN\n4+KdsNcJUhBajtsRDanYzfGQfMXYiwKEDDjUGME3HZyOvTzOEcPe80c7q4jemDNn\nInzTV6XY3F6kfCrXAcPQ7IBXMbRn4Lx2qXD6sAfVGKx0hol2o4h9YPLigotKTMxz\nMNtMj0CCEui+F+bCnvUTvbX/bpe/U5P/UgMlXYIdUBtyH4D8UVhMlUH05CeyHktf\nSkG+AYt++pIQgJW4ai9DaAOXcprVGlHa/JMpymHnQVLdxvJs6SBXhTStFQnhpNh0\nhEfBp3g/AgMBAAECggEAJXpfwlN/Lyh43qRA0iVVY0BXwkedcwYZZwwksDWYBzr1\nEz2FCEtcd0sIZDCjRRdj6p6hkbZ+eEkrDuRwVONRcI1pKFhnN6iOI8IrApiNnBJb\n/12FaEu76l4SCxoFSHNr6QBtpClFzMq/xwZLfmYM04IkDCw7dXEE2NGQAwLNn8ww\nQ/CqHvk6M1XWeZ4Imlnq1mxUd6cZ1u2F2/Iqs9WKCJrSBn4hIlyMFkvYo9Z05v3S\n4nwpE/M76DsUwbs5Li6WB1KlTsZToDB9EimKDAenuoebcSjCRFlrvHxzzhzmRhlh\nfkHXjxrq1WPQ6jaIY9+BZgg4jmLDU22+iWnqjzAgeQKBgQD8xiVYuTmcdlZ7zHPL\nZ8xaA/ehjg9E81LdXmzKSpGTY4C2a2kHMhjNcBAZI+OsEi8nSA7HvEOOeNQg/72P\nEBlUC2MSSQkeeqfDAYnqzIo+kzlxqMKEZvSTK1bWOiOW4JszNLJp4Io3uIloq9hk\nvUYWPkOttNJGkNti+ZXdsL43bQKBgQDN582PaptUSDCou3kF+D2ch4qx2iC6Zf4X\neygn2dSHCZMYKuJqf7oVL5lgmV0BuddQ2BXfdqgT/YFGsYe1Pw6AF7vIXBT2OB4U\nL+zK3QCj0YOBe6LJZWKJYowISmnFRjFGc97xN7zD2RiJP7Iw0lPd4mGTX9p4bMyN\nrRmve7eG2wKBgQD0ekjAyVU5SRNYZWRRhTEWluO484c9LwIkbSFXfkvSe9iPls9c\nUE3A1PQc/KNFV8kXexAgiqvkbmTtDayvY+i7atAFbXJOcl8zspdL60yCPS7ACXMp\nT9KZTL+OL2kgklhJbFxrHutP/UGZZSvEM3RIKyyWI1+FNLGbxr32Tu2K+QKBgFkK\n1i0gB/4BnfFJ6UM4n8QyJTtWPfL9qk0TOEFLhQnEjTTVTsaJZ7pDtEs+5yaY7FEM\nsSDK2lKSvTYKDcrGcwnXuaAimfoEOJW4R+lOezlcoEb9ZV88lckdsbrgGy9xdFuo\nPhAIb3wuRNsNjYxpWFVK0bF+sSaEvkzCP6pQkQQjAoGAKtLfGmMiHPGpoTe1nhnQ\nbJH/wmODWaB+7W9QhSRbADU9sc9eUGD0LuIk7rOXujfpW7bAbssbrbUdDfMtiUEV\njYP0lKKIX9czbRZrqzFKt81XUheeT3Cgszhh4IKOABd9qGZC5QJhrvgopMoujmaV\nUp5FuJtpKKoLoEo4Nl1IYTs=\n-----END PRIVATE KEY-----\n",
  "client_email": "project-llms@project-llms-491212.iam.gserviceaccount.com",
  "client_id": "118064058697492171736",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/project-llms%40project-llms-491212.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

fs.writeFileSync('gee-key.json', JSON.stringify(key, null, 2));
