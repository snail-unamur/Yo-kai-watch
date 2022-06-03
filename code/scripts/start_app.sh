#!/bin/sh

# Start the backend
npm run --prefix "./backend api bridge" start &

# Start the frontend
nginx -g "daemon off;"

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?