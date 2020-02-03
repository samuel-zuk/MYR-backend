const request = require('supertest');
const app = require('../app');
const assert = require('assert');

const previewRef = "/apiv1/scenes/preview";
const sceneID = "5de934ec824a0a4598aa1fed";
const altSceneID = "5de93a961466c65b7fda92dc";
const validHeaders = {"x-access-token": "testing"};

const image = `${__dirname}/img.jpeg`;
const invalid_image = `${__dirname}/hi.jpeg`;

describe("Creating a preview image", () =>{
   test("Creating an image without a user ID should return 401", () =>{
        return request(app).post(`${previewRef}/${sceneID}`).attach(image).expect(401);
   });

   test("Creating an image with a invalid file should return 400", () => {
        return request(app).post(`${previewRef}/${sceneID}`).attach(invalid_image).set(validHeaders).expect(400);
   });
   test("Creating an image without attaching a file should return 400", () => {
       return request(app).post(`${previewRef}/${sceneID}`).set(validHeaders).expect(400);
   });
   test("Creating an image with the wrong user ID should return 401", () =>{
       return request(app).post(`${previewRef}/${sceneID}`).set({"x-access-token": "nope"}).attach(image).expect(401);
   });
   test("Creating an image without an existing scene should return 404", () =>{
        return request(app).post(`${previewRef}/bobross`).set(validHeaders).attach(image).expect(404);
   });
   test("Creating an image with everything valid should return 201", ()=> {
       return request(app).post(`${previewRef}/${sceneID}`).attach(image).set(validHeaders).expect(201);
   });
   test("Creating an image with an existing preview image should return 409", () => {
        return request(app).post(`${previewRef}/${sceneID}`).attach(image).set(validHeaders).expect(409);
   });
});

describe("Updating a preview image", () => {
    test("Updating an image without a user ID should return 401", () =>{
        return request(app).put(`${previewRef}/${sceneID}`).attach(image).expect(401);
   });

   test("Updating an image with a invalid file should return 400", () => {
        return request(app).put(`${previewRef}/${sceneID}`).attach(invalid_image).set(validHeaders).expect(400);
   });
   test("Updating an image without attaching a file should return 400", () => {
       return request(app).put(`${previewRef}/${sceneID}`).set(validHeaders).expect(400);
   });
   test("Updating an image with the wrong user ID should return 401", () =>{
       return request(app).put(`${previewRef}/${sceneID}`).set({"x-access-token": "nope"}).attach(image).expect(401);
   });
   test("Updating an image without an existing scene should return 404", () =>{
        return request(app).put(`${previewRef}/bobross`).set(validHeaders).attach(image).expect(404);
   });
   test("Updating an image with everything valid should return 201", ()=> {
       return request(app).put(`${previewRef}/${sceneID}`).attach(image).set(validHeaders).expect(201);
   });
   test("Updating an image without an existing preview image should return 409", () => {
        return request(app).put(`${previewRef}/${altSceneID}`).attach(image).set(validHeaders).expect(409);
   });
});
describe("Getting a preview image", () =>{
    test("Requesting a scene with no image should return 404", () => {
        return request(app).get(`${previewRef}/${altSceneID}`).expect(404);
    });
    //Would test images returned, but do not know how yet
});

describe("Deleting a preview image", () => {
    test("Deleting an image without a user ID should return 401", () =>{
        return request(app).delete(`${previewRef}/${sceneID}`).expect(401);
   });
   test("Deleting an image without an existing scene should return 404", () =>{
        return request(app).put(`${previewRef}/bobross`).set(validHeaders).expect(404);
    });
    test("Deleting an image with the wrong user ID should return 401", () =>{
        return request(app).delete(`${previewRef}/${sceneID}`).set({"x-access-token": "nope"}).expect(401);
    });
    test("Deleting an image without an existing scene should return 404", () =>{
        return request(app).delete(`${previewRef}/bobross`).set(validHeaders).expect(404);
    });
    test("Deleting an image with everything valid should return 204", () => {
        return request(app).delete(`${previewRef}/${sceneID}`).set(validHeaders).expect(204).then(() =>{
            return request(app).delete(`${previewRef}/${sceneID}`).set(validHeaders).expect(404);
        });
    });
});