const request = require('supertest');
const app = require('./../app');
const assert = require('assert');

const collectRef = "/apiv1/collections";

const populatedToken = ["r1squCvH0uTbobuoTV9G", "5ece88ff0d947fc9d912a437"]; //test@example.com
const emptyToken = ["xlhxDVnoUmRl8UltLdHo", "5ece8ace0d947fc9d912a438"]; //gordon@example.com

jest.mock("../apiv1/authorization/verifyAuth");

describe("Test collection fetching", () => {
    test("Not providing a user ID should return 400", () => {
        return request(app).get(collectRef).expect(400);
    });
    test("Providing an invalid user ID should return 401", () => {
        return request(app).get(collectRef).set({"x-access-token": "bobross"}).expect(401);
    });
    test("A valid user token, where the user does not own any collection should return 204", () => {
        return request(app).get(collectRef).set({"x-access-token": emptyToken[0]}).expect(204);
    });
    test("A valid user token with collections should return 200", () => {
        return request(app).get(collectRef).set({"x-access-token": populatedToken[0]}).expect(200).then((value) => {
            const json = value.body;

            assert(json[0].collectionID === "testing", `Collection Names for user "test@example.com" does not match!`);
            assert(json.length === 1, `Expected 1 collection for user "test@example.com", got ${json.length}`);
        });
    });
});

describe("Test collection existence endpoint", () => {
    test("A collection that doesn't exist should return 404", () => {
        return request(app).get(`${collectRef}/collectionID/bobross/exists`).expect(404);
    });
    test("A collection that does exist should return 200", () => {
        return request(app).get(`${collectRef}/collectionID/testing/exists`).expect(200);
    });
});

describe("Test collection creation", () => {
    test("Not providing a user ID should return 400", () => {
        return request(app).post(collectRef).send({"collectID": "bobross"}).expect(400);
    });
    test("Providing an invalid user ID should return 401", () => {
        return request(app).post(collectRef).set({"x-access-token": "bobross"}).send({"collectID": "bobross"}).expect(401);
    });
    test("Attempting to create a collection without a collectID key in the body should return 400", () => {
        return request(app).post(collectRef).set({"x-access-token": emptyToken[0]}).expect(400);
    });
    test("Attempting to create a collection with a taken name should return 409", () => {
        return request(app).post(collectRef).set({"x-access-token": emptyToken[0]}).send({"collectID": "testing"}).expect(409);
    });
    test("Creating a collection with proper credentials and a free name should return 201", () => {
        return request(app).post(collectRef).set({"x-access-token": emptyToken[0]}).send({"collectID": "bobross"}).expect(201).then((resp) => {
            const json = resp.body;

            assert(json.collectionID === "bobross", "Names do not match!");
        });
    });
});

describe("Test scene listing for collections", () => {
    test("Not providing a userID should return 400", () => {
        return request(app).get(`${collectRef}/collectionID/testing`).expect(400);
    });
    test("Providing an invalid userID should return 401", () => {
        return request(app).get(`${collectRef}/collectionID/testing`).set({"x-access-token": "bobross"}).expect(401);
    });
    test("Providing a user ID that does not own the collection should return 401", () => {
        return request(app).get(`${collectRef}/collectionID/testing`).set({"x-access-token": emptyToken[0]}).expect(401);
    });
    test("Providing the correct user ID should return 200 with a list of scenes in that collection", () => {
        return request(app).get(`${collectRef}/collectionID/testing`).set({"x-access-token": populatedToken[0]}).expect(200).then((resp) => {
            const json = resp.body;

            assert(json.length === 2, `Expected 2 scenes to be returned, got ${json.length}`);
        });
    });
    test("Providing the correct user ID on an empty collection should return 200 and an empty array", () => {
        return request(app).get(`${collectRef}/collectionID/bobross`).set({"x-access-token": emptyToken[0]}).expect(200).then((resp) => {
            assert(resp.body.length === 0, `Expected 0 elements, got ${resp.body.length}`);
        });
    });
    test("Fetching scenes from a non-existent collection should return 404", () => {
        return request(app).get(`${collectRef}/collectionID/bobbyjimbobphil`).set({"x-access-token": emptyToken[0]}).expect(404); 
    });
});

describe("Test collection deleting", () => { 
    test("Not providing a userID should return 400", () => {
        return request(app).delete(`${collectRef}/collectionID/bobross`).expect(400);
    });
    test("Providing an invalid userID should return 401", () => {
        return request(app).delete(`${collectRef}/collectionID/bobross`).set({"x-access-token": "bobross"}).expect(401);
    });
    test("Providing a user ID that does not own the collection should return 401", () => {
        return request(app).delete(`${collectRef}/collectionID/bobross`).set({"x-access-token": populatedToken[0]}).expect(401);
    });
    test("Deleting a non-existent collection should return 404", () => {
        return request(app).delete(`${collectRef}/collectionID/bobbyjimbobphil`).set({"x-access-token": emptyToken[0]}).expect(404);
    });
    test("Deleting a collection with proper authentication should return 204", () => {
        return request(app).delete(`${collectRef}/collectionID/bobross`).set({"x-access-token": emptyToken[0]}).expect(204);
    });
});