# What's this?

This repo contains a few demos of how to connect and query a database in javascript, using the node-postgres library (`pg`).

# pre-reqs

These demos attempt to connect to local or remote databases and expect the DB to contain tables such as `categories` and `words`.

# Setting up the demo database

Run this in your terminal

on linux:
```
sudo -u postgres createdb demos
```
on mac:
```
createdb demos
```

- Then connect to the database with an SQL GUI client (e.g beekeeper studio) and run all of the sql in [create-tables.sql](./create-tables.sql). This will create and populate the tables required for the demo.


# Setting up the node project

run 

```
yarn
```
to install the dependencies specified in `package.json`


# Setting up your connection string (e.g. for connection to a cloud-hosted db)

Some of the later demos require a connection string to be specified in .env:

- Save a copy of the `.env.example` file as `.env`
- Edit `.env` so that DATABASE_URL has the full connection string in it for whichever db you want to connect to.

For example, if you want to connect to the local demos db, and your database username is academy, your connection string might look like this:
`DATABASE_URL=postgresql://academy@localhost/demos`

[You can read more about connection string formats here](https://www.postgresql.org/docs/11/libpq-connect.html#:~:text=34.1.1.2.%C2%A0Connection%20URIs)

# Run a demo

```
node demo-query-local-db.js
```

# More on the demos

more info can be found in the materials page called "About the node-postgres demos from Academy"
