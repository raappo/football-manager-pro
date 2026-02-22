# database/Dockerfile
FROM mysql:8.0

# Copy all SQL scripts into the initialization directory
# This completely avoids OS-level permission issues on Windows/Mac/Linux
COPY ./*.sql /docker-entrypoint-initdb.d/

# Ensure the files have the correct permissions inside the container
RUN chmod -R 755 /docker-entrypoint-initdb.d/