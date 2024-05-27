#!/bin/sh
echo "window.__ENV__ = {BACKEND_URL: \"$BACKEND_URL\"};" > /usr/share/nginx/html/env.js
exec "$@"