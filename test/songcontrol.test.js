const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../index'); // Import your Express app

const Song = require('../models/Song'); // Assuming Song model is defined in this file

// Simulate upload function
const uploadFileToS3 = async (folder, file) => {
  // Simulate S3 upload behavior, return a dummy URL
  return `https://dummy-s3-bucket/${folder}/${file.filename}`;
};

describe('Song Controller', () => {
  describe('createSong', () => {
    it('should create a new song', async () => {
      const req = {
        body: {
          name: 'Test Song',
          artist: 'Test Artist',
        },
        files: {
          audioFile: [
            {
              filename: 'test_audio.mp3',
            },
          ],
          thumbnailFile: [
            {
              filename: 'test_thumbnail.jpg',
            },
          ],
        },
      };

      // Stub the uploadFileToS3 function
      sinon.stub(uploadFileToS3, 'uploadFileToS3').callsFake((folder, file) => {
        return Promise.resolve(`https://dummy-s3-bucket/${folder}/${file.filename}`);
      });

      const saveStub = sinon.stub(Song.prototype, 'save').resolves({});

      const res = await supertest(app)
        .post('/create')
        .field('name', 'Test Song')
        .field('artist', 'Test Artist')
        .attach('audioFile', 'path/to/test_audio.mp3')
        .attach('thumbnailFile', 'path/to/test_thumbnail.jpg');

      expect(res.status).to.equal(201);
      expect(saveStub.calledOnce).to.be.true;

      // Clean up stubs
      uploadFileToS3.uploadFileToS3.restore();
      Song.prototype.save.restore();
    });

    it('should handle errors during song creation', async () => {
      const req = {
        body: {
          name: 'Test Song',
          artist: 'Test Artist',
        },
        files: {
          audioFile: [
            {
              filename: 'test_audio.mp3',
            },
          ],
          thumbnailFile: [
            {
              filename: 'test_thumbnail.jpg',
            },
          ],
        },
      };

      // Stub the uploadFileToS3 function to throw an error
      sinon.stub(uploadFileToS3, 'uploadFileToS3').rejects(new Error('Mocked error'));

      const res = await supertest(app)
        .post('/create')
        .field('name', 'Test Song')
        .field('artist', 'Test Artist')
        .attach('audioFile', 'path/to/test_audio.mp3')
        .attach('thumbnailFile', 'path/to/test_thumbnail.jpg');

      expect(res.status).to.equal(500);

      // Clean up stubs
      uploadFileToS3.uploadFileToS3.restore();
    });
  });

  describe('searchSongs', () => {
    it('should search for songs', async () => {
      const req = {
        query: {
          query: 'Test Query',
        },
      };

      const findStub = sinon.stub(Song, 'find').resolves([]);

      const res = await supertest(app).get('/search').query(req.query);

      expect(res.status).to.equal(200);
      expect(findStub.calledOnce).to.be.true;

      // Clean up stubs
      Song.find.restore();
    });

    it('should handle errors during song search', async () => {
      const req = {
        query: {
          query: 'Test Query',
        },
      };

      // Mocking the Song.find function to throw an error
      sinon.stub(Song, 'find').rejects(new Error('Mocked error'));

      const res = await supertest(app).get('/search').query(req.query);

      expect(res.status).to.equal(500);

      // Clean up stubs
      Song.find.restore();
    });
  });
});
