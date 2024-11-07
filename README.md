# Foyer JS Client Example

This repository provides an example of how to work with the [Foyer JS Client](https://github.com/usefoyer/foyer-js-client) to manage clients, spaces, and files within your [Foyer client portal](https://usefoyer.com/features/client-portal).

With this example, you’ll learn how to create and manage users, organize them into spaces, and handle file uploads directly through the Foyer API.

## Getting Started

To begin using this repository, clone it to your local machine and install the dependencies:

```bash
git clone https://github.com/usefoyer/foyer-js-client-example
cd foyer-js-client-example
npm install
```

### Setup

1. **Create an `.env` File**  
   For secure API access, create a `.env` file in the project root (or a `secrets` folder). This file will store your Foyer API credentials. Add the following lines to your `.env` file:

   ```bash
   FOYER_JS_EXAMPLE_URL=<your_foyer_api_url>
   FOYER_JS_EXAMPLE_KEY=<your_foyer_api_key>
   ```

2. **Configure Environment Variables**  
   This example uses the `dotenv` package to load environment variables. Make sure `.env` includes both `FOYER_JS_EXAMPLE_URL` and `FOYER_JS_EXAMPLE_KEY`, which allow the Foyer client to connect to the API.

## Usage

The main operations in this example include adding files to client spaces, creating and managing users, and managing spaces. Below is a brief overview of each function and how to use them.

### Functions Overview

- **addFileToClientSpaceIfExists**  
  Adds a file to a space associated with a client. If the client or space doesn’t exist, this function will create them.

  ```typescript
  async function addFileToClientSpaceIfExists(
      firstName: string,
      lastName: string,
      email: string,
      filePath: string,
  )
  ```

- **addOrGetClient**  
  Finds a client with the specified email or creates one if none exists.

  ```typescript
  async function addOrGetClient(
      firstName: string,
      lastName: string,
      email: string
  ): Promise<UserViewModel>
  ```

- **createClientUser**  
  Creates a new user with specified details.

  ```typescript
  async function createClientUser(
      firstName: string,
      lastName: string,
      email: string
  ): Promise<UserViewModel>
  ```

- **uploadLocalFile**  
  Uploads a file from the local file system to a specified space.

  ```typescript
  async function uploadLocalFile(spaceId: string, path: string): Promise<FileViewModel>
  ```

- **addOrGetSpaceForUser**  
  Finds a space associated with a user or creates a new one if none exists.

  ```typescript
  async function addOrGetSpaceForUser(userId: string): Promise<SpaceViewModel>
  ```

- **findSpaceForUser**  
  Searches for a space where the specified user is a member.

  ```typescript
  async function findSpaceForUser(userId: string): Promise<SpaceViewModel | null>
  ```

- **findUser**  
  Finds a user by their email address or other identifying information.

  ```typescript
  async function findUser(query: string): Promise<UserViewModel | null>
  ```

### Example Workflow

Here’s how you might use the functions from the example in your business's own workflow:

1. **Initialize the Foyer Client**

   ```typescript
   import dotenv from 'dotenv';
   import { FoyerApiClient } from "@usefoyer/client";

   dotenv.config();
   const URL = process.env.FOYER_JS_EXAMPLE_URL;
   const KEY = process.env.FOYER_JS_EXAMPLE_KEY;
   const client = new FoyerApiClient({ url: URL, key: KEY as string });
   ```

2. **Add a File to a Client’s Space**

   ```typescript
   import { addFileToClientSpaceIfExists } from './path-to-your-functions';

   await addFileToClientSpaceIfExists(
       'John',
       'Doe',
       'john.doe@example.com',
       '/path/to/file.json'
   );
   ```

   This process will:
   - Check if a user exists with the email `john.doe@example.com`. If not, it will create the user.
   - Find or create a space associated with this user.
   - Upload the specified file to the user's space.

## Additional Configuration

To customize even more client portal settings, refer to the [Foyer API documentation](https://usefoyer.com/api).
