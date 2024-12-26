# API Reference

This document outlines the available API endpoints in Discord Clips.

## Videos API

### List Videos

```http
GET /api/videos
```

Returns a list of all videos.

### Response

```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "thumbnailUrl": "string",
      "videoUrl": "string",
      "createdAt": "string"
    }
  ]
}
```

### Get Video

```http
GET /api/videos/[id]
```

Returns details for a specific video.

### Response

```json
{
  "id": "string",
  "title": "string",
  "thumbnailUrl": "string",
  "videoUrl": "string",
  "createdAt": "string"
}
```

### Upload Video

```http
POST /api/videos/upload
```

Initiates video upload process.

**Request Body**

```json
{
  "title": "string",
  "contentType": "string"
}
```

**Response**

```json
{
  "id": "string",
  "uploadUrl": "string",
  "fields": {}
}
```

### Delete Video

```http
DELETE /api/videos/[id]/delete
```

Deletes a specific video.

**Response**

```json
{
  "success": true
}
```

### Get Video Thumbnail

```http
GET /api/videos/[id]/thumbnail
```

Returns the thumbnail for a specific video.

**Response**

- Image file (JPEG/PNG)

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API requests are limited to:

- 100 requests per minute per IP for GET requests
- 20 requests per minute per IP for POST/DELETE requests

## Authentication

Currently, the API does not require authentication. Future versions may implement authentication mechanisms. 