# AirBNC

This project will aim to replicate a properties booking website where you can add houses to rent. You will be able to view several houses within the the search page. Selecting one will bring you to the dedicated page and allow you to see more information related to that house. You will be able to rent a house for X amount of day, blocking the house (since its been booked). You will be able to add reviews to houses and users.

## Install dependencies

```
npm i
```

## Creating and connecting to the database

```
Run the command 'npm run create-dbs'
```

## Linking the database

By creating a `.env.test` file and adding `PGDATABASE=airbnc_test` variable to it, you will be able to locally access the created database.

## Seed you database

```
npm run seed-dev
```
