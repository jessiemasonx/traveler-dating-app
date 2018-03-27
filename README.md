# Traveler_App

This application is a basic level dating platform for people who love to travel, but who have not found a soulmate yet.

## Description

On the [homepage](<localhost:8000>) users can see an overview of available travelers, who use the application. This has been done, to get users to sign up and get inspired for filling in their profiles.

Users can sign up for their account on the homepage, as well as sign in here, given they already have an account.
When users sign up, their account is created and partially filled in, with things like their e-mail and name.

When users have succesfully signed up, they are taken to the 'questionaire' page. Here they are asked to fill in their profile (not everything is required, however). They can only *continue using their account* if they finish filling in the required fields.

<!-- Build this -->
If they leave the page and sign in, while not having finished the questionaire correctly, then they will be sent back to the questionaire.

When they finish the questionaire succesfully, they will be taken to their 'matches overview' page, where they can find all the people who they have been matched with, based on the information they provided in the questionaire.

<!-- Take a look at this and generate more users -->
Users are currently matched, based on (where more criteria might follow):
* Age (if they fall within the age requirements, which the user has set in the questionaire)
* Gender (if they fall within the gender requirements, which the user has set in the questionaire)

The user can scroll through their matches, looking for people he or she wants to chat with and get things started.

Users can allways chat, if they have been matched together, so there is no 'like or no-like'-system. This has been specifically designed, so that even people who might look less good, but still have an interest in someone, are not immediately removed from the other persons list.

Users can navigate to a matched person's profile, where they will be able to read everything that that person has filled in in either the questionaire or while editing their profile. There is also a chat button on a match their profile page, which you can use to start (or continue) a chat with this person.

## Database

Traveler uses a NoSQL database ([MongoDB](https://www.mongodb.com)) to store it's data. The preferance of a NoSQL database over the SQL database is purely out of ease of use and familiarity. For communicating with the database Traveler uses [Mongoose](http://mongoosejs.com).

## Data

Currently there are over 1600 users in the database, all generated by [Mockaroo](https://mockaroo.com) and prepared by [Maikel van Veen](https://github.com/Maikxx), by changing certain data properties, which could not been done with purely using Mockaroo.

The data received by Mockaroo is in JSON-format, which the [transform tool](https://github.com/Maikxx/traveler-dating-app/blob/master/mockData/transformMockData.js) transforms to data types which correspond with the Mongoose types.

This transform tool generates correct bcrypted passwords (from passwords which are generated by Mockaroo, following the correct regular expression) for each user in the received data, which can be used to log the user in on Traveler.

If that succeeds, the user also gets some properties fixed, especially some issues with comma's (,), so that the data is correct for Mongoose (and the database).

When done with all the data, this script writes the formatted result to the MOCK_DATA.json file.

After transforming the data there is one more thing to do, which is deploying the mock data to Mongo, which is done with the [deploy tool](https://github.com/Maikxx/traveler-dating-app/blob/master/mockData/deployMockData.js).
Here the tool creates a mock schema, which resembles the real Mongoose schema, and makes a model out of it. This model is then used to instantiate (i.e. create) a new profile for that current iteration (user) of the MockData.json file. When all users are saved to the database, the connection with Mongo is closed again.

## Installing

```bash
git clone git@github.com:Maikxx/traveler-dating-app.git
cd traveler-dating-app
```

## Usage

Watch (and build) the css with:

```shell
gulp
```

Start the server using:

```shell
npm start
```

When those two are running go to <localhost:8000>.

<!-- Add this -->
<!-- ## Licence -->