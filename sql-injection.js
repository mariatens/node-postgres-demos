const { Client } = require("pg");

async function doDemo() {
  const client = new Client({ database: 'musicbase' });
  await client.connect();

  const searchTerm = "ana";

  const text = `select * from artists where name like ${searchTerm}`; //this is now prone to sql injection attacks

  const res = await client.query(text);
  console.log(res.rows);
  await client.end();
}

doDemo();
