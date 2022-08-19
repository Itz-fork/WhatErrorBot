# What Error Bot
Simple telegram bot written is typescript to search for telegram api errors
inline


# Config
_config file can be found at: [config.ts](What/config.ts)_

- `bot_token` - Your telegram bot token
- `mongodb_url` - Your mongodb url (srv)


# ToDo after deploy
After deploying the app, wait for app to run for the first time. In the first
run it'll add all errors to the `WhatErrorBot_DB` database collection.

### Create a search index
- Navigate to search tab of the mongodb cluster
  - ![search tab](images/mongodb_search_tab.png "Search tab of the mongodb cluster")
- Click on "CREATE INDEX" button
- Select "JSON Editor"
- Paste the following json schema to the textarea
  ```
  {
      "mappings": {
      "dynamic": false,
      "fields": {
      "description": {
          "type": "string"
              },
      "error": {
          "type": "string"
              }
          }
      }
  }
  ```
- Save and wait for few minutes to create a searchable index

Done!


# License
Licensed under [MIT](License)