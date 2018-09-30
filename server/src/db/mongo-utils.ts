import { Task } from '@ts-task/task';
import { share, isInstanceOf } from '@ts-task/utils';
import { MongoClient, MongoError as _MongoError, Collection, ObjectId, FilterQuery, UpdateWriteOpResult } from 'mongodb';
import { Omit } from 'type-zoo/types';
import { dbSecrets } from '../secrets';

export class MongoError extends Error {
	MongoError = 'MongoError';

	constructor (public originalError: _MongoError) {
		super(originalError.message);
	}
}

/**
 * Tries to connect to a Mongo DB and returns a Task.
 * @param url
 */
export const createMongoConnection = (url: string) =>
	new Task<MongoClient, MongoError>((resolve, reject) => {
		MongoClient.connect(
			url, {
				useNewUrlParser: true
			}, (err, client) => {
				if (err) {
					reject(new MongoError(err));
				}
				else {
					resolve(client);
				}
			}
		);
	})
;

export type MongoDocumentId = ObjectId;

export interface MongoDocument {
	_id: MongoDocumentId;
}

export type UninsertedDocument <T> = Omit<T, '_id'>;

/**
 * Curried function that inserts a document into a collection, returning a Task with the result.
 * @param document
 */
const mongoInsertOne = <T extends MongoDocument>  (document: UninsertedDocument<T>) =>
	(collection: Collection<T>) =>
		new Task<T, MongoError | MongoInsertError>((resolve, reject) => {
			collection
				.insertOne(document, (err, result) => {
					if (err) {
						reject(new MongoInsertError(err));
					}
					else {
						if (result.insertedCount !== 1) {
							reject(new MongoInsertError(new Error('Could not insert the document')))
						}
						else {
							resolve(result.ops[0]);
						}
					}
				})
		})
;

/**
 * Curried function that searches for documents in a collection, based on a
 * criteria and returning a Task with the result.
 * @param criteria
 */
const mongoFind = <T extends MongoDocument> (criteria: FilterQuery<T>) =>
	(collection: Collection<T>) =>
		new Task<T[], MongoError>((resolve, reject) => {
			collection
				.find<T>(criteria)
				.toArray((err, result) => {
					if (err) {
						reject(new MongoError(err));
					}
					else {
						resolve(result);
					}
				});
		})
;

/**
 * Curried function that tries to delete a document from a collection, based on a criteria
 * and returning a Task with the result.
 * @param criteria
 */
const mongoDelete = <T extends MongoDocument> (criteria: FilterQuery<T>) =>
	(collection: Collection<T>) =>
		new Task<void, MongoError>((resolve, reject) => {
			collection
				.deleteOne(criteria, err => {
					if (err) {
						reject(new MongoError(err));
					}
					else {
						resolve(undefined);
					}
				})
		})
;

/**
 * Curried function that searches for one document in a collection, based on a
 * criteria and returning a Task with the result.
 * @param criteria
 */
const mongoFindOne = <T extends MongoDocument> (criteria: FilterQuery<T>) =>
	(collection: Collection<T>) =>
		new Task<T, MongoError | MongoDocumentDoesNotExistError<T>>((resolve, reject) => {
			collection.findOne(criteria, (err, result) => {
				if (err) {
					reject(new MongoError(err));
				}
				else {
					if (result === null) {
						reject(new MongoDocumentDoesNotExistError<T>(criteria));
					}
					else {
						resolve(result);
					}
				}
			});
		})
;

// Note I didn't implement the $unset and $rename update operators since I'm not using them
interface MongoUpdate <T> {
	$set?: Partial<T>;
}

/**
 * Curried function that updates a document in a collection, based on a criteria and returning
 * a Task to the result.
 * @param criteria
 * @param update
 */
const mongoUpdateOne = <T extends MongoDocument> (criteria: FilterQuery<T>, update: MongoUpdate<T>) =>
	(collection: Collection<T>) =>
		new Task<UpdateWriteOpResult, MongoError>((resolve, reject) => {
			collection.updateOne(criteria, update, (err, result) => {
				if (err) {
					reject(new MongoError(err));
				}
				else {
					resolve(result);
				}
			})
		})
;

/**
 * DB connection. Is a Task that is "shared" to avoid reconnecting with each query.
 * It takes the connection data from the "secrets".
 */
const dbCnx = dbSecrets
	.chain(({db}) =>
		createMongoConnection(`mongodb://${db.host}:${db.port}`)
			.map(client => client.db(db.dbName))
	)
	.pipe(share())
;


export class MongoInsertError extends Error {
	MongoInsertError = 'MongoInsertError';
	
	constructor (public originalError: Error) {
		super(originalError.message);
	}
}

export class MongoDocumentDoesNotExistError <T> extends Error {
	MongoDocumentDoesNotExist = 'MongoDocumentDoesNotExist';

	constructor (public criteria: FilterQuery<T>) {
		super('MongoDocument not found');
	}
}

export const getAllDocuments = <T extends MongoDocument> (collectionName: string) =>
	() =>
		dbCnx
			.map(db => db.collection(collectionName))
			.chain(mongoFind<T>({}))
;

export const insertOneDocument = <T extends MongoDocument> (collectionName: string) =>
	(document: UninsertedDocument<T>) =>
		dbCnx
			.map(db => db.collection(collectionName))
			.chain(mongoInsertOne<T>(document))
;

export const deleteDocument = <T extends MongoDocument> (collectionName: string) =>
	(id: MongoDocumentId) =>
		dbCnx
			.map(db => db.collection(collectionName))
			.chain(mongoDelete<T>({_id: id}))
;

export const findOneDocument = <T extends MongoDocument> (collectionName: string) =>
	(criteria: FilterQuery<T>) =>
		dbCnx
			.map(db => db.collection(collectionName))
			.chain(mongoFindOne(criteria))
;

export const updateOneDocument = <T extends MongoDocument> (collectionName: string) =>
	(criteria: FilterQuery<T>, update: MongoUpdate<T>) =>
		dbCnx
			.map(db => db.collection(collectionName))
			.chain(mongoUpdateOne(criteria, update))
;

/**
 * Util function to decide if an error is a MongoError
 */
export const isMongoError = isInstanceOf(MongoError, MongoInsertError);
