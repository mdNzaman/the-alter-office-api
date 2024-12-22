# Asssingment - API Reference

[//]: # 'Use dillinger.io for pdf export'

## Base URLs

#### Development:

- `http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/`

## 1. Ping

### Description

The reachability of the host can be checked through the Ping API. The API responds with a `pong` to communicate availability to the requesting client.

### Method

`GET`

### URL

`/ping`

### Headers

`None`

### Query

`None`

### Body

`None`

### curl

```
curl -X GET 'https://http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/ping'
```

### Response Type

`String`

### Response

```
pong
```

## 2. Google SignIn

### Description

Google Sign-In through the browser and use the retrieved token to authenticate requests to other APIs. 

### Method

`GET`

### URL

`/auths/google`

### Headers

`None`

### Query

`None`

### Body

`None`

### curl

`None`

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "user": {
            "id": 1,
            "email": "nooruz.zaman@xane.ai",
            "active": 1
        },
        "session": {
            "id": 1,
            "email": "nooruz.zaman@xane.ai",
            "token": "2e37d37c2df54a37b89a544290978509",
            "user_id": 1,
            "expiry": "2024-12-10T06:41:09.000Z",
            "active": 1,
            "device_id": 1,
            "identifier": "default.device",
            "origin_id": 1,
            "platform_id": 1,
            "app_version": 1,
            "user_agent": "Node.js/16.2.0 (Linux 6.1; arm64)"
        }
    }
}
```

## 3. Create Short URL

### Description

Create a new short URL to facilitate easy sharing of long URLs.

### Method

`POST`

### URL

`/api/shorten`

### Headers

- `x-identifier`: Unique device identifier for the end-user.
- `x-auth` : Session token for the end-user.
- `x-origin`: Origin of any API call. 1 for end-user app.
- `x-platform`: Device platform. 1 for Web, 2 for iOS, 3 for Android.
- `user-agent`: Optional, but recommended. User Agent used for calling the API.

### Query

`None`

### Body

`None`

### curl

```
curl --location 'http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api/shorten' \
--header 'x-auth: 7e42a77ed2bf4da78ae597a2b664be2f' \
--header 'x-platform: 1' \
--header 'x-origin: 1' \
--header 'x-version: 1' \
--header 'identifier: default.device' \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3ALd2EynNfu8ut7m8q4V-7_7GNffFQL1lv.YVJsCGeN7a2xv9acQlj04%2BU5nmV%2BTtbD60ZX5zJJlGM' \
--data '{
    "long_url": "api/test.com/test",
    "alias": "api.test",
    "topic": "activation"
}'
```

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "short_url": {
            "short_url": "http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api.test",
            "created_at": "2024-12-22T13:05:31.000Z"
        }
    }
}
```

## 4. Redirect Short URL API

### Description

Redirect to the original URL based on the short URL alias. Note: For now it returns the redirected url.

### Method

`GET`

### URL

` /api/shorten/:alias`

### Headers

- `x-identifier`: Unique device identifier for the end-user.
- `x-auth` : Session token for the end-user.
- `x-origin`: Origin of any API call. 1 for end-user app.
- `x-platform`: Device platform. 1 for Web, 2 for iOS, 3 for Android.
- `user-agent`: Optional, but recommended. User Agent used for calling the API.

### Query

`None`

### Body

`None`

### curl

```
curl --location 'http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api/shorten/api.test' \
--header 'x-auth: 7e42a77ed2bf4da78ae597a2b664be2f' \
--header 'x-platform: 1' \
--header 'x-origin: 1' \
--header 'x-version: 1' \
--header 'identifier: default.device' \
--header 'Cookie: connect.sid=s%3ALd2EynNfu8ut7m8q4V-7_7GNffFQL1lv.YVJsCGeN7a2xv9acQlj04%2BU5nmV%2BTtbD60ZX5zJJlGM'
```

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "short_url": {
            "short_url": "http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api.test",
            "created_at": "2024-12-22T13:05:31.000Z"
        }
    }
}
```

## 5. Get URL Analytics API

### Description

Retrieve detailed analytics for a specific short URL.

### Method

`GET`

### URL

`/api/analytics/:alias`

### Headers

- `x-identifier`: Unique device identifier for the end-user.
- `x-auth` : Session token for the end-user.
- `x-origin`: Origin of any API call. 1 for end-user app.
- `x-platform`: Device platform. 1 for Web, 2 for iOS, 3 for Android.
- `user-agent`: Optional, but recommended. User Agent used for calling the API.

### Query

`None`

### Body

`None`

### curl

```
curl --location 'http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api/analytics/api.test' \
--header 'x-auth: 7e42a77ed2bf4da78ae597a2b664be2f' \
--header 'x-platform: 1' \
--header 'x-origin: 1' \
--header 'x-version: 1' \
--header 'identifier: default.device' \
--header 'Cookie: connect.sid=s%3ALd2EynNfu8ut7m8q4V-7_7GNffFQL1lv.YVJsCGeN7a2xv9acQlj04%2BU5nmV%2BTtbD60ZX5zJJlGM'
```

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "analytics": {
            "totalClicks": 1,
            "uniqueClicks": 1,
            "clicksByDate": [
                {
                    "date": "2024-12-22T13:08:33.000Z",
                    "clickCount": 1
                }
            ],
            "osType": [
                {
                    "osName": "macOS",
                    "uniqueClicks": 1,
                    "uniqueUsers": 1
                }
            ],
            "deviceType": [
                {
                    "deviceName": "Desktop",
                    "uniqueClicks": 1,
                    "uniqueUsers": 1
                }
            ]
        }
    }
}
```

## 6. Get Topic-Based Analytics API

### Description

Retrieve analytics for all short URLs grouped under a specific topic.

### Method

`GET`

### URL

`/api/analytics/topic/:topic`

### Headers

- `x-identifier`: Unique device identifier for the end-user.
- `x-auth` : Session token for the end-user.
- `x-origin`: Origin of any API call. 1 for end-user app.
- `x-platform`: Device platform. 1 for Web, 2 for iOS, 3 for Android.
- `user-agent`: Optional, but recommended. User Agent used for calling the API.

### Query

`None`

### Body

`None`

### curl

```
curl --location 'http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api/analytics/topic/activation' \
--header 'x-auth: 7e42a77ed2bf4da78ae597a2b664be2f' \
--header 'x-platform: 1' \
--header 'x-origin: 1' \
--header 'x-version: 1' \
--header 'identifier: default.device' \
--header 'Cookie: connect.sid=s%3ALd2EynNfu8ut7m8q4V-7_7GNffFQL1lv.YVJsCGeN7a2xv9acQlj04%2BU5nmV%2BTtbD60ZX5zJJlGM'
```

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "analytics": {
            "totalClicks": 6,
            "uniqueClicks": 1,
            "clicksByDate": [
                {
                    "date": "2024-12-22T13:08:33.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:44:44.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:58.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:57.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:56.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:05.000Z",
                    "clickCount": 1
                }
            ],
            "urls": [
                {
                    "shortUrl": "api.test",
                    "totalClicks": 1,
                    "uniqueClicks": 1
                },
                {
                    "shortUrl": "test",
                    "totalClicks": 5,
                    "uniqueClicks": 1
                }
            ]
        }
    }
}
```

## 7. Get Overall Analytics API

### Description

Retrieve overall analytics for all short URLs created by the authenticated user.

### Method

`GET`

### URL

`/api/analytics/overall`

### Headers

- `x-identifier`: Unique device identifier for the end-user.
- `x-auth` : Session token for the end-user.
- `x-origin`: Origin of any API call. 1 for end-user app.
- `x-platform`: Device platform. 1 for Web, 2 for iOS, 3 for Android.
- `user-agent`: Optional, but recommended. User Agent used for calling the API.

### Query

`None`

### Body

`None`

### curl

```
curl --location 'http://ec2-13-201-183-194.ap-south-1.compute.amazonaws.com:3000/api/analytics/overall' \
--header 'x-auth: 7e42a77ed2bf4da78ae597a2b664be2f' \
--header 'x-platform: 1' \
--header 'x-origin: 1' \
--header 'x-version: 1' \
--header 'identifier: default.device' \
--header 'Cookie: connect.sid=s%3ALd2EynNfu8ut7m8q4V-7_7GNffFQL1lv.YVJsCGeN7a2xv9acQlj04%2BU5nmV%2BTtbD60ZX5zJJlGM'
```

### Response Type

`JSON`

### Response

```
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "analytics": {
            "totalUrls": 2,
            "totalClicks": 6,
            "uniqueClicks": 1,
            "clicksByDate": [
                {
                    "date": "2024-12-22T13:08:33.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:44:44.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:58.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:57.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:56.000Z",
                    "clickCount": 1
                },
                {
                    "date": "2024-12-22T12:10:05.000Z",
                    "clickCount": 1
                }
            ],
            "osType": [
                {
                    "osName": "macOS",
                    "uniqueClicks": 1,
                    "uniqueUsers": 1
                }
            ],
            "deviceType": [
                {
                    "deviceName": "Desktop",
                    "uniqueClicks": 1,
                    "uniqueUsers": 1
                }
            ]
        }
    }
}
```
