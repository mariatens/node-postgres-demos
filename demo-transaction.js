//Adapted slightly from the official docs: https://node-postgres.com/features/transactions

//Sometimes we want a set of commands to run apparently as an atomic,
//unsplittable unit - all or nothing.  That's when we need a transaction.

// Here, to our quiz data, either we'll add a 'poets' category and three poets,
// or nothing at all.
// Run this demo and check in your database that
require("dotenv").config();

const { Client } = require("pg");

async function doDemo() {
  try {
    await doDemoPart1();
  } catch (err) {
    console.log("we EXPECT an exception here: ")
    console.error(err);
  }
  console.log("continuing to part 2 - reconnect to db and see what's in categories...")
  await doDemoPart2();
}


async function doDemoPart1() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  await client.connect();

  try {
    await client.query("BEGIN"); //mark the transaction start

    const res = await client.query(
      "INSERT INTO categories(name) VALUES($1) RETURNING id",
      ["poets"]
    );
    const category_id = res.rows[0].id; //the category id for poets.
    console.log("Successfully inserted a quiz category for poets");
    console.log("category_id for poets: ", category_id);

    await client.query("INSERT INTO words(category_id, word) VALUES ($1, $2)", [
      category_id,
      "Keats",
    ]);
    console.log("inserted poet: Keats");
    await client.query("INSERT INTO words(category_id, word) VALUES ($1, $2)", [
      category_id,
      "Neruda",
    ]);
    console.log("inserted poet: Neruda");

    //Let's say we now get the column name wrong in our next query.
    //In this case the whole transaction should be aborted,
    //with 'poets' category created, nor poets added to words.
    await client.query(
      "INSERT INTO words(category_id, POTATO) VALUES ($1, $2)",
      [category_id, "Shakespeare"]
    );
    console.log("inserted poet: Shakespeare");

    await client.query("COMMIT"); //commit the transaction, if we get this far without error
  } catch (e) {
    console.log("rolling back")
    await client.query("ROLLBACK"); //roll-back, if we get an error
    console.log("sent ROLLBACK")
    throw e;
  } finally {
    client.end();
  }
}

async function doDemoPart2() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const dbResult = await client.query("SELECT * FROM categories");
  console.table(dbResult.rows);
  client.end();
}

console.log(
  `This example is programmed to fail at a later one of many inserts.
  The entire set of changes should be discarded by postgres 
  i.e. you should afterwards find no category 'poets' in the categories table, 
  even though its insertion above was initially successful.
  ============================================================================
  `);

doDemo();
