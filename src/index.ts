import dotenv from 'dotenv';
import path from 'path';
import { FileViewModel, FoyerApiClient, GroupViewModel, SpaceViewModel, UserViewModel } from "@usefoyer/client";
import { LazyValue } from './lazy-value';

dotenv.config({ path: path.resolve(__dirname, '../.secrets') })

const URL = process.env.FOYER_JS_EXAMPLE_URL;
const KEY = process.env.FOYER_JS_EXAMPLE_KEY;

const client = new FoyerApiClient({ url: URL, key: KEY as string, });

const allStaffGroup =
    new LazyValue<GroupViewModel>(
        () => client.groups().getAllStaffGroup());

/**
 * Adds the given file to a Space with a client that has the given `email`.
 * @param firstName 
 * @param lastName 
 * @param email 
 * @param filePath the file path of the file to upload into the space
 */
export async function addFileToClientSpaceIfExists(
    firstName: string,
    lastName: string,
    email: string,
    filePath: string,
) {
    const user = await addOrGetClient(firstName, lastName, email);
    const space = await addOrGetSpaceForUser(user.id);
    await uploadLocalFile(space.id, filePath);
}

/**
 * Finds a space with the given userId as a member, otherwise creates a new one with the userId as a member (along with the All Staff Group).
 * 
 * @param userId the user that should be a member of the space
 * @returns the space view model of the new or existing space
 */
export async function addOrGetSpaceForUser(
    userId: string): Promise<SpaceViewModel> {
    let space = await findSpaceForUser(userId);
    if (!space) {
        space = await createSpaceForUser(userId);
    }
    return space;
}

/**
 * Finds a client with the given email address, if none is found create one with the given first name, last name and email address.
 */
export async function addOrGetClient(
    firstName: string,
    lastName: string,
    email: string): Promise<UserViewModel> {
    let user = await findUser(email);
    if (!user) {
        user = await createClientUser(firstName, lastName, email);
    }
    return user;
}

/**
 * Creates a new client user with the given information.
 * 
 * @param firstName the client's first name
 * @param lastName the client's last name
 * @param email the client's email address
 * @returns the newly created user's view model.
 */
export async function createClientUser(
    firstName: string,
    lastName: string,
    email: string): Promise<UserViewModel> {
    const user = await client.users().createClient({
        first_name: firstName,
        last_name: lastName,
        email,
        make_default_space: false, // if true, a space will be created for this user automatically
        send_registration_email: false, // if you want to send your own invitation email, keep this false (otherwise Foyer will send one for you)
    });
    return user;
}

/**
 * Uploads a file to a space from the local file system.
 * 
 * @param spaceId the space to upload the file to.
 * @returns the uploaded file's view model.
 */
export async function uploadLocalFile(spaceId: string, path: string): Promise<FileViewModel> {
    const file = await client
        .files(spaceId)
        .uploadFileFromLocalPath(
            { name: 'TestFile.json', },
            path);
    return file;
}

/**
 * Creates a new space with the All Staff Group and the given user as members.
 * 
 * @param userId the user to add as a member to the space.
 * @returns the newly created space
 */
export async function createSpaceForUser(userId: string): Promise<SpaceViewModel> {
    const space = await client.spaces().create({
        name: 'Quarterly Report',
        members: {
            users: [userId],
            groups: [(await allStaffGroup.get()).id],
        },
    });
    return space;
}

/**
 * Gets the first available space for this user. If none exist, returns null.
 * 
 * @param userId the user who may be a member on a space
 * @returns the space that has the given user as a member
 */
export async function findSpaceForUser(userId: string): Promise<SpaceViewModel | null> {
    const results = await client.spaces().search({
        member_filters: [{ user_id: userId, }],
    });
    if (results.count > 0) {
        return results.results[0];
    }
    return null;
}

/**
 * Gets the first available user that matches the given query string.
 */
export async function findUser(query: string): Promise<UserViewModel | null> {
    const results = await client.users().search({ query, });
    if (results.count > 0) {
        return results.results[0];
    }
    return null;
}