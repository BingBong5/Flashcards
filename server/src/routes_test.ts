import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { list, save, resetTranscriptsForTesting, savePracticeSession, loadFile } from './routes';


describe('routes', function () {

  it('save', function () {
    //first branch - name is undefined (1/2)
    const req1 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { value: "some stuff" } });
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
      'required argument "name" was missing');

    //first branch - name is undefined (2/2)
    const req2 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { value: true } });
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      'required argument "name" was missing');


    // second branch - body is undefined 1/2
    const req3 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "monica" } });
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
      'required argument "value" was missing');

    // second branch - body is undefined 2/2
    const req4 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "Anna", justin: "Bieiber" } });
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
      'required argument "value" was missing');

    //third branch, file already saved 1/2
    const req5 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "Bob", value: "Bill" } });
    const res5 = httpMocks.createResponse();
    save(req5, res5);
    const req6 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "Bob", value: "Brush" } });
    const res6 = httpMocks.createResponse();
    save(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(),
      { name: "Bob", "saved": false });

    //third branch, file already saved 2/2
    const req7 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "App", value: "a" } });
    const res7 = httpMocks.createResponse();
    save(req7, res7);
    const req8 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "App", value: "b" } });
    const res8 = httpMocks.createResponse();
    save(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(),
      { name: "App", "saved": false });

    // last branch - successfully saved file 1/2
    const req9 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "C", value: "b" } });
    const res9 = httpMocks.createResponse();
    save(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(),
      { name: "C", "saved": true });

    // last branch - successfully saved file 2/2
    const req10 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "P", value: "3" } });
    const res10 = httpMocks.createResponse();
    save(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(),
      { name: "P", "saved": true });

    resetTranscriptsForTesting();
  })

  it('savePracticeSession', function () {
    //first branch - args is not record (1/2)
    const req1 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { value: "some stuff" } });
    const res1 = httpMocks.createResponse();
    savePracticeSession(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
      'required argument "args" was missing');
    //first branch - args is not record (2/2)
    const req2 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { Ding: "dong" } });
    const res2 = httpMocks.createResponse();
    savePracticeSession(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      'required argument "args" was missing');


    //second branch - name is not string (1/2)
    const req3 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { boop: "doop" } } });
    const res3 = httpMocks.createResponse();
    savePracticeSession(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
      'required argument "name" was not a string');
    //second branch - name is not string (2/)
    const req4 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { ding: "bing" } } });
    const res4 = httpMocks.createResponse();
    savePracticeSession(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
      'required argument "name" was not a string');


    //third branch - deckname is not string (1/2)
    const req5 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "Fred" } } });
    const res5 = httpMocks.createResponse();
    savePracticeSession(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
      'required argument "deckName" was not a string');
    //third branch - deckname is not string (2/2)
    const req6 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "Dingus" } } });
    const res6 = httpMocks.createResponse();
    savePracticeSession(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
      'required argument "deckName" was not a string');


    //fourth branch - score is not number (1/2)
    const req7 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "a", deckName: "poop" } } });
    const res7 = httpMocks.createResponse();
    savePracticeSession(req7, res7);

    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
      'required argument "score" was not a number');
    //fourth branch - score is not number (2/2)
    const req8 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "b", deckName: "s" } } });
    const res8 = httpMocks.createResponse();
    savePracticeSession(req8, res8);

    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(),
      'required argument "score" was not a number');


    //fifth branch - record saved successfully (1/2)
    const req9 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "a", deckName: "b", score: 8 } } });
    const res9 = httpMocks.createResponse();
    savePracticeSession(req9, res9);

    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(),
      { "saved": true });
    //fifth branch - record saved successfully (1/2)
    const req10 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "po", deckName: "d", score: 90 } } });
    const res10 = httpMocks.createResponse();
    savePracticeSession(req10, res10);

    assert.strictEqual(res10._getStatusCode(), 200);
    assert.deepStrictEqual(res10._getData(),
      { "saved": true });

    resetTranscriptsForTesting();
  })

  it('list', function () {
    // 1/2
    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/list' });
    const res1 = httpMocks.createResponse();
    list(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), { values: { fileNames: [], practiceHistory: [] } });

    // 2/2
    const req9 = httpMocks.createRequest(
      { method: 'POST', url: '/api/savePracticeSession', body: { args: { name: "a", deckName: "b", score: 8 } } });
    const res9 = httpMocks.createResponse();
    savePracticeSession(req9, res9);
    const req10 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "P", value: "3" } });
    const res10 = httpMocks.createResponse();
    save(req10, res10);
    const req2 = httpMocks.createRequest(
      { method: 'GET', url: '/api/list' });
    const res2 = httpMocks.createResponse();
    list(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), { values: { fileNames: ["P"], practiceHistory: [{ name: "a", deckName: "b", score: 8 }] } });
    resetTranscriptsForTesting();
  });

  it('loadFile', function () {
    //first branch - name is undefined (1/2)
    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { value: "some stuff" } });
    const res1 = httpMocks.createResponse();
    loadFile(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
      'required argument "name" was missing');
    //first branch - name is undefined (2/2)
    const req2 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { bong: "a" } });
    const res2 = httpMocks.createResponse();
    loadFile(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      'required argument "name" was missing');


    //second branch - name is undefined (1/2)
    const req3 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { name: "po" } });
    const res3 = httpMocks.createResponse();
    loadFile(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 404);
    assert.deepStrictEqual(res3._getData(),
      'po not found in server');
    //second branch - name is undefined (2/2)
    const req4 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { name: "be" } });
    const res4 = httpMocks.createResponse();
    loadFile(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 404);
    assert.deepStrictEqual(res4._getData(),
      'be not found in server');


    //third branch - success! 1/2
    const req10 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "a", value: "b" } });
    const res10 = httpMocks.createResponse();
    save(req10, res10);
    const req5 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { name: "a" } });
    const res5 = httpMocks.createResponse();
    loadFile(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(),
      { name: "a", value: "b" });

    //third branch - success 2/2
    const req9 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "d", value: "0" } });
    const res9 = httpMocks.createResponse();
    save(req9, res9);

    const req6 = httpMocks.createRequest(
      { method: 'GET', url: '/api/loadFile', query: { name: "d" } });
    const res6 = httpMocks.createResponse();
    loadFile(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(),
      { name: "d", value: "0" });
    resetTranscriptsForTesting();
  });

});
